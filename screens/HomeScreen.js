import React from 'react';
import { View, ImageBackground, Text, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Image  } from 'react-native'

import { useDispatch } from 'react-redux';


export default function HomeScreen({navigation}) {


const handleSubmitSignUp = () => {
    navigation.navigate('SignUp', { screen: 'SignUpScreen' })
}

const handleSubmitSignIn = () => {
    navigation.navigate('SignIn', { screen: 'SignInScreen' })
}

    return (
      
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <Image source={require('../assets/LogoBc.png')} style={styles.logo} />
        <Text style={styles.title}>BookConnect
            Share, discover, write
        </Text>
        <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handleSubmitSignUp} style={styles.buttonsignUp}> 
        <Text style={styles.textButton}>S'inscrire</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmitSignIn} style={styles.buttonsignIn}>
        <Text style={styles.textButton}>Se connecter</Text>
        </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
      
    )
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
        width: '100%',
        height: '50%',
      },

});
