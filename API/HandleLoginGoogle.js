import { GoogleSignin } from '@react-native-google-signin/google-signin';


export async function onGoogleButtonPress() {
    try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log(userInfo.user);
        } catch (error) {
            console.error(error);
        }
    } catch (error) {
        console.error(error);
    }
}