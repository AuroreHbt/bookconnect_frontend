import React, { useState } from "react";

// import du style global commun avec SignInScreen
import { signPageStyles } from '../styles/signPageStyles';

// import de la bibliothèque d'icône Fontawsome via react-native-vector-icons
import Icon from 'react-native-vector-icons/FontAwesome';

import { LinearGradient } from 'expo-linear-gradient';

import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from "react-native";

import { useDispatch } from "react-redux";
import { login } from "../reducers/user";


// Regex pour valider les emails et mots de passe
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const usernameRegex = /^[a-zA-Z0-9]{3,}$/;
// Uniquement des carctères alphanumériques et long d'au moins 3 carctères

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// Rentrer au moins une lettre, un chiffre et un caractère spécial et 8 caractères mini.

// Adresse du backend via la variable d'environnement
const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_ADDRESS;

export default function SignUpScreen({ navigation }) {

  const dispatch = useDispatch();

  // Etat pour stocker les valeurs des champs de saisie
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Etat pour la gestion des erreurs de validation
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Etat pour afficher ou masquer le mot de passe
  const [showPassword, setShowPassword] = useState(false);

  const validateFields = () => {
    let isValid = true;

    // Validation de l'email
    if (!EMAIL_REGEX.test(email)) {
      setEmailError("Veuillez entrer un email valide.");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Validation du username
    if (!usernameRegex.test(username)) {
      setUsernameError(
        "Le nom d'utilisateur doit contenir au moins 3 caractères alphanumériques."
      );
      isValid = false;
    } else {
      setUsernameError("");
    }

    // Validation du mot de passe
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Le mot de passe doit contenir au moins 8 caractères, une lettre, un chiffre et un caractère spécial."
      );
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  // Fonction pour afficher ou non le mot de passe
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // https://reactnavigation.org/docs/navigation-object/#goback
  const goBack = () => navigation.goBack();

  const handleSubmitSignUp = () => {
    // Early return si les champs, username, email mot de passes ne sont pas remplies correctement
    if (!validateFields()) {
      console.log("Validation échouée");
      return;
    }

    // Fetch de la route post du backend pour l'inscription
    fetch(`${BACKEND_ADDRESS}/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("Données retournées par le backend:", data);

        if (data.result) {
          // Si connexion réussie, redirige vers le dashboard
          dispatch(
            login({
              token: data.token,
              username: data.username,
              email: data.email,
              _id: data._id,
            })
          );
          console.log("Inscription réussie");
          navigation.navigate("TabNavigator", { screen: "Dashboard" });
        } else {
          console.log('Erreur lors de l"inscription:', data.error);
        }
      });
  };

  return (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>

        <KeyboardAvoidingView
          style={signPageStyles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Image style={signPageStyles.logo} source={require("../assets/LogoBc.png")} />
          <View>
            <Text style={signPageStyles.title}>BookConnect</Text>
          </View>

          <View style={signPageStyles.separator} />

          <View style={signPageStyles.inputContainer}>
            <TextInput
              placeholder="Nom d'utilisateur"
              onChangeText={(value) => setUsername(value)}
              value={username}
              style={signPageStyles.input}
            />
            {usernameError ? (
              <Text style={signPageStyles.errorText}>{usernameError}</Text>
            ) : null}
            <TextInput
              placeholder="E-mail"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              onChangeText={(value) => setEmail(value)}
              value={email}
              style={signPageStyles.input}
            />
            {emailError ? <Text style={signPageStyles.errorText}>{emailError}</Text> : null}

            <View style={signPageStyles.inputPwd}>
              <TextInput
                placeholder="Mot de passe"
                secureTextEntry={!showPassword}
                onChangeText={(value) => setPassword(value)}
                value={password}
                style={signPageStyles.input}
              />
              <TouchableOpacity
                style={signPageStyles.iconContainer}
                onPress={toggleShowPassword}
              >
                <Icon
                  name={showPassword ? 'eye' : 'eye-slash'}
                  size={24}
                  color={showPassword ? 'rgba(55, 27, 12, 0.8)' : '#D3D3D3'}
                />
              </TouchableOpacity>
            </View>

            {passwordError ? (
              <Text style={signPageStyles.errorText}>{passwordError}</Text>
            ) : null}

            <View style={signPageStyles.buttonContainer}>
              <LinearGradient
                colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.7 }}
                style={signPageStyles.gradientButton}
                activeOpacity={0.8}
              >
                <TouchableOpacity
                  onPress={() => handleSubmitSignUp()}
                  style={signPageStyles.button}
                >
                  <Text style={signPageStyles.textButton}>S'inscrire</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>

            <View style={signPageStyles.returnContainer}>
              <TouchableOpacity
                onPress={goBack}
                style={signPageStyles.returnButton}
                activeOpacity={0.8}
              >
                <Text style={signPageStyles.textReturn}>J'ai déjà un compte</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};
