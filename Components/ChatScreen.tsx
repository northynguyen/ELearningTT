import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, TouchableOpacity, Platform, Keyboard, Image, TextInput } from 'react-native'
import React, { useContext, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../Context/AuthContext';
import Icon from 'react-native-vector-icons/AntDesign';
import ChatContent from './ChatContent';
import database from '@react-native-firebase/database';
export default function ChatScreen() {
    const navigation = useNavigation();
    const [message, setMessage] = useState('');
    const route = useRoute();
    const { room, friend } = route.params;
    const { userData } = useContext(AuthContext);
    const handleSend = () => {
        if (message.trim().length > 0) {
            const currentTime = new Date();
            currentTime.setHours(currentTime.getUTCHours() + 7); // Adjust to +7:00 timezone
            const timestamp = currentTime.toISOString();

            const messageData = {
                receiverId: friend.id,
                senderId: userData.id,
                text: message,
                timestamp: timestamp
            };

            const newMessageRef = database().ref(`/ChatRooms/${room}/messages`).push();

            const updates = {};
            updates[`/ChatRooms/${room}/messages/${newMessageRef.key}`] = messageData;
            updates[`/ChatRooms/${room}/last_message`] = {
                text: message,
                timestamp: timestamp
            };

            database().ref().update(updates)
                .then(() => {
                    console.log("Message sent and last_message updated!");
                    setMessage(''); // Clear the message input only on successful send
                })
                .catch(error => {
                    console.error("Failed to send message and update last_message: ", error);
                });
        }
    };
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'android' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.header_left}>
                            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.goBack()}>
                                <Icon name="arrowleft" size={30} color="black" />
                            </TouchableOpacity>
                            <Image source={{ uri: friend.photo }} style={styles.avatar} />
                            <Text style={styles.userName}>{friend.name}</Text>
                        </View>
                        <Image source={require('../img/info.png')} style={{ height: 30, width: 30 }} />
                    </View>
                    <ChatContent chatRoomID={room} friendID={friend.id} />
                    <View style={styles.footerInput}>
                        <TextInput placeholder='Nhắn tin' placeholderTextColor={'gray'} value={message} onChangeText={setMessage} style={styles.message} />
                        <TouchableOpacity onPress={handleSend} style={{ flex: 1 }}>
                            <Image source={require('../img/send.png')} style={{ height: 30, width: 30, }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>

        </KeyboardAvoidingView >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEF0F1',
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 20,
        backgroundColor: 'white',
    },
    header_left: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',

    },
    avatar: {
        width: 40,
        height: 40,
        marginLeft: 10,
        borderRadius: 50,
        backgroundColor: 'white',
    },
    userName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
        paddingLeft: 15,
    },
    message: {
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 30,
        color: 'black',
        flex: 9,
    },
    footerInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        paddingEnd: 20,
    }
})