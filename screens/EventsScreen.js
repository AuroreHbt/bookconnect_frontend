import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MapView, { Marker } from 'react-native-maps';
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
  const [city, setCity] = useState("");
  const [events, setEvents] = useState([]);



  const addEvent = () => {
    navigation.navigate('NewEvent', { screen: 'NewEventScreen' })
  };

  const handleSearchPlace = async () => { 
    if (!city) {
      Alert.alert('Erreur', 'Veuillez entrer une localisation');
      return;
    }

    try {
      const apiKey = process.env.EXPO_PUBLIC_MAP_API_KEY;
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${apiKey}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.results.length === 0) {
        Alert.alert("Erreur", "Localisation introuvable");
        return;
      }

      // Recherche des événements à cette adresse dans votre backend
      const backend= process.env.EXPO_PUBLIC_BACKEND_ADDRESS;
      const eventResponse = await fetch(`${backend}/events/searchevent/${city}`);
      const eventData = await eventResponse.json();
      console.log(eventData)

      if (!eventData.result) {
        Alert.alert("Erreur", eventData.error || "Aucun événement trouvé.");
        return;
      }
      
      const { lat, lng } = data.results[0].geometry;

      // Redirection vers la carte avec les coordonnées
      navigation.navigate("MapScreen", {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        events: eventData.events, 
      });
console.log(eventData)

      // Mise à jour des événements dans l'état local
      setEvents(eventData.events);

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
            onChangeText={(value) => setCity(value)}
            value={city}
            style={styles.inputField}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSearchPlace} style={styles.button}>
          <Text style={styles.textButton}>Rechercher</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={addEvent} style={styles.button}>
          <Text style={styles.textButton}>Ajouter un évènement</Text>
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