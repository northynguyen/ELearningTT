import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../Context/AuthContext';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation, useRoute } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { showMessage } from 'react-native-flash-message';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

export default function EditProfile() {
    const { userData, setUserData } = useContext(AuthContext);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [img, setimg] = useState('');
    const [imageUri, setImageUri] = useState('');
    const navigation = useNavigation();
    const [edit, setEdit] = useState(false);
    const [chat, setChat] = useState(false);
    const param = useRoute().params;

    const handleEditPress = () => {
        setEdit(true);
    };

    const handleSavePress = async () => {
        const userRef = database().ref(`/User/${userData.id}`);
        try {
            if (imageUri) {
                const imageUrl = await uploadImage(imageUri);
                await userRef.update({
                    name: name,
                    email: email,
                    photo: imageUrl,
                });
                setUserData({ ...userData, name: name, email: email, photo: imageUrl });
                setimg(imageUrl);
            } else {
                await userRef.update({
                    name: name,
                    email: email,
                });
                setUserData({ ...userData, name: name, email: email });
            }
            setEdit(false);

            navigation.navigate('home');
        } catch (error) {
            console.error('Failed to update user data: ', error);
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

    const uploadImage = async (uri) => {
        if (!uri) return null;
        const uploadUri = uri;
        const filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
        const storageRef = storage().ref(`user_images/${id}.img`);
        await storageRef.putFile(uploadUri);
        const url = await storageRef.getDownloadURL();
        return url;
    };

    useEffect(() => {
        if (param.userData) {
            setName(param.userData.name);
            setEmail(param.userData.email);
            setId(param.userData.id);
            setimg(param.userData.photo);
        }
        if (param.friend) {
            setName(param.friend.name);
            setEmail(param.friend.email);
            setId(param.friend.userID);
            setimg(param.friend.photo);
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
                        {param.userData && (
                            <TouchableOpacity onPress={handleEditPress} style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={require('../img/edit.png')} style={{ height: 24, width: 24 }} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.body}>
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity onPress={edit ? selectImage : null}>
                                <Image source={{ uri: imageUri || img }} style={styles.avatar} />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ padding: 20, color: 'black' }}>{id}</Text>
                                <TouchableOpacity onPress={handleCopyToClipboard}>
                                    <Icon name="copy1" size={18} color="black" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={{ display: chat ? 'flex' : 'none' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#8ec04c', borderRadius: 10, padding: 10, marginTop: 10 }}>
                                    <Image
                                        source={require('../img/chat-icon2.png')}
                                        resizeMode="contain" />
                                    <Text style={{ paddingLeft: 10, color: 'white' }}>Tin nhắn</Text>
                                </View>
                            </TouchableOpacity>
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
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F8FC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 20,
        height: 80,
        justifyContent: 'space-between',
    },
    avatar: {
        width: 90,
        height: 90,
        marginLeft: 10,
        borderRadius: 50,
    },
    userName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
        justifyContent: 'center',
    },
    body: {
        flex: 1,
    },
    info_container: {
        marginHorizontal: 20,
        marginTop: 10,
        backgroundColor: 'white',
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        justifyContent: 'space-between',
        margin: 10,
    },
    btn_Save: {
        backgroundColor: '#8ec04c',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        borderRadius: 10,
    }
})
