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

    const handleSubmitSignUp = () => {
        dispatch(login(username))
        
   
        navigation.navigate('TabNavigator', {screen: "Home"} )
    }

return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Image style={styles.logo} source={require('../assets/LogoBc.png')} />
      <Text style={styles.title}>BookConnect</Text>

      <TextInput placeholder="Nom d'utilisateur" onChangeText={(value) => setUsername(value)} value={username} style={styles.input} />
      <TextInput placeholder="E-mail" onChangeText={(value) => setEmail(value)} value={email} style={styles.input} />
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
