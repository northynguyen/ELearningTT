import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Login from './Components/Login';
import { AuthContext } from './Context/AuthContext';
import Home from './Components/Home';
import storage from '@react-native-firebase/storage';

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
// import { useEffect } from 'react';
// import database from '@react-native-firebase/database';

// const FetchData = () => {
//     useEffect(() => {
//         // Đảm bảo thay thế 'userID' bằng key cụ thể hoặc đường dẫn đến user cụ thể mà bạn muốn đọc.
//         database()
//             .ref('/user/userID')
//             .once('value')
//             .then(snapshot => {
//                 console.log('User data: ', snapshot.val());
//                 // Bạn có thể xử lý dữ liệu tại đây hoặc thiết lập state để cập nhật UI.
//             })
//             .catch(error => {
//                 console.error('Error fetching user data:', error);
//             });
//     }, []);

//     return (
//         <View>
//             <Text>Fetching Data from Firebase Realtime Database</Text>
//         </View>
//     );
// };

// export default FetchData;
