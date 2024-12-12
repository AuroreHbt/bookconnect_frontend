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


export default function StoriesScreen({ navigation }) {

    // utilisation google fonts
    const [fontsLoaded] = useFonts({
        'Girassol-Regular': require('../assets/fonts/Girassol-Regular.ttf'),
        'GermaniaOne-Regular': require('../assets/fonts/GermaniaOne-Regular.ttf'),
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

                <TouchableOpacity onPress={handleNewStory} style={styles.button}>
                    <Text style={styles.textButton}>Je publie mon histoire</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleMyPublishedStories} style={styles.button}>
                    <Text style={styles.textButton}>Mes histoires publiées</Text>
                </TouchableOpacity>

            </View>


            <View>
                <Text style={styles.title}>Lire et découvrir</Text>
            </View>

            <View style={styles.buttonContainer}>

                <TouchableOpacity onPress={handleMyCurrentReadings} style={styles.button}>
                    <Text style={styles.textButton}>Mes lectures en cours</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleFindStories} style={styles.button}>
                    <Text style={styles.textButton}>Découvrir des histoires</Text>
                </TouchableOpacity>

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
        marginTop: 75,
        marginBottom: 75,
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
        margin: 5,
        color: 'rgba(55, 27, 12, 0.9)', // #371B0C
    },

    buttonContainer: {
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
    },

    button: {
        backgroundColor: "#E0D2C3",
        borderRadius: 10,
        padding: 15,
        margin: 10,
        width: '65%',
    },

    textButton: {
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        fontSize: 18,
        color: 'rgba(55, 27, 12, 0.8)', // #371B0C
    },
});
