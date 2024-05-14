/* eslint-disable semi */
/* eslint-disable react/self-closing-comp */
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';

export default function Loading() {
    return (
        <View style={styles.loadingIndicator}>
            <ActivityIndicator
                size={'large'}
                color={'grey'}
            >
            </ActivityIndicator>
        </View>

    );
}
const styles = StyleSheet.create({
    loadingIndicator: {
        position: 'absolute',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'stransparent',
        width: '100%',
        height: '100%',

    },
// eslint-disable-next-line eol-last
})