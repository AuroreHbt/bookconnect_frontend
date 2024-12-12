import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Image
} from 'react-native';

// https://docs.expo.dev/versions/latest/sdk/font/
// https://docs.expo.dev/develop/user-interface/fonts/
// import pour utliser le hook useFonts pour charger la police
import { useFonts } from 'expo-font';

import { LinearGradient } from 'expo-linear-gradient';


export default function HomeScreen({ navigation }) {

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

    // Navigation par lien vers SignUpScreen, déclaré dans App.js, via la prop naviagtion
    const handleSubmitSignUp = () => {
        navigation.navigate('SignUp')
    };

    // Navigation par lien vers SignInScreen, déclaré dans App.js, via la prop naviagtion
    const handleSubmitSignIn = () => {
        navigation.navigate('SignIn')
    };


    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>

            <Image source={require('../assets/LogoBc.png')} style={styles.logo} />

            <View>
                <Text style={styles.title}>BookConnect</Text>
            </View>

            <View>
                <Text style={styles.text}>Share, discover, write</Text>
            </View>

            <View style={styles.buttonContainer}>
                <LinearGradient
                    colors={['#D84815', '#EEECE8']} // E0D2C3
                    start={{ x: 0, y: 0 }} // Début du gradient (coin haut gauche)
                    end={{ x: 1, y: 1 }}   // Fin du gradient (coin bas droit)
                    style={styles.gradient}
                />
                <TouchableOpacity onPress={handleSubmitSignUp} style={styles.button}>
                    <Text style={styles.textButton}>S'inscrire</Text>
                </TouchableOpacity>
                {/* </View>
            <View style={styles.buttonContainer}> */}
                <TouchableOpacity onPress={handleSubmitSignIn} style={styles.button}>
                    <Text style={styles.textButton}>Se connecter</Text>
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
        justifyContent: 'center',
    },

    logo: {
        flex: 0.5,
        width: '70%',
        height: '50%',
    },

    title: {
        fontFamily: 'Girassol-Regular', // ou GermaniaOne-Regular
        fontWeight: '400',
        fontSize: 48,
        marginBottom: 10,
        color: 'rgba(55, 27, 12, 0.9)', // #371B0C
    },

    text: {
        fontFamily: 'Poppins-Medium',
        fontWeight: '500',
        fontSize: 22,
        marginBottom: 50,
        color: '#371B0C',
    },

    buttonContainer: {
        marginBottom: 25,
        width: '75%',
        alignItems: 'center',
        height: 150, // Hauteur du gradient
    },

    gradient: {
        flex: 1, // Rempli tout l'espace du conteneur
    },

    button: {
        backgroundColor: '#E0D2C3',
        borderRadius: 10,
        padding: 15,
        margin: 15,
        width: '75%',
    },

    textButton: {
        textAlign: 'center',
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        fontSize: 18,
        color: 'rgba(55, 27, 12, 0.8)', // #371B0C
    },
});
