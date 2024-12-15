import React, { useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";

export default function EventsScreen({ navigation }) {
  const [city, setCity] = useState("");
  const [events, setEvents] = useState([]);
  const [fontsLoaded] = useFonts({
    "Girassol-Regular": require("../assets/fonts/Girassol-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const addEvent = () => {
    navigation.navigate("NewEvent", { screen: "NewEventScreen" });
  };

  const handleSearchPlace = async () => {
    if (!city.trim()) {
      Alert.alert("Erreur", "Veuillez entrer une localisation");
      return;
    }

    try {
      console.log("Searching events for city:", city);

      // Appel à l'API de géocodage
      const apiKey = process.env.EXPO_PUBLIC_MAP_API_KEY;
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Geocode API response:", data);

      if (!data.results || data.results.length === 0) {
        Alert.alert("Erreur", "Localisation introuvable");
        return;
      }

      // Recherche des événements associés
      const backend = process.env.EXPO_PUBLIC_BACKEND_ADDRESS;
      const eventResponse = await fetch(
        `${backend}/events/searchevent/${city}`
      );
      const eventData = await eventResponse.json();
      console.log("Event API response:", eventData);

      const { lat, lng } = data.results[0].geometry;

      // Mise à jour de l'état local avec les événements récupérés
      setEvents(eventData); // Assuming eventData is the correct array of events

      // Navigation vers la carte avec les coordonnées et les événements
      navigation.navigate("MapScreen", {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        events: eventData, // Passing the actual events array
      });
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
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
        <View>
          <View>
            <Text style={styles.title}>BookConnect</Text>
          </View>
          <Text style={styles.text}>
            "Des événements pour échanger, des moments pour s'inspirer."
          </Text>
        </View>

        <View style={styles.input}>
          <FontAwesome name="map-marker" size={30} color="#D84815" />
          <TextInput
            placeholder="Ville ou code postal  ..."
            onChangeText={(value) => setCity(value)}
            value={city}
            style={styles.inputField}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <LinearGradient
          colors={["rgba(255, 123, 0, 0.9)", "rgba(216, 72, 21, 1)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.7 }}
          style={styles.gradientButton}
          activeOpacity={0.8}
        >
          <TouchableOpacity onPress={handleSearchPlace} style={styles.button}>
            <Text style={styles.textButton}>Rechercher</Text>
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          colors={["rgba(255, 123, 0, 0.9)", "rgba(216, 72, 21, 1)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.7 }}
          style={styles.gradientButton}
          activeOpacity={0.8}
        >
          <TouchableOpacity onPress={addEvent} style={styles.button}>
            <Text style={styles.textButton}>Ajouter un évènement</Text>
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
  buttonContainer: {
    marginTop: 30,
  },
  gradientButton: {
    borderRadius: 10,
    marginVertical: 10,
    width: "50%",
  },
  button: {
    padding: 10,
    margin: 10,
  },
  textButton: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  eventItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    width: "80%",
  },
  eventTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  eventDescription: {
    marginTop: 5,
    fontSize: 14,
  },
  eventLocation: {
    marginTop: 5,
    fontSize: 12,
    color: "#777",
  },
  noEventsText: {
    marginTop: 20,
    fontSize: 16,
    color: "#777",
  },

  title: {
    fontFamily: 'Girassol-Regular', // ou GermaniaOne-Regular
    fontWeight: '400',
    fontSize: 48,
    marginBottom: 10,
    color: 'rgba(55, 27, 12, 0.9)', // #371B0C
    textAlign: "center",
},

  text: {
    fontFamily: "Poppins-Medium", // ou GermaniaOne-Regular
    fontWeight: "500",
    fontSize: 22,
    marginBottom: 50,
    color: "#371B0C",
    textAlign: "center",
  },
});
