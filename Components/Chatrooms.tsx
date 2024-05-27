import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput, KeyboardAvoidingView, Platform, ScrollView, Image, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../Context/AuthContext';
import database from '@react-native-firebase/database';
type ChatRoom = {
    id: string;
    last_message: {
        text: string;
        timestamp: string;
    };
    participantIDs: string[];
};


export default function ChatRooms() {
    const navigation = useNavigation();
    const { userData } = useContext(AuthContext);
    const [usersFriends, setUsersFriends] = useState([]);
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const loadImage = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    const handleChatPress = (room: string, friend: object) => {
        navigation.navigate('chatscreen', { room, friend });
        console.log(friend);
    };

    const fetchUserDetails = async (userIds: string[]) => {
        try {
            const userDetails = await Promise.all(
                userIds.map(async (id) => {
                    const snapshot = await database().ref(`/User/${id}`).once('value');
                    const data = snapshot.val();
                    return data
                        ? {
                            userID: id,
                            email: data.email || '',
                            name: data.name || '',
                            photo: data.photo || ''
                        }
                        : { id, email: '', name: '', photo: '' };
                })
            );
            // Cập nhật state với danh sách chi tiết người dùng đã lấy được
            setUsersFriends(userDetails);
        } catch (error) {
            console.error('Error fetching user details: ', error);
        }
    };

    useEffect(() => {
        const chatRoomsRef = database().ref('/ChatRooms');

        const handleChatRoomsUpdate = (snapshot) => {
            const data = snapshot.val();
            const filteredChatRooms: ChatRoom[] = [];
            const newUsersFriendsIds: string[] = [];

            if (data) {
                for (const [key, value] of Object.entries(data)) {
                    if (typeof value === 'object' && value !== null) {
                        const room = value as {
                            last_message: {
                                text: string;
                                timestamp: string;
                            };
                            participantIDs?: string[];
                            participantIds?: string[];
                        };
                        const participantIDs = room.participantIDs || room.participantIds;
                        if (participantIDs && participantIDs.includes(userData.id)) {
                            filteredChatRooms.push({
                                id: key,
                                last_message: room.last_message,
                                participantIDs: participantIDs
                            });
                            const otherParticipantIDs = participantIDs.filter(id => id !== userData.id);
                            newUsersFriendsIds.push(...otherParticipantIDs);
                        }
                    }
                }
            }
            setChatRooms(filteredChatRooms);
            fetchUserDetails(newUsersFriendsIds);
        };
        chatRoomsRef.on('value', handleChatRoomsUpdate);

        return () => {
            chatRoomsRef.off('value', handleChatRoomsUpdate);
        };
    }, [userData.id]);

    const renderChatItem = ({ item }) => {
        const lastMessage = item.last_message;
        const otherParticipantId = item.participantIDs.find(id => id !== userData.id);
        const otherParticipant = usersFriends.find(friend => friend.userID === otherParticipantId);

        return (
            <TouchableOpacity style={styles.userList} onPress={() => handleChatPress(item.id, otherParticipant)}>
                <View style={styles.userChat}>
                    <Image source={{ uri: otherParticipant?.photo || loadImage }} style={styles.avatar} />
                    <View style={styles.userChatInfo}>
                        <Text style={styles.userName}>{otherParticipant?.name}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.lastMessage}>{lastMessage.text}</Text>
                            <Text style={styles.timelastMessage}>{new Date(lastMessage.timestamp).toLocaleTimeString()}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'android' ? 'padding' : 'height'}>

            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.goBack()}>
                            <Icon name="arrowleft" size={30} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.header_text}>Đoạn chat</Text>
                    </View>
                    <View style={styles.scroll}>
                        <View style={styles.searchBox}>
                            <Icon name='search1' size={30} color={'black'} style={styles.icon} />
                            <TextInput placeholder='Search' placeholderTextColor={'lightgray'} style={styles.searchText} />
                        </View>
                        <FlatList
                            data={chatRooms}
                            renderItem={renderChatItem}
                            keyExtractor={item => item.id}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>

        </KeyboardAvoidingView >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F8FC',
    },
    header: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center'
    },
    header_text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        alignSelf: 'center',
        marginLeft: 20,
    },
    searchBox: {
        height: 50,
        backgroundColor: 'white',
        marginHorizontal: 25,
        borderRadius: 20,
        elevation: 10,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    icon: {
        width: 40,
        height: 'auto',
        paddingLeft: 10,
        marginRight: 10,
    },
    searchText: {
        color: 'black',
        flex: 1,
    },
    scroll: {
    },
    avatar: {
        width: 60,
        height: 60,
        marginLeft: 10,
        borderRadius: 50,
        backgroundColor: 'white',
    },
    userList: {
        marginBottom: 10,
        marginHorizontal: 20,
    },
    userChat: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userChatInfo: {

    },
    lastMessage:
    {
        color: 'gray',
        fontSize: 15,
        paddingLeft: 15,
        width: '70%',
    },
    timelastMessage:
    {
        color: 'gray',
        fontSize: 12,
        paddingLeft: 15,
    },
    userName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
        paddingLeft: 15,
    },
});



