import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Login from './Components/Login';
import { AuthContext } from './Context/AuthContext';
import Home from './Components/Home';

export default function App() {
    const [userData, setUserData] = React.useState(null);
    return (
        <View style={styles.container}>
            <AuthContext.Provider value={{ userData, setUserData }}>
                {userData ? <Home /> : <Login />}
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