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
const { width, height } = Dimensions.get('window');

export default function Home(this: any): React.JSX.Element {
    const { userData, setUserData } = useContext(AuthContext);
    const [showOptions, setShowOptions] = useState(false);
    const handleToggleOptions = () => {
        console.log('Toggle Options');
        setShowOptions(!showOptions);
    };
    const handleLogout = async () => {
        await onGoogleLogout(setUserData);
    };

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
                    <TouchableOpacity onPress={handleLogout}>
                        <Text style={{ fontSize: 15, color: 'black' }}>Logout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity >
                        <Text style={{ fontSize: 15, color: 'black' }}>Thông tin cá nhân</Text>
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
        backgroundColor: 'grey',
        padding: 10,
        borderRadius: 5,
        width: 130,
        height: 130,
    },
});



