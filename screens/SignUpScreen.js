import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
  } from 'react-native';

import { useDispatch } from 'react-redux';
import { login } from '../reducers/user'



export default function SignUpScreen({navigation}) {

    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

   
    const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_ADDRESS

    const handleSubmitSignUp = () => {
      console.log(BACKEND_ADDRESS);
      
        fetch(`${BACKEND_ADDRESS}/users/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, username, password }),
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log('Données retournées par le backend:', data);
      
            if (data.result) {
              dispatch(
                login({
                  token: data.token,
                  username: data.username,
                  email: data.email,
                })
              );
              console.log('Inscription réussie');
              navigation.navigate('Home', { screen: 'Dashboard' });
            } else {
              console.log('Erreur lors de l"inscription:', data.error);
            }
          });
      };
return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Image style={styles.logo} source={require('../assets/LogoBc.png')} />
      <Text style={styles.title}>BookConnect</Text>

      <TextInput placeholder="Nom d'utilisateur"  onChangeText={(value) => setUsername(value)} value={username} style={styles.input} />
      <TextInput placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" autoComplete="email" textContentType="emailAddress" onChangeText={(value) => setEmail(value)} value={email} style={styles.input} />
      <TextInput placeholder="Mot de passe" onChangeText={(value) => setPassword(value)} value={password} style={styles.input} />
      <TouchableOpacity onPress={() => handleSubmitSignUp()} style={styles.button} activeOpacity={0.8}>
        <Text style={styles.textButton}>S'inscrire</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
)

}

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
