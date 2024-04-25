import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';

export default function CoursesDetails() {
    const param = useRoute().params;
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        console.log(param.courses);
        setCourses(param.courses);

    }, [])
    return (
        <View>
            <Text>CoursesDetails</Text>
        </View>
    )
}