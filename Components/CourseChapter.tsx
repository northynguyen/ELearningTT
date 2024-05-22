/* eslint-disable quotes */
/* eslint-disable comma-dangle */
import { View, Text, StyleSheet } from 'react-native';
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
import { checkUserRole } from '../Context/checkUser';
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
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        setProgress(0);
        setChapter(param.lesson);
        const ref = param.ref;
        const fetchData = async () => {
            const db = database().ref(ref + '/' + param.lesson.id + '/lecture');
            const listener = db.on('value', snapshot => {
                const data = snapshot.val();
                if (data && data[0] === null) {
                    // Nếu có, loại bỏ phần tử null đầu tiên
                    data.shift();
                }
                const loadedLecture = [];
                // Kiểm tra data không phải là null hoặc undefined trước khi lặp
                if (data) {

                    for (let id in data) {
                        // Kiểm tra thêm để đảm bảo data[id] không phải là null hoặc undefined
                        if (
                            data[id] &&
                            data[id].Name &&
                            data[id].Input &&
                            data[id].Output
                        ) {
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
            });
            return () => db.off('value', listener); // Clean up the listener on unmount
        };
        fetchData();
    }, []);

    const handleToggleOptions = () => {
        setShowOptions(!showOptions);
    };
    const onClickNext = (index: number) => {
        setRun(false);
        var a = index + 1;
        var b = lecture.length;
        setProgress(a / b);
        try {
            if (chapterRef) {
                chapterRef.scrollToIndex({ animated: true, index: index + 1 });
            }
        } catch (e) {
            const courseProgressRef = database().ref('CourseProgress');

            // Tạo một truy vấn để kiểm tra sự tồn tại của mục
            courseProgressRef.orderByChild('userid')
                .equalTo(userData.id)
                .once('value', snapshot => {
                    let exists = false;
                    snapshot.forEach(childSnapshot => {
                        const item = childSnapshot.val();
                        if (item.courseid === param.courseId && item.lessonid === param.lesson.id) {
                            exists = true;
                            return true; // Dừng vòng lặp forEach
                        }
                    });
                    if (!exists) {
                        // Nếu mục chưa tồn tại, thêm mục mới
                        courseProgressRef.push().set({
                            userid: userData.id,
                            courseid: param.courseId,
                            lessonid: param.lesson.id
                        })
                        .then(() => {
                            console.log('Data updated.');
                            navigation.navigate('course-detail', { courseContentId: param.lesson.id, courseDetail: param.courseDetail }, { merge: true });
                        })
                        .catch(error => console.error('Error updating data:', error));
                    } else {
                        console.log('Course progress already exists');
                        // Điều hướng sang màn hình course-detail nếu mục đã tồn tại
                        navigation.navigate('course-detail', { courseContentId: param.lesson.id, courseDetail: param.courseDetail }, { merge: true });
                    }
                });
        }
    };

    const fetchUserRole = async () => {
        const role = await checkUserRole(userData);
        setIsUserAdmin(role);
    };

    useEffect(() => {
        fetchUserRole();
    }, [userData]);
    return (
        <View style={{ padding: 20, paddingTop: 20, flex: 1 }}>
            <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                <TouchableOpacity style={{ paddingBottom: 10 }} onPress={() => navigation.goBack()}>
                    <Icon name="arrowleft" size={30} color="black" />
                </TouchableOpacity>
                {isUserAdmin && (
                    <TouchableOpacity style={{paddingBottom:10}} onPress={handleToggleOptions}>
                        <Icon name= "setting" size={30} color="black" />
                    </TouchableOpacity>
                )}
            </View>
            <ProgressBar progress={progress} />
            <FlatList
                data={lecture}
                horizontal={true}
                pagingEnabled
                ref={(ref) => {
                    chapterRef = ref;
                }}
                renderItem={({ item, index }) => (
                    <View style={{
                        width: Dimensions.get('screen').width * 0.87,
                        marginRight: 15
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>{item.name}</Text>
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
                            <Text style={{ fontWeight: 'bold', color: 'black' }} >Output</Text>
                            <View style={{
                                backgroundColor: 'black',
                                padding: 20, borderRadius: 10, marginTop: 10
                            }}>
                                <Text style={{ color: 'white' }}>
                                    {item.output}
                                </Text>
                            </View>
                        </View> : null}
                        {index + 1 !== lecture.length ? 
                            <TouchableOpacity
                                onPress={() => onClickNext(index)}
                                style={{
                                    backgroundColor: 'blue',
                                    padding: 10, borderRadius: 7, position: 'absolute', bottom: 0,
                                    width: '104%'
                                }}>
                                <Text style={{ textAlign: 'center', color: 'white' }}>Next</Text>
                            </TouchableOpacity> :
                             <View style={{bottom: 0, flexDirection:"column",justifyContent:"space-between", position: 'absolute', width: '104%'}} >

                                <TouchableOpacity
                                    onPress={() => onClickNext(index)}
                                    style={{
                                        backgroundColor: 'green',
                                        padding: 10, paddingLeft: 15, borderRadius: 7 ,
                                    }}>
                                    <Text style={{ textAlign: 'center', color: 'white' }}>Finish</Text>
                                </TouchableOpacity>

                            </View>}

                    </View>
                )}
            />
            {showOptions && (
                <View style={styles.optionsContainer}>
                    <TouchableOpacity >
                        <Text style={{ fontSize: 15, color: 'black' }}>Thêm </Text>
                    </TouchableOpacity>
                    <TouchableOpacity >
                        <Text style={{ fontSize: 15, color: 'black' }}>Thông tin cá nhân</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    optionsContainer: {
        position: 'absolute',
        top: 80,
        right: 10,
        backgroundColor: 'grey',
        padding: 10,
        borderRadius: 5,
        width: 130,
        height: 130,
    },
});