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
  Alert
} from "react-native";




export default function EventsScreen({navigation}) {
  const [searchText, setSearchText] = useState("");

  const addEvent = () => {
    navigation.navigate('NewEvent', { screen: 'NewEventScreen' })
  };

  const handleSearchPlace = async () => { 
    if (!searchText) {
      Alert.alert('Erreur','Veuillez entrer une localisation');
      return;
    }
    
    try {
       const apiKey =process.env.EXPO_PUBLIC_MAP_API_KEY
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

    navigation.navigate("MapScreen", {
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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSearchPlace} style={styles.button}>
          <Text style={styles.textButton}>Rechercher</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={addEvent} style={styles.button}>
          <Text style={styles.textButton}>Mes événements</Text>
        </TouchableOpacity>
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
  inputContainer: {
    justifyContent: "center",
    width: "80%",
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEECE8",
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
  },
  inputField: {
    flex: 1,
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 25,
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