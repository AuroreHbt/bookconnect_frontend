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

import { LinearGradient } from 'expo-linear-gradient';


export default function HomeScreen({ navigation }) {

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
                    colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 0.7 }}
                    style={styles.gradientButton}
                    activeOpacity={0.8}
                >
                    <TouchableOpacity
                        onPress={handleSubmitSignUp}
                        style={styles.button}
                    >
                        <Text style={styles.textButton}>S'inscrire</Text>
                    </TouchableOpacity>
                </LinearGradient>

                <LinearGradient
                    colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 0.7 }}
                    style={styles.gradientButton}
                    activeOpacity={0.8}
                >
                    <TouchableOpacity
                        onPress={handleSubmitSignIn}
                        style={styles.button}
                    >
                        <Text style={styles.textButton}>Se connecter</Text>
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
    },

    gradientButton: {
        borderRadius: 15,
        marginVertical: 10,
        width: '75%',
    },

    button: {
        padding: 10,
        margin: 10,

    },

    textButton: {
        textAlign: 'center',
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white', // 'rgba(55, 27, 12, 0.8)', // #371B0C
    },
});
