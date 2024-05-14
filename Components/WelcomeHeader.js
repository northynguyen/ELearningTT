import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import { AuthContext } from '../Context/AuthContext';
import { useContext } from 'react';
export default function WelcomeHeader() {
    // eslint-disable-next-line no-unused-vars
    const { userData, setUserData } = useContext(AuthContext);
    return (
        <View style={styles.UI_userInfo}>
            <View style={styles.hello}>
                <Text style={{ fontSize: 10, color: 'black' }}>Hello</Text>
                <Text style={{ fontSize: 15, color: 'black' }}>{userData?.name}</Text>
            </View>
            <Image source={{ uri: userData?.photo }} style={styles.avatar} />
        </View>
    );
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
// eslint-disable-next-line eol-last
});