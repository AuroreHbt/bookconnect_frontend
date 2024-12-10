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

// Regex pour valider les emails et mots de passe
const EMAIL_REGEX  = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Rentrer au moins une lettre, un chiffre et un caractère spécial et 8 caractères mini.

// Adresse du backend via la variable d'environnement
const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_ADDRESS

export default function SignInScreen({ navigation }) {
  

  const dispatch = useDispatch();

  // Etat pour stocker les valeurs des champs de saisie 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [username, setUsername] = useState('')

  // Etat pour la gestion des erreurs de validation
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

// Etat pour afficher ou masquer le mot de passe
  const [showPassword, setShowPassword] = useState(false);

  const validateFields = () => {
    let isValid = true;
  
    // Validation de l'email
    if (!EMAIL_REGEX.test(email)) {
      setEmailError('Veuillez entrer un email valide.');
      isValid = false;
    } else {
      setEmailError('');
    }
  
    // Validation du mot de passe
    if (!passwordRegex.test(password)) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères, une lettre, un chiffre et un caractère spécial.');
      isValid = false;
    } else {
      setPasswordError('');
    }
  
    return isValid;
  };

  // Fonction pour afficher ou non le mot de passe
  const toggleShowPassword = () => {
    setShowPassword(!showPassword); 

  }

  const handleSubmitSignIn = () => {
 // Early return si les champs, email et mot de passes ne sont pas remplies correctement
    if(!validateFields()) {
      console.log('Validation échouée');
      return
    }
// Fetch de la route post du backend pour la connexion 
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
  // Si connexion réussie, redirige vers le dashboard
          dispatch(
            data&&login({
              token: data.token,
              email: data.email,
            })
          );
          console.log('Connexion réussie');
          navigation.navigate('TabNavigator', { screen: 'Dashboard' });
        } else {
          console.log('Erreur lors de la connexion:', data.error);
        };
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Image style={styles.logo} source={require('../assets/LogoBc.png')} />
      <Text style={styles.title}>BookConnect</Text>
      
      <TextInput placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" autoComplete="email" textContentType="emailAddress" onChangeText={(value) => setEmail(value)} value={email} style={styles.input} />
      {emailError? <Text style={styles.errorText}>{emailError}</Text> : null }
      <TextInput placeholder="Mot de passe" secureTextEntry={!showPassword} onChangeText={(value) => setPassword(value)} value={password} style={styles.input} />
      {passwordError? <Text style={styles.errorText}>{passwordError}</Text> : null }
      <TouchableOpacity onPress={() => handleSubmitSignIn()} style={styles.button} activeOpacity={0.8}>
        <Text style={styles.textButton}>Se connecter</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: '80%',
    height: '50%',
  },

});

