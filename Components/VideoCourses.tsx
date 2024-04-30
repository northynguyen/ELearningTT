/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import database from '@react-native-firebase/database';
import Loading from './Loading';
import { useNavigation } from '@react-navigation/native';

const width = Dimensions.get('window').width;
type VideoInfo = {
  id: string;
  image: string;
  description: string;
  name: string;
};
export default function VideoCourses() {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<VideoInfo[]>([]);
  const navigation = useNavigation();
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const db = database().ref('/VideoSource');
      console.log(db);
      const listener = db.on('value', snapshot => {
        console.log("hello");
        const data = snapshot.val();
        const loadedImages = [];
        // Kiểm tra data không phải là null hoặc undefined trước khi lặp
        if (data) {
          for (let id in data) {
            // Kiểm tra thêm để đảm bảo data[id] không phải là null hoặc undefined
            if (data[id] && data[id].Image && data[id].Description && data[id].Title) {
              loadedImages.push(
                {
                  id,
                  image: data[id].Image,
                  description: data[id].Description,
                  name: data[id].Title,
                });
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
    return (
      <Text style={{textAlign: 'center', color: 'black'}}>Loading...</Text>
    );
  }

  const onPress = (videoinfo: VideoInfo) => {
    navigation.navigate('course-detail', {courseDetail:videoinfo});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerCourses}>Video Courses</Text>
      <FlatList
        data={images}
        keyExtractor={item => item.id}
        horizontal
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.containerCourses}
            onPress={() => onPress(item)}>
            <Image source={{uri: item.image}} style={styles.img_courses} />
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FC',
    marginHorizontal: 20,
  },
  containerCourses: {
    height: 150,
    width: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  headerCourses: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  textName: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
  },
  textLesson: {
    color: 'black',
    fontSize: 9,
  },
  img_courses: {
    height: 101.68,
    width: 200,
    top: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

});
