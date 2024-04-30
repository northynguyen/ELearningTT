/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/AntDesign';

type LessonInfo = {
    id: string;
    name: string;
  };
export default function CourseContent({ id , courseType}: { id: string , courseType: string}) {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [lessons, setLessons] = useState<LessonInfo[]>([]);
    const [dtbase, setDatabase] = useState('');
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
          var db: any;
          if (courseType === 'text' || courseType === 'advance') {
              db = database().ref('/CourseList/' + id + '/Lesson');
              setDatabase('/CourseList/' + id + '/Lesson');
          }
          else {
              console.log('.........../VideoSource/' + id + '/Lesson');
              db = database().ref('/VideoSource/' + id + '/Lesson');
              setDatabase('/VideoSource/' + id + '/Lesson');
          }
          console.log('.;;;'+db);
          const listener = db.on('value', (snapshot: { val: () => any; }) => {
            const data = snapshot.val();
            console.log(data);
            const loadedLessons = [];
            // Kiểm tra data không phải là null hoặc undefined trước khi lặp
            if (data) {

              for (let id in data) {
                // Kiểm tra thêm để đảm bảo data[id] không phải là null hoặc undefined
                if (
                    data[id] &&
                    data[id].Name 
                ) {
                    console.log("them vao 1");
                  loadedLessons.push({
                    id,
                    name: data[id].Name,
                  });
                }
              }
            }
            setLessons(loadedLessons);
            console.log(loadedLessons);
            setLoading(false);
          });
          return () => db.off('value', listener); // Clean up the listener on unmount
        };
        fetchData();
      }, []);
      if (loading) {
        return <Text style={{fontSize: 20, color: 'black'}}>Loading...</Text>;
      }
    // const checkUserProgress = (contentId: any) => {
    //     return userProgress.find(item => item.courseContentId == contentId);
    // };

    const onChapterPress = (lesson:LessonInfo)=>{
        if (courseType === 'text' || courseType === 'advance')
        {
          navigation.navigate('course-chapter',{lesson,ref:dtbase})
        }
      else {
        navigation.navigate('play-video',{lesson,ref:dtbase})
      }
    }
  
    return (
        <View style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'black' }}>Course Content</Text>
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
                        {/* {checkUserProgress(item.id) ? (
                            <Ionicons
                                name="checkmark-circle"
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
                        )} */}
                        <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: 20,
                                    color: "gray",
                                    marginRight: 20,
                                }}>
                                {index + 1}
                        </Text>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'black' }}>
                            {/* {item.Topic ? item.Topic : item.name} */}
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
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={true} // Hiển thị thanh trượt dọc
                style={{ height: '46%', marginTop: 10 }}
            />
        </View>
    );
}
