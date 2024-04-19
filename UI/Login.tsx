import React from 'react';
import type { PropsWithChildren } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
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
import { onGoogleButtonPress } from '../API/HandleLoginGoogle';

GoogleSignin.configure({
  webClientId: '1065593939332-8sb3vk3fn42f6tca0pkdt98cbufp47lg.apps.googleusercontent.com',
})
function App(this: any): React.JSX.Element {

  return (
    <View style={styles.container}>
      <Image
        source={require('../img/bg_login.png')}
        style={styles.header}
        resizeMode='contain' />
      <View style={styles.footer}>
        <Text style={styles.text_welcome}>Welcome to Education App</Text>
        <Text style={styles.text_login}>Login/Sign up</Text>
        <TouchableOpacity onPress={onGoogleButtonPress}>
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
    position: 'relative'
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
  }
});

export default App;
