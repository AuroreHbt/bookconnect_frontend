import React from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Image
} from 'react-native'

// https://docs.expo.dev/versions/latest/sdk/font/
// https://docs.expo.dev/develop/user-interface/fonts/
// import pour utliser le hook useFonts pour charger la police
import { useFonts } from 'expo-font';

import { LinearGradient } from 'expo-linear-gradient';


export default function StoriesScreen({ navigation }) {

    // utilisation google fonts
    const [fontsLoaded] = useFonts({
        'Girassol-Regular': require('../assets/fonts/Girassol-Regular.ttf'),
        'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    });

    // vérification du chargement de la font
    if (!fontsLoaded) {
        return null;
    };

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
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <Image source={require('../assets/LogoBc.png')} style={styles.logo} />

            <View>
                <Text style={styles.title}>Ecrire et partager</Text>
            </View>

            <View style={styles.buttonContainer}>
                <LinearGradient
                    colors={['rgba(216, 72, 21, 1)', 'rgba(216, 72, 21, 0.8)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.gradientButton}
                >
                    <TouchableOpacity
                        onPress={handleNewStory}
                        style={styles.button}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.textButton}>Je publie mon histoire</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>

            <View style={styles.buttonContainer}>
                <LinearGradient
                    colors={['rgba(216, 72, 21, 1)', 'rgba(216, 72, 21, 0.8)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.gradientButton}
                >
                    <TouchableOpacity
                        onPress={handleMyPublishedStories}
                        style={styles.button}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.textButton}>Mes histoires publiées</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>

            <View>
                <Text style={styles.title}>Lire et découvrir</Text>
            </View>

            <View style={styles.buttonContainer}>
                <LinearGradient
                    colors={['rgba(216, 72, 21, 1)', 'rgba(216, 72, 21, 0.8)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.gradientButton}
                >
                    <TouchableOpacity
                        onPress={handleMyCurrentReadings}
                        style={styles.button}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.textButton}>Mes lectures en cours</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>

            <View style={styles.buttonContainer}>
                <LinearGradient
                    colors={['rgba(216, 72, 21, 1)', 'rgba(216, 72, 21, 0.8)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.gradientButton}
                >
                    <TouchableOpacity
                        onPress={handleFindStories}
                        style={styles.button}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.textButton}>Découvrir des histoires</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>

        </KeyboardAvoidingView>
    );
};


// attention : le StyleSheet doit bien être en dehors de la fonction!
const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: 50,
        marginBottom: 100,
    },

    logo: {
        flex: 0.5,
        width: '50%',
        height: '50%',
    },

    title: {
        fontFamily: 'Poppins-Medium',
        fontWeight: '500',
        fontSize: 22,
        marginTop: 10,
        color: 'rgba(55, 27, 12, 0.9)', // #371B0C
    },

    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },

    gradientButton: {
        borderRadius: 10,
        width: '65%',
    },

    button: {
        padding: 15,
        margin: 5,
    },

    textButton: {
        textAlign: 'center',
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white', // 'rgba(55, 27, 12, 0.8)', // #371B0C
    },

});
