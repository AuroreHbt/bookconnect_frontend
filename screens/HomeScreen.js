import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native'


export default function HomeScreen({ navigation }) {

    const handleSubmitSignUp = () => {
        navigation.navigate('SignUp', { screen: 'SignUpScreen' })
    }

    const handleSubmitSignIn = () => {
        navigation.navigate('SignIn', { screen: 'SignInScreen' })
    }

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
                <TouchableOpacity onPress={handleSubmitSignUp} style={styles.button}>
                    <Text style={styles.textButton}>S'inscrire</Text>
                </TouchableOpacity>
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
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    logo: {
        flex: 0.5,
        width: '75%',
        height: '50%',
    },

    title: {
        fontSize: 36,
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
        marginBottom: 10,
        color: '#371B0C',
    },

    text: {
        fontSize: 22,
        fontFamily: 'Poppins',
        marginBottom: 50,
        color: '#371B0C',
    },

    buttonContainer: {
        marginBottom: 25,
    },

    button: {
        backgroundColor: '#D84815',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 35,
        margin: 15,
    },

    textButton: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
