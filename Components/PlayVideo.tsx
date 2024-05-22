/* eslint-disable quotes */
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import database from '@react-native-firebase/database';
import Youtube from 'react-native-youtube-iframe';
import YoutubeIframe from 'react-native-youtube-iframe';
import { AuthContext } from '../Context/AuthContext';
import { checkUserRole } from '../Context/checkUser';

type videoinfo = {
    id: string;
    name: string;
    description: string;
    url: string;
};

export default function PlayVideo(ref: string) {
    const navigation = useNavigation();
    const param = useRoute().params;
    const [videoInfo, setVideoInfo] = useState<videoinfo[]>([]);
    const [playing, setPlaying] = useState(false);
    const { userData } = useContext(AuthContext);
    const [isUserAdmin, setIsUserAdmin] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            ref = param.ref;
            const db = database().ref(ref + '/' + param.lesson.id);
            const listener = db.on('value', snapshot => {

                const data = snapshot.val();
                const loadedLecture = [];
                // Kiểm tra data không phải là null hoặc undefined trước khi lặp
                if (data) {

                    if (
                        data.Name &&
                        data.Description &&
                        data.Url
                    ) {
                        loadedLecture.push({

                            description: data.Description,
                            name: data.Name,
                            url: data.Url,
                            id: param.lesson.id ,
                        });
                    }
                }
                setVideoInfo(loadedLecture);
                console.log(loadedLecture);
            });
            return () => db.off('value', listener); // Clean up the listener on unmount
        };
        fetchData();
    }, []);

    const onStateChange = useCallback((state: string) => {
        if (state === "ended") {
            setPlaying(false);
        }
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            const role = await checkUserRole(userData);
            setIsUserAdmin(role);
        };
        fetchData();
    }, []);

    const customIndicatorStyle = { color: 'black' }; // Define custom color here

    const editVideo = () => {
        navigation.navigate('insert-course-content', {videoInfo: videoInfo[0]});
    }
    return (
        <View style={{ padding: 20, marginTop: 0 }}>
            <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                <TouchableOpacity style={{paddingBottom:10}} onPress={()=>navigation.goBack() }>
                    <Icon name= "arrowleft" size={30} color="black" />
                </TouchableOpacity>
                {isUserAdmin && (
                    <TouchableOpacity style={{paddingBottom:10}} onPress={editVideo}>
                        <Icon name= "setting" size={30} color="black" />
                    </TouchableOpacity>
                )}
            </View>
            {videoInfo ?
                <View>
                    <Text style={{ marginBottom: 10, fontSize: 22, fontWeight: 'bold', color: 'black' }}>{videoInfo[0]?.name}</Text>
                    <YoutubeIframe

                        height={220}
                        play={playing}
                        videoId={videoInfo[0]?.url}
                        onChangeState={onStateChange}
                    />

                    <Text style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 16, color: 'black' }}>Description</Text>


                    <ScrollView
                        style={{ height: '50%' }}
                    >
                        <Text style={{ lineHeight: 20, marginBottom: 10, fontSize: 16, color: 'black', textAlign: 'justify' }}>
                            {videoInfo[0]?.description}
                        </Text>
                    </ScrollView>
                </View> : null}
        </View>
    );
}


