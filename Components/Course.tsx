/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable quotes */
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import { checkUserRole } from '../Context/checkUser';
import { AuthContext } from '../Context/AuthContext';

const width = Dimensions.get('window').width;

type CourseInfo = {
  id: string;
  image: string;
  name: string;
  description: string;
  lessonCount: number;
  type: string;
};

export default function Course() {
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { userData } = useContext(AuthContext);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const db = database().ref('/CourseList');
      db.on('value', snapshot => {
        const data = snapshot.val();
        const loadedCourses = [];
        // Kiểm tra data không phải là null hoặc undefined trước khi lặp
        if (data) {
          for (let id in data) {
            // Kiểm tra thêm để đảm bảo data[id] không phải là null hoặc undefined
            if (
              data[id] &&
              data[id].Image &&
              data[id].Description &&
              data[id].Name &&
              data[id].Type
            ) {
              const lessonCount = Object.keys(data[id].Lesson).length - 1;
              loadedCourses.push({
                id,
                image: data[id].Image,
                name: data[id].Name,
                lessonCount: lessonCount,
                type: data[id].Type,
                description: data[id].Description,
              });
            }
          }
        }
        setCourses(loadedCourses);
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
    return <Text style={{fontSize: 20, color: 'black'}}>Loading...</Text>;
  }

  const onPressCourse = (course: CourseInfo) => {
    navigation.navigate('course-detail', {courseDetail: course});
  };

  const onPressAddCourse = () => {
    navigation.navigate('insert-course');
  };
  return (
    <View style={styles.container}>
      <View style={{flexDirection:"row",justifyContent:"space-between"}}>
        <Text style={styles.headerCourses}>Basic Popular Courses</Text>
        {isUserAdmin ? (
          <TouchableOpacity style={{paddingBottom:10}} onPress={onPressAddCourse}>
            <Icon name= "plussquareo" size={30} color="black" />
          </TouchableOpacity>) : null
        }
      </View>
      <FlatList
        data={courses.filter(item => item.type === 'basic')}
        keyExtractor={item => item.id}
        horizontal
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.containerCourses}
            onPress={() => onPressCourse(item)}>
            <Image source={{uri: item.image}} style={styles.img_courses} />
            <View style={styles.CoursesInfo}>
              <Text style={styles.textName}>{item.name}</Text>
              <Text style={styles.textLesson}>Lessons: {item.lessonCount}</Text>
            </View>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />

      <View style={{flexDirection:"row",justifyContent:"space-between"}}>
        <Text style={styles.headerCourses}>Advance Popular Courses</Text>
        {isUserAdmin ? (
          <TouchableOpacity style={{paddingBottom:10}} onPress={onPressAddCourse}>
            <Icon name= "plussquareo" size={30} color="black" />
          </TouchableOpacity>) : null
        }
      </View>
      <FlatList
        data={courses.filter(item => item.type === 'advance')}
        keyExtractor={item => item.id}
        horizontal
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.containerCourses}
            onPress={() => onPressCourse(item)}>
            <Image source={{uri: item.image}} style={styles.img_courses} />
            <View style={styles.CoursesInfo}>
              <Text style={styles.textName}>{item.name}</Text>
              <Text style={styles.textLesson}>Lessons: {item.lessonCount}</Text>
            </View>
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
  CoursesInfo: {
    marginLeft: 10,
    width: '100%',
  },
});
