/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import database from '@react-native-firebase/database';
import Youtube from 'react-native-youtube-iframe';
import YoutubeIframe from 'react-native-youtube-iframe';

type videoinfo = {  
    name: string;
    description: string;
    url: string;
};

export default function PlayVideo(ref:string) {
    // return (
    //     <View style={{ flex: 1 }}>
    //       <YoutubeIframe
    //         width={300}
    //         height={200}
    //         play={true}
    //         videoId="3NHYl0Lo74A"
    //         onChangeState={(event: any) => console.log(event)}
    //         onReady={() => console.log("ready")}
    //         onError={(e: any) => console.log(e)}
    //       />
    //     </View>
    //   );
    
    const navigation = useNavigation();
    const param = useRoute().params;
    const [videoInfo,setVideoInfo] = useState<videoinfo[]>([]);
    const [playing, setPlaying] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            ref = param.ref;
            console.log(ref + '/' + param.lesson.id );
            const db = database().ref(ref + '/' + param.lesson.id );
            const listener = db.on('value', snapshot => {
                
                const data = snapshot.val();
                console.log(data);
                const loadedLecture = [];
                // Kiểm tra data không phải là null hoặc undefined trước khi lặp
                if (data) {
                    
                        if (
                            data.Name &&
                            data.Description &&
                            data.Url
                        ) {

                            console.log("da them vao 1");
                            loadedLecture.push({
                               
                                description: data.Description,
                                name: data.Name,
                                url: data.Url,
                            });
                        }
                }
                setVideoInfo(loadedLecture);
                console.log('././////');
                console.log(loadedLecture);
            });
            return () => db.off('value', listener); // Clean up the listener on unmount
        };
        fetchData();
    }, []);


   

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  const customIndicatorStyle = { color: 'black' }; // Define custom color here
  return (
    <View style={{padding:20,marginTop:0}}>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginBottom:10}}>
             <Icon name= "arrowleft" size={30} color="black" />
        </TouchableOpacity>
        {videoInfo?
        <View>
             <Text style={{marginBottom:10,fontSize:22,fontWeight:'bold', color:'black'}}>{videoInfo[0]?.name}</Text>
            <YoutubeIframe
            
            height={220}
            play={playing}
            videoId={videoInfo[0]?.url}
            onChangeState={onStateChange}
            />
            
            <Text style={{fontWeight:'bold',marginBottom:10,fontSize:16, color:'black'}}>Description</Text>
           
                      
           <ScrollView
               style={{ height: '50%' }}
           >
               <Text style={{ lineHeight: 20, marginBottom: 10, fontSize: 16, color: 'black', textAlign: 'justify' }}>
                   {videoInfo[0]?.description}
               </Text>
           </ScrollView>
        </View> : null}
     
    </View>
  );
}
