/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import CourseContent from './CoureContent';
interface Course {
    Topic: any[];
    id: string;
    image: string;
    name: string;
    lessonCount: number;
    type: string;
}

export default function CoursesDetails() {
    const param = useRoute().params;
    const [course, setCourse] = useState([]);
    const [userProgress,setUserProgress] = useState([]);
    useEffect(() => {
        setCourse(param.courseDetail);
        console.log(param.courseDetail);
    }, []);

    const navigation = useNavigation();
    return (
        <View style={{padding:20,paddingTop:20}}>
            <TouchableOpacity style={{paddingBottom:10}} onPress={()=>navigation.goBack() }>
                <Icon name= "arrowleft" size={30} color="black" />
            </TouchableOpacity>
            <View>
                <Text style={{fontSize:20,fontWeight:'bold',color:"black"}}>{param.courseDetail?.name}</Text>
                <Text style={{color : "gray"}}>By Tubeguruji</Text>
                <Image source={{uri:param.courseDetail?.image}}
                    style={{height:150,marginTop:10,borderRadius:10}} />
                <Text style={{marginTop:10,
                   fontSize:16, fontWeight:'bold', color:"black"}}>About Course
                </Text>
                <ScrollView style={{ height:80,marginTop:10}}>
                    <Text
                        style={{color:"gray",textAlign:"justify"}}>{param.courseDetail?.description}
                    </Text>
                </ScrollView>
            </View>
            <CourseContent id={param.courseDetail?.id} courseType={param.courseDetail?.type} />
        </View>
    )
}
