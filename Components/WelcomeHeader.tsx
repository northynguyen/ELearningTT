/* eslint-disable semi */
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { useContext } from 'react';
export default function WelcomeHeader() {
    const { userData, setUserData } = useContext(AuthContext);
    const [showOptions, setShowOptions] = useState(false);
    const handleToggleOptions = () => {
        console.log('Toggle Options');
        setShowOptions(!showOptions);
    };
    const handleLogout = () => {
        console.log('Logout');
        // Xóa dữ liệu người dùng khi đăng xuất
        setUserData(null);
    };
    return (
        <View style={styles.UI_userInfo}>
            <View style={styles.hello}>
                <Text style={{ fontSize: 10, color: 'black' }}>Hello</Text>
                <Text style={{ fontSize: 15, color: 'black' }}>{userData?.name}</Text>
            </View>
            <TouchableOpacity onPress={handleToggleOptions}>
                <View>
                    <Image source={{ uri: userData?.photo }} style={styles.avatar} />
                    {showOptions && (
                        <View style={styles.optionsContainer}>
                            <TouchableOpacity onPress={handleLogout}>
                                <Text style={{ fontSize: 15, color: 'black' }}>Logout</Text>
                            </TouchableOpacity>
                            <TouchableOpacity >
                                <Text style={{ fontSize: 15, color: 'black' }}>Thông tin cá nhân</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F8FC',
    },
    UI_userInfo: {
        marginTop: 20,
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    hello: {
        paddingLeft: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        marginRight: 20,
        borderRadius: 50,
    },
    optionsContainer: {
        position: 'absolute',
        top: 50,
        right: 10,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        width: 100,
    },
})
