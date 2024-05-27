/* eslint-disable jsx-quotes */
import React, { useContext, useEffect, useState } from 'react';

import {
    ActivityIndicator,
    Dimensions,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useColorScheme,
    View,
    VirtualizedList,
} from 'react-native';
import WelcomeHeader from './WelcomeHeader';
import Slider from './Slider';

import Course from './Course';
import VideoCourses from './VideoCourses';
import Icon from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../Context/AuthContext';
import { onGoogleLogout } from '../API/HandleLoginGoogle';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '@react-native-firebase/database';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/Fontisto';
const { width, height } = Dimensions.get('window');

export default function Home(this: any): React.JSX.Element {
    const { userData, setUserData } = useContext(AuthContext);
    const [showOptions, setShowOptions] = useState(false);
    const navigation = useNavigation();
    const handleToggleOptions = () => {
        setShowOptions(!showOptions);
    };
    const handleLogout = async () => {
        await onGoogleLogout(setUserData);
    };
    const handleProfile = () => {
        navigation.navigate('profile', { userData: userData });
    };
    const handleMessage = () => {
        navigation.navigate('chatrooms');
    };

    const importUserData = async () => {
        try {
            const db = firebase.database().ref('/User');
            const snapshot = await db.orderByChild('email').equalTo(userData.email).once('value');

            if (snapshot.exists()) {
                console.log('User already exists:', userData.email);
                snapshot.forEach((childSnapshot) => {
                    const existingUserData = childSnapshot.val();
                    const userId = childSnapshot.key;
                    setUserData({ ...existingUserData, id: userId });
                    return true; // Exit the forEach loop
                });
            }
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    useEffect(() => {
        importUserData();
    }, []);
    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={styles.UI_userInfo}>
                <View style={styles.hello}>
                    <Text style={{ fontSize: 10, color: 'black' }}>Hello</Text>
                    <Text style={{ fontSize: 15, color: 'black' }}>{userData?.name}</Text>
                </View>
                <TouchableOpacity onPress={handleToggleOptions}>
                    <View>
                        <Image source={{ uri: userData?.photo }} style={styles.avatar} />
                    </View>
                </TouchableOpacity>
            </View>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'android' ? 'padding' : 'height'}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        <View style={styles.searchBox}>
                            <Icon name='search1' size={30} color={'black'} style={styles.icon} />
                            <TextInput placeholder='Search' placeholderTextColor={'lightgray'} style={styles.searchText} />
                        </View>
                    </TouchableWithoutFeedback>
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                        <Slider />
                        <VideoCourses />
                        <Course />
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
            {showOptions && (
                <View style={styles.optionsContainer}>
                    <TouchableOpacity onPress={handleProfile}>
                        <View style={styles.optionsContainer_cnt}>
                            <Icon1 name='person-circle-outline' size={32} color={'black'} style={{ marginRight: 5 }} />
                            <Text style={styles.optionsContainer_Text}>Thông tin cá nhân</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleMessage}>
                        <View style={styles.optionsContainer_cnt}>
                            <Icon3 name='messenger' size={26} color={'black'} style={{ marginRight: 5 }} />
                            <Text style={styles.optionsContainer_Text}>Tin nhắn</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout}>
                        <View style={styles.optionsContainer_cnt}>
                            <Icon2 name='log-out' size={27} color={'black'} style={{ marginRight: 5 }} />
                            <Text style={styles.optionsContainer_Text}>Đăng xuất</Text>
                        </View>

                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F8FC',
    },
    searchBox: {
        height: 70,
        backgroundColor: 'white',
        marginHorizontal: 25,
        borderRadius: 10,
        elevation: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 10,
        marginLeft: 20,
    },
    searchText: {
        color: 'black',
        flex: 1,
    },
    content:
    {

    },
    containerCourses: {
        height: 150,
        margin: 20,

    },
    headerCourses: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },


    img_courses: {
        height: 112.5,
        width: 200,
        resizeMode: 'contain',
        marginRight: 10,
    },
    scrollCourses: {
    },

    UI_userInfo: {
        marginTop: 20,
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    hello: {
        paddingLeft: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        marginRight: 20,
        borderRadius: 50,
    },
    optionsContainer: {
        position: 'absolute',
        top: 80,
        right: 10,
        backgroundColor: '#F6F8FF',
        padding: 10,
        borderRadius: 5,
        width: "auto",
        height: "auto",
        justifyContent: 'space-between',
    },
    optionsContainer_Text: {
        fontSize: 15,
        color: 'black',
        padding: 10,
    },
    optionsContainer_cnt: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
});



