import React, { useState } from "react";

// import de la bibliothèque d'icône Fontawsome via react-native-vector-icons
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Image style={styles.logo} source={require("../assets/LogoBc.png")} />
      <View>
        <Text style={styles.title}>BookConnect</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nom d'utilisateur"
          onChangeText={(value) => setUsername(value)}
          value={username}
          style={styles.input}
        />
        {usernameError ? (
          <Text style={styles.errorText}>{usernameError}</Text>
        ) : null}
        <TextInput
          placeholder="E-mail"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          onChangeText={(value) => setEmail(value)}
          value={email}
          style={styles.input}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <View style={styles.inputPwd}>
          <TextInput
            placeholder="Mot de passe"
            secureTextEntry={!showPassword}
            onChangeText={(value) => setPassword(value)}
            value={password}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={toggleShowPassword}
          >
            <Icon
              name={showPassword ? 'eye' : 'eye-slash'}
              size={24}
              color={showPassword ? '#D84815' : '#000000'}
            />
          </TouchableOpacity>
        </View>

        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <TouchableOpacity
          onPress={() => handleSubmitSignUp()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>S'inscrire</Text>
        </TouchableOpacity>

        <View style={styles.returnContainer}>
          <TouchableOpacity
            onPress={goBack}
            style={styles.returnButton}
            activeOpacity={0.8}
          >
            <Text stye={styles.textReturn}>J'ai déjà un compte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    flex: 0.3,
    width: "50%",
    height: "50%",
  },

  title: {
    fontSize: 30,
    marginBottom: 150,
    fontWeight: 'bold',
    color: '#371B0C',
  },

  separator: {
    width: '25%',
    height: 3,
    backgroundColor: '#371B0C',
    position: 'absolute',
    top: 350
  },

  inputPwd: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    width: '100%' // 100% de la largeur de inputContainer
  },

  iconContainer: {
    position: 'absolute', // position absolue pour superposer l'icone sur l'input
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },

  inputContainer: {
    justifyContent: "center",
    alignItems: 'center',
    width: '50%'
  },

  input: {
    backgroundColor: "#EEECE8",
    paddingVertical: 15,
    borderRadius: 1,
    width: "100%",
    margin: 10,
    justifyContent: "center",
    borderRadius: 5,
    paddingLeft: 10
  },

  button: {
    backgroundColor: "#D84815",
    margin: 40,
    borderRadius: 10,
    padding: 10,
    paddingLeft: 50,
    paddingRight: 50,
    justifyContent: 'center',
    width: '80%',
  },

  textButton: {
    color: "white",
    fontWeight: 'bold',
  },
});
