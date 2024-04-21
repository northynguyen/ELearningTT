import React, { useContext } from 'react';
import type { PropsWithChildren } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
    Dimensions,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useColorScheme,
    View,
    VirtualizedList,
} from 'react-native';
import { AuthContext } from '../Context/AuthContext';
import WelcomeHeader from './WelcomeHeader';
const { width, height } = Dimensions.get('window');


export default function Home(this: any): React.JSX.Element {
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'android' ? 'padding' : 'height'}>
            <View style={styles.container}>
                <WelcomeHeader />
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={styles.searchBox}>
                        <Image source={require('../img/search-logo.png')} style={styles.icon} />
                        <TextInput placeholder='Search' placeholderTextColor={'lightgray'} style={styles.searchText} />
                    </View>
                </TouchableWithoutFeedback>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                    <Image source={require('../img/introduce.png')} style={styles.img_introduce} />
                    <View style={styles.containerCourses}>
                        <Text style={styles.headerCourses}>Video Courses</Text>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollCourses}>
                            <Image source={require('../img/videoCouses1.png')} style={styles.img_courses} />
                            <Image source={require('../img/videoCouses1.png')} style={styles.img_courses} />
                            <Image source={require('../img/videoCouses1.png')} style={styles.img_courses} />
                            <Image source={require('../img/videoCouses1.png')} style={styles.img_courses} />
                            <Image source={require('../img/videoCouses1.png')} style={styles.img_courses} />
                            <Image source={require('../img/videoCouses1.png')} style={styles.img_courses} />
                        </ScrollView>
                    </View>
                    <View style={styles.containerCourses}>
                        <Text style={styles.headerCourses}>Basic Populer Courses</Text>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollCourses}>
                            <Image source={require('../img/videoCouses1.png')} style={styles.img_courses} />
                            <Image source={require('../img/videoCouses1.png')} style={styles.img_courses} />
                            <Image source={require('../img/videoCouses1.png')} style={styles.img_courses} />
                            <Image source={require('../img/videoCouses1.png')} style={styles.img_courses} />
                            <Image source={require('../img/videoCouses1.png')} style={styles.img_courses} />
                            <Image source={require('../img/videoCouses1.png')} style={styles.img_courses} />
                        </ScrollView>
                    </View>
                    <View style={styles.containerCourses}>
                        <Text style={styles.headerCourses}>Advance Courses</Text>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollCourses}>
                            <Image source={require('../img/videoCouses1.png')} style={styles.img_courses} />
                            <Image source={require('../img/videoCouses1.png')} style={styles.img_courses} />
                            <Image source={require('../img/videoCouses1.png')} style={styles.img_courses} />
                            <Image source={require('../img/videoCouses1.png')} style={styles.img_courses} />
                            <Image source={require('../img/videoCouses1.png')} style={styles.img_courses} />
                            <Image source={require('../img/videoCouses1.png')} style={styles.img_courses} />
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F8FC',
    },
    searchBox: {
        height: 70,
        backgroundColor: 'white',
        marginHorizontal: 25,

        borderRadius: 10,
        elevation: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 10,
        marginLeft: 20,
    },
    searchText: {
        color: 'black',
        flex: 1,
    },
    content:
    {

    },
    containerCourses: {
        height: 150,
        margin: 20,

    },
    headerCourses: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    img_introduce: {
        height: 150,
        width: width - 40,
        alignSelf: 'center',
        marginVertical: 20,
    },
    img_courses: {
        height: 112.5,
        width: 200,
        resizeMode: 'contain',
        marginRight: 10,
    },
    scrollCourses: {
    },
});

