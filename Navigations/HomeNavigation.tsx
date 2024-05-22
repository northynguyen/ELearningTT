/* eslint-disable eol-last */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Components/Home';
import CoursesDetails from '../Components/CoursesDetails';
import CourseChapter from '../Components/CourseChapter';
import PlayVideo from '../Components/PlayVideo';
import VideoCoursesInsert from '../Components/VideoCourseInsert';
import CourseInsert from '../Components/CourseInsert';
import CourseContentInsert from '../Components/CourseContentInsert';

const Stack = createNativeStackNavigator();

export default function HomeNavigation() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="home" component={Home} />
            <Stack.Screen name="course-detail" component={CoursesDetails} />
            <Stack.Screen name="course-chapter" component={CourseChapter} />
            <Stack.Screen name="play-video" component={PlayVideo} />
            <Stack.Screen name="insert-video-course" component={VideoCoursesInsert} />
            <Stack.Screen name="insert-course" component={CourseInsert} />
            <Stack.Screen name="insert-course-content" component={CourseContentInsert} />
        </Stack.Navigator>
    );
}