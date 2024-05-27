import React, { useContext, useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { onGoogleButtonPress } from '../API/HandleLoginGoogle';
import database from '@react-native-firebase/database';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
const { width, height } = Dimensions.get('window');

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { AuthContext } from '../Context/AuthContext';

GoogleSignin.configure({
  webClientId: '1065593939332-258cvhe9b7e9ukh8mtferjt73avhtkr4.apps.googleusercontent.com',
  iosClientId: '1065593939332-27sqkgpmi0hb6ssaqip5fm0uj6ocbjkm.apps.googleusercontent.com',
});




export default function Login(this: any): React.JSX.Element {
  const { userData, setUserData } = useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);
  const [checkUser, setCheckUser] = React.useState(false);
  const handleLogin = async () => {
    await onGoogleButtonPress(setUserData);
  };


  return (
    <View style={styles.container}>
      <Image
        source={require('../img/bg_login.png')}
        style={styles.header}
        resizeMode="contain" />
      <View style={styles.footer}>
        <Text style={styles.text_welcome}>Welcome to Education App</Text>
        <Text style={styles.text_login}>Login/Sign up</Text>
        <TouchableOpacity onPress={handleLogin}>
          <LinearGradient
            colors={['#0C7DE4', '#12B3C9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button} >
            <Image source={require('../img/google-logo.png')} />
            <Text style={styles.text_button}>Sign in with Google</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      {loading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator
            size={'large'}
            color={'grey'}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    height: '30%',
    width: '100%',
    position: 'relative',
  },
  footer:
  {
    position: 'absolute',
    top: '27%',  //cách top 27%
    height: '73%',//100 - 27 = 73 sẽ là phần còn lại của màn hình
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'white',
  },
  text_welcome: {
    color: 'black',
    fontSize: 40,
    flexWrap: 'wrap',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 50,
    fontWeight: '500',
  },
  text_login: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    marginHorizontal: 20,
    fontWeight: 'bold',
  },
  button: {
    flexDirection: 'row',
    width: width - 60,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 20,

  },
  text_button: {
    color: 'white',
    fontSize: 17,
    marginLeft: 10,
    fontFamily: 'Inter',
  },
  loadingIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
  },
},

);

