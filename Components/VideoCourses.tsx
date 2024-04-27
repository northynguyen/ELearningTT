import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import database from '@react-native-firebase/database';
import Loading from './Loading';


const width = Dimensions.get('window').width;
type ImageInfo = {
    id: string;
    uri: string;
};
export default function VideoCourses() {
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState<ImageInfo[]>([]);
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const db = database().ref('/VideoSource');
            const listener = db.on('value', snapshot => {
                const data = snapshot.val();
                const loadedImages = [];
                // Kiểm tra data không phải là null hoặc undefined trước khi lặp
                if (data) {
                    for (let id in data) {
                        // Kiểm tra thêm để đảm bảo data[id] không phải là null hoặc undefined
                        if (data[id] && data[id].Image) {
                            loadedImages.push({ id, uri: data[id].Image });

                        }
                    }
                }
                setImages(loadedImages);
                setLoading(false);
            });
            return () => db.off('value', listener); // Clean up the listener on unmount
        };

        fetchData();
    }, []);
    if (loading) {
        return <Loading />;
    }
    return (
        <View style={styles.containerCourses}>
            <Text style={styles.headerCourses}>Video Courses</Text>
            <FlatList
                data={images}
                keyExtractor={item => item.id}
                horizontal
                renderItem={({ item }) => (
                    <Image source={{ uri: item.uri }} style={styles.img_courses} />
                )}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F8FC',
    },
    containerCourses: {
        height: 150,
        margin: 20,

    },
    headerCourses: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },

    img_courses: {
        height: 112.5,
        width: 200,
        resizeMode: 'contain',
        marginRight: 10,
        borderRadius: 10,
    },
    scrollCourses: {
    },
});