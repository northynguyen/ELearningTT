import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Components/Home';
import CoursesDetails from '../Components/CoursesDetails';

const Stack = createNativeStackNavigator();
export default function HomeNavigation() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="home" component={Home} ></Stack.Screen>
            <Stack.Screen name="course-detail" component={CoursesDetails} ></Stack.Screen>

        </Stack.Navigator>
    )
}