/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react';
import { FlatList, Image, Dimensions, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import storage from '@react-native-firebase/storage';
import Loading from './Loading';

const width = Dimensions.get('window').width;

const Slider = () => {
    const [images, setImages] = useState<string[]>([]);
    const flatListRef = useRef<FlatList<string>>(null); // Specify the type for the ref
    const [loading, setLoading] = useState(true);
    let currentIndex = 0;
    useEffect(() => {
        setLoading(true);
        const fetchImages = async () => {
            const folderRef = storage().ref('slider');
            const result = await folderRef.listAll();
            const urls = await Promise.all(result.items.map(item => item.getDownloadURL()));
            setImages(urls);
            console.log(urls);
            setLoading(false);
        };
        fetchImages();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (images.length > 0 && flatListRef.current) {
                currentIndex = (currentIndex + 1) % images.length; // Update the index
                flatListRef.current.scrollToIndex({
                    index: currentIndex,
                    animated: true
                });
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [images]);

    if (images.length === 0) {
        return <Loading />;
    }

    return (
        <View>
            <FlatList
                ref={flatListRef}
                data={images}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                renderItem={({ item }) => (
                    <Image source={{ uri: item }} style={styles.img_introduce} />
                )}
                showsHorizontalScrollIndicator={false}

            />
        </View>

    );
};
const styles = StyleSheet.create({
    img_introduce: {
        height: 150,
        width: width - 40,
        alignSelf: 'center',
        margin: 20,
    },
    scrollCourses: {
    },
});

export default Slider;
