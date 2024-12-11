import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  SafeAreaView,
  feAreaView,
  ScrollView,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Modal,
  SafeAreaProvider,
  Image,
  GreySeparator,
  FlatList,
  Dimensions,
  Icon,
} from "react-native";



export default function EventsScreen({navigation}) {


  const handleGoToMap = () => {
    navigation.navigate("MapScreen");
  };

  const handleGoToFavorite = () => {
    navigation.navigate("TabNavigator", { screen: "Favoris" });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.inputContainer}>
        <View style={styles.input}>
        <FontAwesome name="map-marker" size={30} color="#D84815" />
          <TextInput
            placeholder="Ville ..."
            //   onChangeText={(value) => setUsername(value)}
            //   value={username}
            //   style={styles.input}
          />
        </View>
        <View style={styles.input}>
        <FontAwesome name="search" size={30} color="#D84815" />
          <TextInput
            placeholder="Type d'évenement ..."
            //   onChangeText={(value) => setUsername(value)}
            //   value={username}
            //   style={styles.input}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleGoToMap} style={styles.button}>
          <Text style={styles.textButton}>Rechercher</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleGoToFavorite} style={styles.button}>
          <Text style={styles.textButton}>Mes événements</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// attention : le StyleSheet doit bien être en dehors de la fonction!
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    flex: 0.5,
    width: "75%",
    height: "50%",
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    fontFamily: "sans-serif",
    marginBottom: 10,
  },

  inputContainer: {
    
    justifyContent: "center",
    width : '50%'
  },

  input: {
    flexDirection : "raw",
    alignContent: "center",
    backgroundColor: "#EEECE8",
    paddingVertical : 15,
    borderRadius: 1,
    width: "100%",
    margin: 10,
    justifyContent: "center",
  },

  text: {
    fontSize: 22,
    fontFamily: "sans-serif",
    marginBottom: 50,
  },

  buttonContainer: {
    marginBottom: 25,
  },

  button: {
    backgroundColor: "#D84815",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 35,
    margin: 15,
  },

  textButton: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  
});
