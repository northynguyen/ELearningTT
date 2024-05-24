/* eslint-disable quotes */
import { firebase } from '@react-native-firebase/database';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/AntDesign';
import { WebView } from 'react-native-webview';

interface videoinfo {
  description: string;
  id: string;
  name: string;
  url: string;}

interface contentinfo {
  name: string;
}
export default function CourseContentInsert() {
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [youtubeLink, setYoutubeLink] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<videoinfo|null>(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<contentinfo|null>(null);
  const param = useRoute().params;
  const  courseType  = param.courseType;
  const navigation = useNavigation();

  const saveData = async () => {
    if (courseType === 'basic' || courseType === 'advance') {
      if ( !title ) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      else {
        try {
          console.log(param?.ref);
          const db = firebase.database().ref(param?.ref );
          if (videoInfo) {
            await db.child(videoInfo.id).update({
              Name: title,
            });
            const updatedVideoInfo = { ...content, title };
            Alert.alert('Success', 'Course updated successfully', [
              { text: 'OK', onPress: () => navigation.navigate('course-detail', { content: updatedVideoInfo, courseDetail: param.courseDetail }) },
            ]);
          } else {
            const snapshot = await db.once('value');
            const numberOfCourses = snapshot.numChildren();

          // Tạo một khóa học mới với ID là số lượng khóa học hiện có + 1
          const newCourseRef = db.child((numberOfCourses ).toString());
            await newCourseRef.set({
              Name: title,
            });
            const updatedVideoInfo = { ...content, name: title };
            Alert.alert('Success', 'Course updated successfully', [
              { text: 'OK', onPress: () => navigation.navigate('course-detail', { content: updatedVideoInfo , courseDetail: param.courseDetail }) },
            ]);
          }
        } catch (error) {
          Alert.alert('Error', 'There was an error saving the course');
          console.error(error);
        }
      }
    }

    else{
      if (!youtubeLink) {
        Alert.alert('Error', 'Please provide a YouTube link');
        return;
      }

      // Lấy ID video từ URL YouTube
      const videoId = getYouTubeVideoId(youtubeLink);

      // Kiểm tra các trường dữ liệu còn lại
      if (!description || !title ) {
          Alert.alert('Error', 'Please fill in all fields');
          return;
      }

      else {
        try {
          console.log(param?.ref);
          const db = firebase.database().ref(param?.ref );

          if (videoInfo) {
            await db.child(videoInfo.id).update({
              Description: description,
              Name: title,
              Url: videoId,
            });
            const updatedVideoInfo = { ...videoInfo, description, name: title, url: videoId, type: courseType };
            Alert.alert('Success', 'Course updated successfully', [
              { text: 'OK', onPress: () => navigation.navigate('play-video', { videoInfo: updatedVideoInfo }) },
            ]);
          } else {
            const newCourseRef = db.push();
            await newCourseRef.set({
              Description: description,
              Name: title,
              Url: videoId,
            });
            Alert.alert('Success', 'Course created successfully', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          }
        } catch (error) {
          Alert.alert('Error', 'There was an error saving the course');
          console.error(error);
        }
      }
    }
};

const getYouTubeVideoId = (url: string) => {
    // Sử dụng biểu thức chính quy để trích xuất ID video từ URL YouTube
    const match = url.match(/(?:youtu\.be\/|watch\?v=)([^&]+)/);
    return match ? match[1] : null;
};

  const cancelData = () => {
    setDescription('');
    setTitle('');
    setYoutubeLink(null);
  };

  useEffect(() => {
    if (param?.videoInfo) {
      const videoInfo = param?.videoInfo as videoinfo;
      setVideoInfo(videoInfo);
      setDescription(videoInfo.description);
      setTitle(videoInfo.name);
      setYoutubeLink(`https://www.youtube.com/watch?v=${videoInfo.url}`);
    }
  }, [param?.videoInfo]);
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={100} // Adjust this value if needed
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity style={{ paddingBottom: 10 }} onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={30} color="black" />
        </TouchableOpacity>
      </View>
      {(courseType !== 'basic' && courseType !== 'advance') && (
        <>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            returnKeyType="done"
          />

          <Text style={styles.label}>YouTube Link</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter YouTube link"
            value={youtubeLink || ''}
            onChangeText={setYoutubeLink}
            multiline={true}
            returnKeyType="done"
          />
          {youtubeLink && (
            <WebView
              style={styles.video}
              javaScriptEnabled={true}
              source={{ uri: youtubeLink }}
            />
          )}
        </>
      )}
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
        multiline={true}
        returnKeyType="done"
      />

      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={saveData} />
        <Button title="Cancel" onPress={cancelData} />
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F6F8FC',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  input: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    color: 'black',
  },
  video: {
    height: 200,
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonContainer: {
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
