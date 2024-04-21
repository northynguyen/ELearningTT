import { GoogleSignin } from '@react-native-google-signin/google-signin';
export const onGoogleButtonPress = async (setUserData) => {
    try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log(userInfo.user);
            setUserData(userInfo.user);
        } catch (error) {
            console.error(error);
        }
    } catch (error) {
        console.error(error);
    }
}