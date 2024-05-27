import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import database from '@react-native-firebase/database';
import { AuthContext } from '../Context/AuthContext';
import { useNavigation } from '@react-navigation/native';

interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userImg: string;
  userEmail: string;
  time: string;
  replies: Comment[];
}

export default function Comment({ courseId, courseType }: { courseId: string , courseType: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const replyInputRef = useRef<TextInput>(null);
  const { userData } = useContext(AuthContext);
  const [showReplies, setShowReplies] = useState(false);
  const [Replies, setReplies] = useState(false);
  const navigation = useNavigation();

  if (courseType !== 'basic' && courseType !== 'advance') {
    courseId = 'v' + courseId;
  }

  useEffect(() => {
    const fetchUserData = async (userId: string) => {
      const userSnapshot = await database().ref(`User/${userId}`).once('value');
      const userdata = userSnapshot.val();
      return {
        userName: userdata?.name || 'Unknown User',
        userImg: userdata?.photo || 'https://placekitten.com/50/50',
        userEmail: userdata?.email || 'Unknown Email',
      };
    };

    const fetchData = async () => {
      const db = database().ref(`Comment/${courseId}`);
      db.on('value', async snapshot => {
        const data = snapshot.val();
        const loadedComments: Comment[] = [];

        if (data) {
          for (let id in data) {
            const commentData = data[id];
            const userdata = await fetchUserData(commentData.userId);
            const replies = commentData.Reply
              ? await Promise.all(
                  Object.keys(commentData.Reply).map(async replyId => {
                    const replyData = commentData.Reply[replyId];
                    const replyUserData = await fetchUserData(replyData.userId);
                    return {
                      id: replyId,
                      ...replyData,
                      userName: replyUserData.userName,
                      userImg: replyUserData.userImg,
                      userEmail: replyUserData.userEmail,
                    };
                  })
                )
              : [];
            loadedComments.push({
              id,
              content: commentData.content,
              userId: commentData.userId,
              userName: commentData.userId === userData.id ? 'You' : userdata.userName,
              userImg: userdata.userImg,
              userEmail: userdata.userEmail,
              time: commentData.time,
              replies: replies.map(reply => ({
                ...reply,
                userName: reply.userId === userData.id ? 'You' : reply.userName,
              })),
            });
          }
        }

        setComments(loadedComments);
      });

      return () => db.off('value');
    };

    fetchData();
  }, [courseId]);


  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObject = {
        id: Date.now().toString(),
        userId: userData?.id || '',
        userName: userData?.name || 'New User',
        userImg: userData?.photo || 'https://placekitten.com/50/50',
        content: newComment.trim(),
        time: new Date().toLocaleTimeString(),
        replies: [],
      };
      database().ref(`Comment/${courseId}/${newCommentObject.id}`).set(newCommentObject);
      setNewComment('');
    }
  };

  const handleReplyComment = (commentId: string, userName: string) => {
    setReplies(true);
    setReplyTo(commentId);
    setReplyText(`@${userName} `);
    setTimeout(() => {
      if (replyInputRef.current) {
        replyInputRef.current.focus();
      }
    }, 100); // Delay to ensure the input renders before focusing
  };

  const handleSendReply = () => {
    if (replyText.trim() && replyTo) {
      const newReplyObject = {
        id: Date.now().toString(),
        userId: userData?.id || '',
        userName: userData?.name || 'New User',
        userImg: userData?.photo || 'https://placekitten.com/50/50',
        content: replyText.trim(),
        time: new Date().toLocaleTimeString(),
      };
      const updatedComments = comments.map(comment => {
        if (comment.id === replyTo) {
          const updatedReplies = [...comment.replies, newReplyObject];
          database()
            .ref(`Comment/${courseId}/${comment.id}/Reply/${newReplyObject.id}`)
            .set(newReplyObject);
          return { ...comment, replies: updatedReplies };
        }
        return comment;
      });
      setReplies(false);
      setComments(updatedComments);
      setReplyTo(null);
      setReplyText('');
    }
  };

  const handleCancelReply = () => {
    setReplies(false);
    setReplyTo(null);
    setReplyText('');
  };

  const handleShowReplies = (id) => {
    setReplyTo(id);
    setShowReplies(!showReplies);
  };

  const handleUserPress = (userID: string, name: string, email: string, img: string) => {
    if (userID === userData?.id) {
      navigation.navigate('profile', {userData: userData});
    } else {
      navigation.navigate('profile',{ friend:{ userID, name, email, photo: img }});
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View>
      <View style={styles.comment}>
        <Image source={{ uri: item.userImg }} style={styles.avatar} />
        <View style={styles.commentContent}>
          <TouchableOpacity onPress={() => handleUserPress(item.userId, item.userName, item.userEmail, item.userImg)}>
            <Text style={styles.name}>{item.userName}</Text>
          </TouchableOpacity>
          <Text style={styles.text}>{item.content}</Text>
          <Text style={styles.time}>{item.time}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => handleShowReplies(item.id)}>
              <Text style={styles.replyButton}>Reply ({item.replies.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReplyComment(item.id, item.userName)}>
              <Icon name="add-comment" size={20} color="black" />
            </TouchableOpacity>
          </View>

          {replyTo === item.id && showReplies && item.replies.length > 0 && (
            <View>
              {item.replies.map(reply => (
                <View key={reply.id} style={styles.reply}>
                  <Image source={{ uri: reply.userImg }} style={styles.avatar} />
                  <View style={styles.commentContent}>
                    <TouchableOpacity onPress={() => handleUserPress(reply.userId, reply.userName, reply.userEmail, reply.userImg)}>
                      <Text style={styles.name}>{reply.userName}</Text>
                    </TouchableOpacity>
                    <Text style={styles.text}>{reply.content}</Text>
                    <Text style={styles.time}>{reply.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.commentSection}>
        <Text style={styles.heading}>Comments</Text>
        <FlatList
          data={showAll ? comments : comments.slice(0, 3)}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          style={styles.commentList}
        />
        {comments.length > 3 && (
          <TouchableOpacity onPress={() => setShowAll(!showAll)}>
            <Text style={styles.showMore}>{showAll ? 'Show Less' : 'Show More'}</Text>
          </TouchableOpacity>
        )}
        {Replies === false && (
          <View style={styles.commentForm}>
            <TextInput
              style={styles.input}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Enter your comment..."
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
              <Icon name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {Replies &&replyTo && (
          <View style={styles.commentForm}>
            <TextInput
              style={[styles.input, { minHeight: 40 }]}
              value={replyText}
              onChangeText={setReplyText}
              placeholder="Enter your reply..."
              multiline={true}
              returnKeyType="done"
              ref={replyInputRef}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendReply}>
              <Icon name="send" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelReply}>
              <Icon name="cancel" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F6F8FC',
    padding: 10,
  },
  commentSection: {
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  heading: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentList: {
    marginBottom: 20,
  },
  comment: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    marginVertical: 5,
    color: '#555',
  },
  time: {
    fontSize: 12,
    color: '#555',
  },
  reply: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingLeft: 20,
  },
  replyButton: {
    paddingVertical: 5,
    paddingRight: 15,
    color: '#007BFF',
    marginTop: 5,
  },
  showMore: {
    color: '#007BFF',
    textAlign: 'center',
    marginVertical: 10,
  },
  commentForm: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyForm: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 10,
    color: 'black',
  },
  sendButton: {
    marginLeft: 5,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 4,
  },
  cancelButton: {
    marginLeft: 5,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 4,
  },
});
