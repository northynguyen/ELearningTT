/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable space-infix-ops */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { View, Text } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FlatList } from 'react-native';
import { Dimensions } from 'react-native';
import { Button } from 'react-native';
import { AuthContext } from '../Context/AuthContext';
import ProgressBar from './ProgressBar';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/AntDesign';
type lectureinfo = {
    id: string;
    name: string;
    description: string;
    input: string;
    output: string;
};
export default function CourseChapter() {
    const param = useRoute().params;
    const [lecture, setLecture] = useState<lectureinfo[]>([]);
    const [chapter, setChapter] = useState();
    const [run, setRun] = useState(false);
    const [progress, setProgress] = useState(0);
    const { userData, setUserData } = useContext(AuthContext);
    let chapterRef: FlatList<never> | null;
    const navigation = useNavigation();

    useEffect(() => {

        setProgress(0);
        setChapter(param.lesson);
        const ref = param.ref;
        const fetchData = async () => {
            console.log(ref +'/' + param.lesson.id + '/lecture');
            const db = database().ref(ref + '/' + param.lesson.id + '/lecture');
            console.log('././////');
            const listener = db.on('value', snapshot => {
                console.log(snapshot.val());
                const data = snapshot.val();
                if (data && data[0] === null) {
                    // Nếu có, loại bỏ phần tử null đầu tiên
                    data.shift();
                }
                console.log(data);
                const loadedLecture = [];
                // Kiểm tra data không phải là null hoặc undefined trước khi lặp
                if (data) {

                    for (let id in data) {
                        console.log("them vao");
                        // Kiểm tra thêm để đảm bảo data[id] không phải là null hoặc undefined
                        if (
                            data[id] &&
                            data[id].Name &&
                            data[id].Input &&
                            data[id].Output
                        ) {
                            console.log("da them vao 1");
                            loadedLecture.push({
                                id,
                                description: data[id].Description,
                                name: data[id].Name,
                                input: data[id].Input,
                                output: data[id].Output
                            });
                        }
                    }
                }
                setLecture(loadedLecture);
                console.log(loadedLecture);
            });
            return () => db.off('value', listener); // Clean up the listener on unmount
        };
        fetchData();
    }, []);

    const onClickNext = (index: number) => {
        setRun(false);
        var a = index + 1;
        var b = lecture.length;
        setProgress(a / b);
        try {
            if (chapterRef) {
                chapterRef.scrollToIndex({ animated: true, index: index + 1 });
            }
        }
        catch (e) {
            navigation.goBack();

        }
    };
    return (
        <View style={{ padding: 20, paddingTop: 20, flex: 1 }}>
            <TouchableOpacity style={{ paddingBottom: 10 }} onPress={() => navigation.goBack()}>
                <Icon name= "arrowleft" size={30} color="black" />
            </TouchableOpacity>
            <ProgressBar progress={progress} />
            <FlatList
                data={lecture}
                horizontal={true}
                pagingEnabled
                ref={(ref)=>{
                    chapterRef=ref;
                }}
               renderItem={({ item, index }) => (
                    <View style={{
                        width: Dimensions.get('screen').width * 0.87,
                        marginRight: 15
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' , color: 'black'}}>{item.name}</Text>
                        <Text style={{ color: 'black', textAlign: 'justify', marginTop: 5 }}>{item.description}</Text>
                        {item.input !== '' ?
                            <View>
                                <Text style={{ color: 'black', fontWeight: 'bold', marginTop: 15, marginBottom: 10 }}>Input</Text>

                                <View style={{
                                    backgroundColor: 'black',
                                    padding: 20, borderRadius: 10
                                }}>
                                    <Text style={{ color: 'white' }}>{item.input}</Text>
                                </View>
                                <TouchableOpacity style={{
                                    backgroundColor: 'blue', width: 80,
                                    padding: 5, borderRadius: 5,
                                    marginTop: 10, display: 'flex', flexDirection: 'row'
                                }} onPress={() => setRun(true)}>
                                    <Icon name="play" size={20}
                                        color={'white'} />
                                    <Text style={{ textAlign: 'center', marginLeft: 10, color: 'white' }}>Run</Text>
                                </TouchableOpacity>
                            </View> : null}
                        {run ? <View style={{ marginTop: 15 }}>
                            <Text style={{ fontWeight: 'bold',color: 'black' }} >Output</Text>
                            <View style={{
                                backgroundColor: 'black',
                                padding: 20, borderRadius: 10, marginTop: 10
                            }}>
                                <Text style={{ color: 'white' }}>
                                    {item.output}
                                </Text>
                            </View>
                        </View> : null}
                        {index + 1 !== lecture.length ? <TouchableOpacity
                            onPress={() => onClickNext(index)}
                            style={{
                                backgroundColor: 'blue',
                                padding: 10, borderRadius: 7, position: 'absolute', bottom: 0,
                                width: '104%'
                            }}>
                            <Text style={{ textAlign: 'center', color: 'white' }}>Next</Text>
                        </TouchableOpacity> :
                            <TouchableOpacity
                                onPress={() => onClickNext(index)}
                                style={{
                                    backgroundColor: 'green',
                                    padding: 10, paddingLeft: 15, borderRadius: 7, position: 'absolute', bottom: 0,
                                    width: '104%'
                                }}>
                                <Text style={{ textAlign: 'center', color: 'white' }}>Finish</Text>
                            </TouchableOpacity>}

                    </View>
                )}
            />
        </View>
    );
}
