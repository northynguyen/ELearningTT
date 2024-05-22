import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import database from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import { checkUserRole } from '../Context/checkUser';
import { AuthContext } from '../Context/AuthContext';

const width = Dimensions.get('window').width;

type VideoInfo = {
  id: string;
  image: string;
  description: string;
  name: string;
};

const VideoCourses = () => {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<VideoInfo[]>([]);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const { userData } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const db = database().ref('/VideoSource');
      db.on('value', snapshot => {
        const data = snapshot.val();
        const loadedImages: VideoInfo[] = [];
        if (data) {
          for (let id in data) {
            if (data[id] && data[id].Image && data[id].Description && data[id].Title) {
              loadedImages.push({
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

      return () => db.off('value'); // Clean up the listener on unmount
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await checkUserRole(userData);
      setIsUserAdmin(role);
    };

    fetchUserRole();
  }, [userData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const onPress = (videoinfo: VideoInfo) => {
    navigation.navigate('course-detail', { courseDetail: videoinfo });
  };

  const onPressInsert = () => {
    console.log();
    navigation.navigate('insert-video-course');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Video Courses</Text>
        {isUserAdmin && (
          <TouchableOpacity onPress={() => onPressInsert()} style={{ paddingBottom: 10 }} >
            <Icon name="plussquareo" size={30} color="black" />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={images}
        keyExtractor={item => item.id}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.containerCourses} onPress={() => onPress(item)}>
            <Image source={{ uri: item.image }} style={styles.img_courses} />
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FC',
    marginHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerCourses: {
    height: 150,
    width: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  img_courses: {
    height: 101.68,
    width: 200,
    top: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});

export default VideoCourses;
