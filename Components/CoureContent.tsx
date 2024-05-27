import { View, Text, FlatList, TouchableOpacity, Modal, Alert, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/AntDesign';
import { checkUserRole } from '../Context/checkUser';
import { AuthContext } from '../Context/AuthContext';

type LessonInfo = {
    id: string;
    name: string;
};

export default function CourseContent({ id, courseType, userProgress, courseDetail }: { id: string, courseType: string, userProgress: any, courseDetail: any }) {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [lessons, setLessons] = useState<LessonInfo[]>([]);
    const [dtbase, setDatabase] = useState('');
    const { userData } = useContext(AuthContext);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<LessonInfo | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            let db;
            if (courseType === 'basic' || courseType === 'advance') {
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

    const checkUserProgress = (contentId: string) => {
        if (!userProgress) return false;
        if (courseType !== 'basic' && courseType !== 'advance') {
            return false;
        }
        return userProgress.find(item => item.lessonid === contentId);
    };

    const onChapterPress = (lesson: LessonInfo) => {
        if (courseType === 'basic' || courseType === 'advance') {
            navigation.navigate('course-chapter', { lesson, ref: dtbase, courseId: id, courseDetail: courseDetail });
        } else {
            navigation.navigate('play-video', { lesson, ref: dtbase, courseId: id });
        }
    };

    const handleLongPress = (lesson: LessonInfo) => {
        console.log('Long press:', lesson);
        setSelectedLesson(lesson);
        setModalVisible(true);
    };

    const handleDelete = () => {
        if (selectedLesson) {
            Alert.alert(
                'Delete',
                `Are you sure you want to delete lesson: ${selectedLesson.name}?`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => setModalVisible(false),
                        style: 'cancel',
                    },
                    {
                        text: 'OK',
                        onPress: () => {
                            database().ref(`${dtbase}/${selectedLesson.id}`).remove()
                                .then(() => {
                                    Alert.alert('Deleted', 'Lesson deleted successfully');
                                    setModalVisible(false);
                                })
                                .catch((error) => {
                                    Alert.alert('Error', 'Failed to delete lesson');
                                    console.error(error);
                                    setModalVisible(false);
                                });
                        },
                    },
                ],
                { cancelable: false }
            );
        }
    };

    const handleEdit = () => {
        if (selectedLesson && courseType === 'basic' || courseType === 'advance') {
            console.log(selectedLesson);
            navigation.navigate('insert-course-content', { lessonInfo: selectedLesson, courseType: courseType, ref: dtbase, courseId: id, courseDetail: courseDetail });
            setModalVisible(false);
        }
    };

    const handleResetProgress = () => {
        if (userProgress) {
            const userId = userData.id;
            const lessonId = selectedLesson?.id;
            const courseId = id;

            const progressRef = database().ref('/CourseProgress').orderByChild('userid').equalTo(userId);

            progressRef.once('value', snapshot => {
                const progressData = snapshot.val();
                if (progressData) {
                    Object.keys(progressData).forEach(key => {
                        if (progressData[key].courseid === courseId && progressData[key].lessonid === lessonId) {
                            database().ref(`/CourseProgress/${key}`).remove()
                                .then(() => {
                                    Alert.alert('Progress Reset', 'User progress has been reset', [
                                        { text: 'OK', onPress: () =>  navigation.navigate('course-detail', { courseContent: lessonId, courseDetail: courseDetail }, { merge: true }) },
                                      ]);
                                    setModalVisible(false);
                                })
                                .catch(error => {
                                    Alert.alert('Error', 'Failed to reset user progress');
                                    console.error(error);
                                    setModalVisible(false);
                                });
                        }

                    });
                }
            });
        }
    };

    useEffect(() => {
        const fetchUserRole = async () => {
            const role = await checkUserRole(userData);
            setIsUserAdmin(role);
        };
        fetchUserRole();
    }, [userData]);

    const onPressAddCourse = () => {
        navigation.navigate('insert-course-content', { courseType: courseType, ref: dtbase, courseId: id, courseDetail: courseDetail });
    };

    return (
        <View style={{ marginTop: 10, flex: 1, marginBottom: 10 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'black' }}>Course Content</Text>
                {isUserAdmin && (
                    <TouchableOpacity style={{ paddingBottom: 10 }} onPress={() => onPressAddCourse()}>
                        <Icon name="plussquareo" size={30} color="black" />
                    </TouchableOpacity>
                )}
            </View>
            <FlatList
                data={lessons}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        onLongPress={() => handleLongPress(item)}
                        onPress={() => onChapterPress(item)}
                        style={styles.lessonContainer}>
                        {checkUserProgress(item.id) ? (
                            <Icon
                                name="checkcircle"
                                size={24}
                                color={"green"}
                                style={{ marginRight: 20 }}
                            />
                        ) : (
                            <Text
                                style={styles.lessonIndex}>
                                {index + 1}
                            </Text>
                        )}
                        <Text style={styles.lessonName}>
                            {item.name}
                        </Text>
                        <Icon
                            name="playcircleo"
                            size={24}
                            style={styles.playIcon}
                            color={"blue"}
                        />
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                style={{ height: '100%', marginTop: 10 }}
            />

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {isUserAdmin ? (
                            <>
                                {(courseType === 'basic' || courseType === 'advance') && (
                                    <TouchableOpacity style={styles.modalButton} onPress={handleEdit}>
                                        <Text style={styles.modalButtonText}>Edit</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
                                    <Text style={styles.modalButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </>
                        ) : null}
                        <TouchableOpacity style={styles.modalButton}onPress={() => handleResetProgress(selectedLesson)}>
                                <Text style={styles.modalButtonText}>Reset Progress</Text>
                            </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    lessonContainer: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: "white",
        marginBottom: 5,
        padding: 13,
        alignItems: 'center',
        borderRadius: 5,
    },
    lessonIndex: {
        fontWeight: 'bold',
        fontSize: 20,
        color: "gray",
        marginRight: 20,
    },
    lessonName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
    },
    playIcon: {
        position: 'absolute',
        right: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalButton: {
        padding: 10,
        marginVertical: 5,
    },
    modalButtonText: {
        fontSize: 18,
        color: 'black',
    },
});
