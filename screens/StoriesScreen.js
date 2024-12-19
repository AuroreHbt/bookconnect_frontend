import React from 'react';

import { bottomTabStyles } from "../styles/bottomTabStyles";

import {
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Image
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient';


export default function StoriesScreen({ navigation }) {

    // Navigation par lien définie dans App.js
    const handleNewStory = () => {
        navigation.navigate('NewStory')
    };

    const handleMyPublishedStories = () => {
        navigation.navigate('MyPublishedStories')
    };

    const handleMyCurrentReadings = () => {
        navigation.navigate('MyCurrentReadings')
    };

    const handleFindStories = () => {
        navigation.navigate('FindStories')
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={bottomTabStyles.container}
        >
            <Image source={require('../assets/LogoBc.png')} style={bottomTabStyles.logo} />

            <View>
                <Text style={bottomTabStyles.title}>Ecrire et partager</Text>
            </View>

            <View style={bottomTabStyles.buttonContainer}>
                <LinearGradient
                    colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 0.7 }}
                    style={bottomTabStyles.gradientButton}
                    activeOpacity={0.8}
                >
                    <TouchableOpacity
                        onPress={handleNewStory}
                        style={bottomTabStyles.button}
                    >
                        <Text style={bottomTabStyles.textButton}>Je publie mon histoire</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>

            <View style={bottomTabStyles.buttonContainer}>
                <LinearGradient
                    colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 0.7 }}
                    style={bottomTabStyles.gradientButton}
                    activeOpacity={0.8}
                >
                    <TouchableOpacity
                        onPress={handleMyPublishedStories}
                        style={bottomTabStyles.button}
                    >
                        <Text style={bottomTabStyles.textButton}>Mes histoires publiées</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>

            <View>
                <Text style={bottomTabStyles.title}>Découvrir</Text>
            </View>


            <View style={bottomTabStyles.buttonContainer}>
                <LinearGradient
                    colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 0.7 }}
                    style={bottomTabStyles.gradientButton}
                    activeOpacity={0.8}
                >
                    <TouchableOpacity
                        onPress={handleFindStories}
                        style={bottomTabStyles.button}
                    >
                        <Text style={bottomTabStyles.textButton}>Découvrir des histoires</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>

        </KeyboardAvoidingView>
    );
};
