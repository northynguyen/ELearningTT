 /* eslint-disable quotes */
import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/AntDesign';

type LessonInfo = {
    id: string;
    name: string;
};

export default function CourseContent({ id, courseType, userProgress, courseDetail }: { id: string, courseType: string, userProgress: any, courseDetail: any }) {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [lessons, setLessons] = useState<LessonInfo[]>([]);
    const [dtbase, setDatabase] = useState('');

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            let db;
            if (courseType === 'text' || courseType === 'advance') {
                db = database().ref(`/CourseList/${id}/Lesson`);
                setDatabase(`/CourseList/${id}/Lesson`);
            } else {
                db = database().ref(`/VideoSource/${id}/Lesson`);
                setDatabase(`/VideoSource/${id}/Lesson`);
            }
            const listener = db.on('value', (snapshot) => {
                const data = snapshot.val();
                const loadedLessons: LessonInfo[] = [];
                if (data) {
                    for (let id in data) {
                        if (data[id] && data[id].Name) {
                            loadedLessons.push({
                                id,
                                name: data[id].Name,
                            });
                        }
                    }
                }
                setLessons(loadedLessons);
                setLoading(false);
            });
            return () => db.off('value', listener);
        };
        fetchData();
    }, [id, courseType]);

    if (loading) {
        return <Text style={{ fontSize: 20, color: 'black' }}>Loading...</Text>;
    }

    const checkUserProgress = (contentId:string)=>{
      if (!userProgress) return false;
      if (courseType !== 'text' && courseType !== 'advance') {
        return false;
      }
      console.log(userProgress);
      return userProgress.find(item=>item.lessonid === contentId);
    };


    const onChapterPress = (lesson: LessonInfo) => {
        if (courseType === 'text' || courseType === 'advance') {
            navigation.navigate('course-chapter', { lesson, ref: dtbase, courseId: id, courseDetail: courseDetail });
        } else {
            navigation.navigate('play-video', { lesson, ref: dtbase, courseId: id });
        }
    };

    return (
        <View style={{ marginTop: 10 }}>
            <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'black' }}>Course Content</Text>
                <TouchableOpacity style={{paddingBottom:10}}>
                    <Icon name= "plussquareo" size={30} color="black" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={lessons}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        onPress={() => onChapterPress(item)}
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            backgroundColor: "white",
                            marginBottom: 5,
                            padding: 13,
                            alignItems: 'center',
                            borderRadius: 5,
                        }}>
                        {checkUserProgress(item.id) ? (
                            <Icon
                                name="checkcircle"
                                size={24}
                                color={"green"}
                                style={{ marginRight: 20 }}
                            />
                        ) : (
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: 20,
                                    color: "gray",
                                    marginRight: 20,
                                }}>
                                {index + 1}
                            </Text>
                        )}
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'black' }}>
                            {item.name}
                        </Text>
                        <Icon
                            name="playcircleo"
                            size={24}
                            style={{ position: 'absolute', right: 10 }}
                            color={"blue"}
                        />
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={true}
                style={{ height: '36%', marginTop: 10 }}
            />
        </View>
    );
}
