import React, { useState } from "react";

import { bottomTabStyles } from "../styles/bottomTabStyles";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import { LinearGradient } from 'expo-linear-gradient';

import {
  SafeAreaProvider,
  SafeAreaView,
  feAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  GreySeparator,
  FlatList,
  Dimensions,
  Icon,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";


export default function EventsScreen({ navigation }) {
  const [searchText, setSearchText] = useState("");

  const addEvent = () => {
    navigation.navigate('NewEvent')
  };

  const myEvents = () => {
    navigation.navigate('MyEvents')
  };

  const handleSearchPlace = async () => {
    if (!searchText) {
      Alert.alert('Erreur', 'Veuillez entrer une localisation');
      return;
    }

    try {
      const apiKey = process.env.EXPO_PUBLIC_MAP_API_KEY
      // URL pour l'API 
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${searchText}&key=${apiKey}`

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.results.length === 0) {
        Alert.alert("Erreur", "Localisation introuvable");
        return;
      }

      const { lat, lng } = data.results[0].geometry;

      navigation.navigate("Map", {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la recherche.");
    }
  };
  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={bottomTabStyles.container}
    >
      <Image
        source={require('../assets/LogoBc.png')}
        style={bottomTabStyles.logo}
      />

      <View style={styles.inputContainer}>
        <View style={styles.input}>
          <FontAwesome name="map-marker" size={30} color="#D84815" />
          <TextInput
            placeholder="Ville ..."
            onChangeText={(value) => setSearchText(value)}
            value={searchText}
            style={styles.inputField}
          />
        </View>
      </View>

      <View style={bottomTabStyles.buttonContainer}>
        <LinearGradient
          colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.7 }}
          style={bottomTabStyles.gradientButton}
          activeOpacity={0.8}
        >
          <TouchableOpacity
            onPress={handleSearchPlace}
            style={bottomTabStyles.button}
          >
            <Text style={bottomTabStyles.textButton}>Rechercher</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View style={bottomTabStyles.buttonContainer}>
        <LinearGradient
          colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.7 }}
          style={bottomTabStyles.gradientButton}
          activeOpacity={0.8}
        >
          <TouchableOpacity
            onPress={addEvent}
            style={bottomTabStyles.button}
          >
            <Text style={bottomTabStyles.textButton}>Ajouter un évènement</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View style={bottomTabStyles.buttonContainer}>
        <LinearGradient
          colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.7 }}
          style={bottomTabStyles.gradientButton}
          activeOpacity={0.8}
        >
          <TouchableOpacity
            onPress={myEvents}
            style={bottomTabStyles.button}
          >
            <Text style={bottomTabStyles.textButton}>Mes événements</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  inputContainer: {
    justifyContent: "center",
    width: "80%",
  },

  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEECE8",
    padding: 10,
    marginTop: 50,
    marginBottom: 20,
    borderRadius: 10,
    borderBottomWidth: 0.7,
    borderBottomColor: "rgba(55, 27, 12, 0.50)",
  },

  inputField: {
    flex: 1,
    marginLeft: 10,
  },

});