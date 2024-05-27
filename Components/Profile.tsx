import React, { useContext, useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Image, TextInput, 
  TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Platform, ActivityIndicator, Alert 
} from 'react-native';
import { AuthContext } from '../Context/AuthContext';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation, useRoute } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { showMessage } from 'react-native-flash-message';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import ProgressBar from './ProgressBar'; // Ensure you have a ProgressBar component

export default function EditProfile() {
    const { userData,setUserData } = useContext(AuthContext);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [img, setImg] = useState('');
    const [imageUri, setImageUri] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const navigation = useNavigation();
    const [edit, setEdit] = useState(false);
    const param = useRoute().params;

    const handleEditPress = () => {
        setEdit(true);
    };

    const handleSavePress = async () => {
        if (!name || !email ) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setLoading(true);

        try {
            let downloadURL = img;

            if (imageUri) {
                const reference = storage().ref(`/user_images/${id}`);
                const task = reference.putFile(imageUri);

                task.on('state_changed', taskSnapshot => {
                    const progress = (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                });

                await task;
                downloadURL = await reference.getDownloadURL();
            }

            if(!imageUri){
                downloadURL = img;
            }
            const userRef = database().ref(`/User/${id}`);
            await userRef.update({
                name: name,
                email: email,
                photo: downloadURL,
            });
            setUserData(prev => ({...prev,id, name, email, photo: downloadURL}));

            Alert.alert('Success', 'Profile updated successfully');
            setEdit(false);
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'There was an error updating the profile');
            console.error(error);
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const handleCopyToClipboard = () => {
        Clipboard.setString(id);
        showMessage({
            message: `Copy ID successfully`,
            type: 'success',
            duration: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            color: 'black',
        });
    };

    const handleChat = async () => {
        const room = await findOrCreateRoom();
        console.log(room);
        navigation.navigate('chatscreen', { room, friend: param?.friend });
    };

    const findOrCreateRoom = async () => {
        try {
            const roomsRef = database().ref('ChatRooms');
            const snapshot = await roomsRef.once('value');
            const rooms = snapshot.val();
            let roomId;
            if (rooms) {
                Object.keys(rooms).forEach(roomKey => {
                    const room = rooms[roomKey];
                    const participantIDs = room.participantIDs;
                    if (participantIDs && Array.isArray(participantIDs) &&
                        participantIDs.includes(param.friend.userID) && participantIDs.includes(userData.id)) {
                        roomId = roomKey;
                        return;
                    }
                });
            }
            if (!roomId) {
                const newRoomRef = roomsRef.push();
                roomId = newRoomRef.key;
                if (param.friend && param.friend.userID) {
                    await newRoomRef.set({
                        participantIDs: [param.friend.userID, userData.id],
                        last_message: {
                            text: '',
                            timestamp: ''
                        }
                    });
                } else {
                    throw new Error('Friend ID is missing');
                }
            }
            return roomId;
        } catch (error) {
            console.error('Error finding or creating room:', error);
            throw error;
        }
    };

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.error('ImagePicker Error: ', response.error);
            } else if (response.assets && response.assets.length > 0) {
                const selectedImageUri = response.assets[0].uri;
                setImageUri(selectedImageUri);
            }
        });
    };

    useEffect(() => {
        if (param.userData) {
            setName(param.userData.name);
            setEmail(param.userData.email);
            setId(param.userData.id);
            setImg(param.userData.photo);
        }
        if (param.friend) {
            setName(param.friend.name);
            setEmail(param.friend.email);
            setId(param.friend.userID);
            setImg(param.friend.photo);
        }
    }, [param.userData, param.friend]);

    const getInputStyle = () => ({
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
        justifyContent: 'center',
        flexWrap: 'wrap',
        width: "80%",
        ...edit && {
            borderWidth: 1,
            borderColor: '#99ccff',
            borderRadius: 5,
            paddingHorizontal: 10,
        }
    });

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'android' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.goBack()}>
                            <Icon name="arrowleft" size={30} color="black" style={{ alignItems: 'flex-start' }} />
                        </TouchableOpacity>
                        {id === userData.id && (
                            <TouchableOpacity onPress={handleEditPress} style={{ width: 60, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={require('../img/edit.png')} style={{ height: 28, width: 28 }} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.body}>
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity onPress={edit ? selectImage : null}>
                                {imageUri || img ? (
                                    <Image source={{ uri: imageUri || img }} style={styles.avatar} />
                                ) : (
                                    <View style={styles.avatar} />
                                )}
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ padding: 20, color: 'black' }}>{id}</Text>
                                <TouchableOpacity onPress={handleCopyToClipboard}>
                                    <Icon name="copy1" size={18} color="black" />
                                </TouchableOpacity>
                            </View>
                            {id !== userData.id && (
                                <TouchableOpacity onPress={handleChat}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#8ec04c', borderRadius: 10, padding: 10, marginTop: 10 }}>
                                        <Image source={require('../img/chat-icon2.png')} resizeMode="contain" />
                                        <Text style={{ paddingLeft: 10, color: 'white' }}>Nhắn tin</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={styles.info_container}>
                            <View style={styles.info}>
                                <Text style={styles.userName}>Name: </Text>
                                <TextInput
                                    style={getInputStyle()}
                                    editable={edit}
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.userName}>Email: </Text>
                                <TextInput
                                    style={getInputStyle()}
                                    editable={edit}
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>
                        <TouchableOpacity onPress={handleSavePress} style={{ display: edit ? 'flex' : 'none' }}>
                            <View style={styles.btn_Save}>
                                <Text style={styles.userName}>Lưu</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {loading && (
                        <View style={styles.loadingContainer}>
                            <View style={styles.loading}>
                                <ActivityIndicator size="large" color="#0000ff" />
                                <ProgressBar
                                    style="Horizontal"
                                    indeterminate={false}
                                    progress={uploadProgress / 100}
                                />
                                <Text style={styles.progressText}>{Math.round(uploadProgress)}%</Text>
                            </View>
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        position: 'relative',
    },
    header: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    body: {
        flex: 9,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    avatar: {
        height: 100,
        width: 100,
        borderRadius: 50,
        backgroundColor: '#c4c4c4',
    },
    info_container: {
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    userName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
    },
    btn_Save: {
        backgroundColor: '#99ccff',
        width: 80,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loading: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    progressText: {
        color: 'black',
        marginTop: 10,
    },
});
