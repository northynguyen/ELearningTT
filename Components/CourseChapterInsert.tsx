import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/AntDesign';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ProgressBar from './ProgressBar';


type lectureinfo = {
    id: string;
    name: string;
    description: string;
    input: string;
    output: string;
};

export default function App() {
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigation = useNavigation();
  const route = useRoute();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [chapter, setChapter] = useState<lectureinfo | null>(null);

  useEffect(() => {
    if (route.params?.chapterInfo) {
      const chapterInfo = route.params.chapterInfo as lectureinfo;
      setChapter(chapterInfo);
      setInput(chapterInfo.input);
      setOutput(chapterInfo.output);
      setDescription(chapterInfo.description);
      setTitle(chapterInfo.name);
    }
  }, [route.params?.chapterInfo]);


  const saveData = async () => {
    if (!description || !title || !input || !output ) {
      Alert.alert('Error', 'Please fill in all fields');
    }
    setLoading(true);

    try {

      const db = firebase.database().ref(route.params?.ref);
      if (chapter) {
        await db.child(chapter.id).update({
          Description: description,
          Name: title,
          Input: input,
          Output: output,
        });
        const updatedChapter = { ...chapter, description, name: title, input, output};
        Alert.alert('Success', 'Course updated successfully', [
          { text: 'OK', onPress: () => navigation.navigate('course-chapter', { chapterInfo: updatedChapter }) },
        ]);
      } else {
        const snapshot = await db.once('value');
            const numberOfCourses = snapshot.numChildren();

          // Tạo một khóa học mới với ID là số lượng khóa học hiện có + 1
          const newCourseRef = db.child((numberOfCourses ).toString());
        await newCourseRef.set({
            Description: description,
            Name: title,
            Input: input,
            Output: output,
        });
        Alert.alert('Success', 'Course created successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'There was an error saving ');
      console.error(error);
    }
    finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const cancelData = () => {
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

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
        multiline={true}
        returnKeyType="done"
      />

      <Text style={styles.label}>Input</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Input"
        value={input}
        onChangeText={setInput}
        multiline={true}
        returnKeyType="done"
      />

      <Text style={styles.label}>Output</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Input"
        value={output}
        onChangeText={setOutput}
        multiline={true}
        returnKeyType="done"
      />

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

