import { View, StyleSheet } from 'react-native';
import React, { useEffect, useRef } from 'react';
import Login from './Components/Login';
import { AuthContext } from './Context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import HomeNavigation from './Navigations/HomeNavigation';
import { firebase } from '@react-native-firebase/database';
import FlashMessage from 'react-native-flash-message';

interface UserData {
    email: string;
    familyName: string;
    givenName: string;
    id: string;
    name: string;
    photo: string;
}

export default function App() {
    const [userData, setUserData] = React.useState<UserData | null>(null);
    const hasFetchedData = useRef(false);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const importUserData = (userData: UserData) => {
    const importUserData = async (userData: UserData) => {
        try {
            const db = firebase.database().ref('/User');
            const snapshot = await db.orderByChild('email').equalTo(userData.email).once('value');

            if (snapshot.exists()) {
                // You can perform other actions here if the user already exists.
                console.log('User already exists:', userData.email);
                snapshot.forEach((childSnapshot) => {
                    const existingUserData = childSnapshot.val();
                    setUserData(existingUserData);
                    hasFetchedData.current = true;
                    return true; // Exit the forEach loop
                });
            } else {
                const userRef = db.child(userData.id);
                await userRef.set({
                    email: userData.email,
                    familyName: userData.familyName,
                    givenName: userData.givenName,
                    name: userData.name,
                    photo: userData.photo,
                    role: 'user',
                });
                console.log('Data updated.');
                setUserData(userData);
                hasFetchedData.current = true;
            }
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    useEffect(() => {
        if (userData && !hasFetchedData.current) {
            importUserData(userData);
        }
    }, [userData]);

    return (
        <View style={styles.container}>
            <AuthContext.Provider value={{ userData, setUserData }}>
                {userData ? (
                    <NavigationContainer>
                        <HomeNavigation />
                        <FlashMessage position="bottom" />
                    </NavigationContainer>
                ) : (
                    <Login />
                )}
            </AuthContext.Provider>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F8FC',
    },
});
