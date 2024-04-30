/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Components/Home';
import CoursesDetails from '../Components/CoursesDetails';
import CourseChapter from '../Components/CourseChapter';
import PlayVideo from '../Components/PlayVideo';

const Stack = createNativeStackNavigator();
export default function HomeNavigation() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="home" component={Home} ></Stack.Screen>
            <Stack.Screen name="course-detail" component={CoursesDetails} ></Stack.Screen>
            <Stack.Screen name="course-chapter" component={CourseChapter} ></Stack.Screen>
            <Stack.Screen name="play-video" component={PlayVideo} ></Stack.Screen>
        </Stack.Navigator>
    );
}