/* eslint-disable prettier/prettier */
/* eslint-disable space-infix-ops */
import { View, Dimensions } from 'react-native';
import React from 'react';
import * as Progress from 'react-native-progress';
export default function ProgressBar({ progress }: { progress: any }) {
    // rest of the code
   return (
    <View style={{ width: Dimensions.get('screen').width * 0.87,paddingBottom:10}}  >
      <Progress.Bar progress={progress}
      width={Dimensions.get('screen').width*0.85} />
    </View>
  );
}
