import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/AntDesign';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ProgressBar from './ProgressBar';
import storage from '@react-native-firebase/storage';


interface Course {
  description: string;
  id: string;
  image: string;
  name: string;
  type: string;
}

export default function App() {
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [courseType, setCourseType] = useState('basic');
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    if (route.params?.courseDetail) {
      const courseDetail = route.params.courseDetail as Course;
      setCourse(courseDetail);
      setDescription(courseDetail.description);
      setTitle(courseDetail.name);
      setImageUri(courseDetail.image);
      setCourseType(courseDetail.type);
    }
  }, [route.params?.courseDetail]);

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          if (uri) {
            setImageUri(uri);
          }
        }
      }
    });
  };


  const saveData = async () => {
    if (!description || !title || imageUri===null || imageUri===''|| !courseType) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    console.log(imageUri);
    setLoading(true);
    try {
      let downloadURL = imageUri;

      if (imageUri) {
        const reference = storage().ref(`/CourseList/${Date.now()}`);
        const task = reference.putFile(imageUri);

        task.on('state_changed', taskSnapshot => {
          const progress = (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
          setUploadProgress(progress);
        });

        await task;
        downloadURL = await reference.getDownloadURL();

        if (course && course.image) {
          try {
            await storage().refFromURL(course.image).delete();
          } catch (error) {

            throw error; // Chỉ ném lại lỗi nếu không phải lỗi "object-not-found"
          }
        }
      }

      const db = firebase.database().ref('/CourseList');
      if (course) {
        await db.child(course.id).update({
          Description: description,
          Name: title,
          Image: imageUri,
          Type: courseType,
        });
        const updatedCourse = { ...course, description, name: title, image: imageUri, type: courseType };
        Alert.alert('Success', 'Course updated successfully', [
          { text: 'OK', onPress: () => navigation.navigate('course-detail', { courseDetail: updatedCourse }) },
        ]);
      } else {
        const newCourseRef = db.push();
        await newCourseRef.set({
          Description: description,
          Name: title,
          Image: imageUri,
          Type: courseType,
        });
        Alert.alert('Success', 'Course created successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'There was an error saving the course');
      console.error(error);
    }
    finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const cancelData = () => {
    setDescription('');
    setTitle('');
    setImageUri(null);
    setCourseType('basic');
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={100}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity style={{ paddingBottom: 10 }} onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter description"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        returnKeyType="done"
      />

      <Text style={styles.label}>Image</Text>
      <TouchableOpacity onPress={selectImage} style={styles.imagePicker}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Select Image</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
        multiline={true}
        returnKeyType="done"
      />

      <Text style={styles.label}>Course Type</Text>
      <View style={styles.radioButtonContainer}>
        <TouchableOpacity
          style={[styles.radioButton, courseType === 'basic' && styles.radioButtonSelected]}
          onPress={() => setCourseType('basic')}
        >
          <Text style={[styles.radioButtonLabel, courseType === 'basic' && styles.radioButtonLabelSelected]}>Basic</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioButton, courseType === 'advance' && styles.radioButtonSelected]}
          onPress={() => setCourseType('advance')}
        >
          <Text style={[styles.radioButtonLabel, courseType === 'advance' && styles.radioButtonLabelSelected]}>Advance</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={saveData} />
        <Button title="Cancel" onPress={cancelData} />
      </View>

      {loading && (
        <View style={styles.loading}>
          <View style={[{ padding: 20 }]}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>

          <ProgressBar
            style="Horizontal"
            indeterminate={false}
            progress={uploadProgress / 100}
          />
          <Text style={styles.progressText}>{`Uploading: ${uploadProgress.toFixed(2)}%`}</Text>
        </View>
      )}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F6F8FC',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  input: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    color: 'black',
  },
  imagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  imagePlaceholder: {
    color: 'black',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  radioButtonSelected: {
    backgroundColor: 'black',
  },
  radioButtonLabel: {
    color: 'black',
  },
  radioButtonLabelSelected: {
    color: 'white',
  },
  buttonContainer: {
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    opacity: 0.8,
  },
  progressText: {
    marginTop: 10,
    fontSize: 16,
    color: 'black',
  },
});

