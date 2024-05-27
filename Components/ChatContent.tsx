import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import database from '@react-native-firebase/database';
import { AuthContext } from '../Context/AuthContext';

type Message = {
    receiverId: string;
    senderId: string;
    text: string;
    timestamp: string;
};

const ChatContent = ({ chatRoomID }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('');
    const { userData } = useContext(AuthContext);

    useEffect(() => {
        const messagesRef = database().ref(`/ChatRooms/${chatRoomID}/messages`);

        const handleNewMessages = (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setMessages(Object.values(data));
            } else {
                setMessages([]);
            }
        };

        messagesRef.on('value', handleNewMessages);
        return () => {
            messagesRef.off('value', handleNewMessages);
        };
    }, [chatRoomID]);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        };
        let formattedDate = new Intl.DateTimeFormat('vi-VN', options).format(date).replace(',', ' ');
        return formattedDate;
    };
    const renderItem = ({ item }) => {
        const isUser = item.senderId === userData.id;
        const messageStyle = isUser ? styles.messageUser : styles.messageFriend;
        const timeStyle = isUser ? styles.timeUser : styles.timeFriend;

        return (
            <View style={messageStyle}>
                <Text style={timeStyle}>{formatTimestamp(item.timestamp)}</Text>
                <View style={isUser ?styles.usertextContainer:styles.friendtextContainer}>
                    <Text style={styles.text}>{item.text}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                inverted
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    usertextContainer: {
        backgroundColor: '#6699CC',       
        paddingVertical: 18,
        paddingHorizontal: 15,
        borderRadius: 25,
        elevation: 5,
        maxWidth: '80%',
        marginBottom: 20,
    },
    friendtextContainer: {
        backgroundColor: '#EEF0F1',
        paddingVertical: 18,
        paddingHorizontal: 15,
        borderRadius: 25,
        elevation: 5,
        maxWidth: '80%',
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        color: 'black',
    },
    timeFriend: {
        fontSize: 10,
        color: 'gray',
    },
    timeUser: {
        fontSize: 10,
        color: 'gray',
        textAlign: 'right',
    },
    messageFriend: {
        alignSelf: 'flex-start',
    },
    messageUser: {
        alignSelf: 'flex-end',
    },
});

export default ChatContent;
