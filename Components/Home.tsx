/* eslint-disable prettier/prettier */
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
import  Icon  from 'react-native-vector-icons/AntDesign';
const { width, height } = Dimensions.get('window');


export default function Home(this: any): React.JSX.Element {
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'android' ? 'padding' : 'height'}>
            <View style={styles.container}>
                <WelcomeHeader />
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={styles.searchBox}>
                        <Icon name='search1' size={30} color={'black'} style={styles.icon} />
                        <TextInput placeholder='Search' placeholderTextColor={'lightgray'} style={styles.searchText} />
                    </View>
                </TouchableWithoutFeedback>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                    {/* <Image source={require('../img/introduce.png')} style={styles.img_introduce} /> */}
                    <Slider />
                    <VideoCourses />
                    <Course />
                </ScrollView>
            </View>

        </KeyboardAvoidingView>
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
});


