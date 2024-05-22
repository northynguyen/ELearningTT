/* eslint-disable space-infix-ops */
/* eslint-disable quotes */
/* eslint-disable semi */
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import CourseContent from './CoureContent';
import database from '@react-native-firebase/database';
import { AuthContext } from '../Context/AuthContext';
import { checkUserRole } from '../Context/checkUser';

interface Course {
    description: string;
    id: string;
    image: string;
    name: string;
    type: string;
}

export default function CoursesDetails() {
    const param = useRoute().params;
    const [course, setCourse] = useState({} as Course);
    const { userData } = useContext(AuthContext);
    const [userProgress, setUserProgress] = useState([]);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        setCourse(param?.courseDetail);
        console.log(course);
        getCourseProgress();
    }, [param?.courseContentId]);

    const getCourseProgress = async () => {
        try {
            const uid = userData.id;
            const courseId = param?.courseDetail.id;
            const snapshot = await database()
                .ref('CourseProgress')
                .orderByChild('userid')
                .equalTo(uid)
                .once('value');
            const data = snapshot.val();
            if (data) {
                // Filter data by courseId
                const result = Object.keys(data)
                    .filter(key => data[key].courseid === courseId)
                    .map(key => ({
                        id: key,
                        courseid: data[key].courseid,
                        lessonid: data[key].lessonid,
                    }));
                setUserProgress(result);
                console.log(result);
            }
        } catch (error) {
            console.error('Error fetching course progress:', error);
            // Handle error gracefully (e.g., show error message to user)
        }
    };

    const navigation = useNavigation();
    const fallbackImage = 'https://via.placeholder.com/150';

    const fetchUserRole = async () => {
        const role = await checkUserRole(userData);
        setIsUserAdmin(role);
    };

    useEffect(() => {
        fetchUserRole();
    }, []);

    const editCourse = () => {
        if (course.type === 'basic' || course.type === 'advance') {
            navigation.navigate('insert-course', { courseDetail: course });
        }
        else {
            navigation.navigate('insert-video-course', { courseDetail: course });
        }
    }
    return (
        <View style={{ padding: 20, paddingTop: 20, flex: 1 }}>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <TouchableOpacity style={{ paddingBottom: 10 }} onPress={() => navigation.goBack()}>
                    <Icon name="arrowleft" size={30} color="black" />
                </TouchableOpacity>
                {isUserAdmin && (
                    <TouchableOpacity style={{ paddingBottom: 10 }} onPress={editCourse}>
                        <Icon name="setting" size={30} color="black" />
                    </TouchableOpacity>
                )}
            </View>
            <ScrollView>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: "black" }}>{course.name}</Text>
                    <Text style={{ color: "gray" }}>By Tubeguruji</Text>
                    <Image source={{ uri: course.image || fallbackImage }}
                        style={{ height: 150, marginTop: 10, borderRadius: 10 }} />
                    <Text style={{
                        marginTop: 10,
                        fontSize: 16, fontWeight: 'bold', color: "black"
                    }}>About Course
                    </Text>
                    <Text
                        style={{ color: "gray", textAlign: "justify" }}>{course.description}
                    </Text>
                </View>

                <CourseContent id={course.id} courseType={course.type} userProgress={userProgress} courseDetail={course} />
            </ScrollView>

        </View>
    )
}

