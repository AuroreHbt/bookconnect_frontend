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


  const handleSearchPlace = async () => { 
    if (!searchText) {
      Alert.alert('Erreur', 'Veuillez entrer une localisation');
      return;
    }
  
    try {
       const apiKey =process.env.EXPO_PUBLIC_GOOGLE_API_KEY
      // URL pour l'API Google Places
      const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${searchText}&inputtype=textquery&fields=geometry&key=${apiKey}`;
  
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
  
      const data = await response.json();
   console.log(data)
      // Vérifier si des résultats sont retournés
      if (data.candidates.length === 0) {
        Alert.alert('Erreur', 'Localisation introuvable');
        return;
      }
  
      // Extraire les coordonnées du premier résultat
      const { lat, lng } = data.candidates[0].geometry.location;
  
      // Naviguer vers l'écran MapScreen avec les coordonnées
      navigation.navigate("MapScreen", {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la recherche.');
    }
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
            onChangeText={(value) => setSearchText(value)}
            value={searchText}
            style={styles.input}
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
        <TouchableOpacity onPress={handleSearchPlace} style={styles.button}>
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
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#EEECE8',
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
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
