import { firebase } from '@react-native-firebase/database';

export const checkUserRole = async (userData) => {
    try {
        const snapshot = await firebase.database().ref('/User').orderByChild('email').equalTo(userData.email).once('value');
        if (snapshot.exists()) {
            let userRole;
            snapshot.forEach(childSnapshot => {
                const existingUserData = childSnapshot.val();
                userRole = existingUserData.role;
            });
            return userRole === 'admin';
        } else {
            // Nếu người dùng không tồn tại, bạn có thể thực hiện các hành động khác ở đây
            return false;
        }
    } catch (error) {
        console.error('Error checking user role:', error);
        return false;
    }
};
