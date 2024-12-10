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

const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_ADDRESS

export default function SignInScreen({navigation}) {
    console.log(BACKEND_ADDRESS);
    
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmitSignIn = () => {
        fetch(`${BACKEND_ADDRESS}/users/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
            .then((response) => {
            
              return response.json();
            })
            .then((data) => {
              console.log('Données retournées par le backend:', data);
        
              if (data) {
                
                dispatch(
                  data&&login({
                    token: data.token,
                    email: data.email,
                  })
                );
                console.log('Connexion réussie');
                navigation.navigate('Home', { screen: 'Dashboard' });
              } else {
                
                console.log('Erreur lors de la connexion:', data.error);
              }
             
            });
        
          
        };
     
    

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Image style={styles.logo} source={require('../assets/LogoBc.png')} />
          <Text style={styles.title}>BookConnect</Text>
    
          <TextInput placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" autoComplete="email" textContentType="emailAddress" onChangeText={(value) => setEmail(value)} value={email} style={styles.input} />
          <TextInput placeholder="Mot de passe" onChangeText={(value) => setPassword(value)} value={password} style={styles.input} />
          <TouchableOpacity onPress={() => handleSubmitSignIn()} style={styles.button} activeOpacity={0.8}>
            <Text style={styles.textButton}>Se connecter</Text>
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
    
