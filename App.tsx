
import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import Login from './Components/Login';
import { AuthContext } from './Context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import HomeNavigation from './Navigations/HomeNavigation';
import { firebase } from '@react-native-firebase/database';


interface UserData {
    email: string;
    familyName: string;
    givenName: string;
    id: string;
    name: string;
    photo: string;
}

export default function App() {
    const [userData, setUserData] = React.useState(null);
    const [checkUser, setCheckUser] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const importUserData = (userData: UserData) => {

        const db = firebase.database().ref('/User');
        db.orderByChild('email').equalTo(userData.email).once('value', (snapshot) => {
            if (snapshot.exists()) {
                // You can perform other actions here if the user already exists.
            } else {
                // If the user doesn't exist, add the new user with userData.id as the key
                const userRef = db.child(userData.id);
                userRef
                    .set({
                        email: userData.email,
                        familyName: userData.familyName,
                        givenName: userData.givenName,
                        name: userData.name,
                        photo: userData.photo,
                        role: 'user',
                    })
                    .then(() => console.log('Data updated.'))
                    .catch(error => console.error('Error updating data:', error));
            }
        });
    };

    useEffect(() => {
        if (userData) {
            importUserData(userData);
        }
    }, [userData]);

    return (
        <View style={styles.container}>
            <AuthContext.Provider value={{ userData, setUserData }}>
                {userData ?
                    <NavigationContainer>
                        <HomeNavigation />
                    </NavigationContainer>
                    : <Login />}
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

