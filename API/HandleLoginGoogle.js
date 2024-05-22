/* eslint-disable no-undef */
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const onGoogleButtonPress = async (setUserData) => {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        setUserData(userInfo.user);
        // Lưu userInfo vào state hoặc context để sử dụng sau này
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // Người dùng hủy đăng nhập, xử lý tương ứng
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // Quá trình đăng nhập đã bắt đầu, xử lý tương ứng
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // Google Play Services không khả dụng, xử lý tương ứng
        } else {
          // Xảy ra lỗi không xác định, xử lý tương ứng
          console.error(error);
        }
    }
};

export const onGoogleLogout = async (setUserData) => {
  try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUserData(null);
      // Xóa dữ liệu người dùng hoặc thực hiện bất kỳ xử lý logout nào khác
  } catch (error) {
      console.error(error);
  }
};
