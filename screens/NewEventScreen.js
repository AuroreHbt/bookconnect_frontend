import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, Alert, KeyboardAvoidingView, } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location'; 
import { useEffect } from 'react';

export default function NewEventScreen() {
const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [place, setPlace] = useState('');
  const [category, setCategory] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fonction pour gérer la sélection de la date
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  // Fonction pour afficher le date picker
  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  // Fonction pour récupérer la latitude et la longitude en fonction de l'adresse
  const fetchCoordinates = async (address) => {
    try {
      
      const apiKey = 'PUBLIC_MAP_API_KEY';
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${address}&key=${apiKey}`;

      const response = await axios.get(url);
      const data = response.data;

      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setLatitude(lat.toString());
        setLongitude(lng.toString());
      } else {
        Alert.alert("Erreur", "Adresse introuvable");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la récupération des coordonnées");
    }
  };

  // Effectuer une recherche de coordonnées chaque fois que le lieu change
  useEffect(() => {
    if (place) {
      fetchCoordinates(place);
    }
  }, [place]);

  // Fonction pour soumettre le formulaire
  const handleSubmit = () => {
    if (!title || !place || !category || !date || !latitude || !longitude) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const eventData = {
      title,
      date,
      place,
      category,
      latitude,
      longitude
    };

    // Ici vous pouvez envoyer `eventData` à votre API ou base de données
    console.log(eventData);
    Alert.alert('Événement soumis', 'L\'événement a été ajouté avec succès!');
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
       <View style={styles.container}>
      {/* Titre de l'événement */}
      <View>
        <Text>Création de mon évènement</Text>
      </View>

      {/* Catégorie de l'événement */}
      <View>
        <Text style={styles.label}>Catégorie de l'événement</Text>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Choisir une catégorie" value="" />
          <Picker.Item label="Salon" value="salon" />
          <Picker.Item label="Atelier" value="atelier" />
          <Picker.Item label="Conférence" value="conference" />
          {/* Ajouter d'autres catégories ici */}
        </Picker>
      </View>

      {/* Titre de l'événement */}
      <View>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Décrivez votre évènement"
          value={title}
          onChangeText={setTitle}
          multiline={true}
          numberOfLines={6}
        />
      </View>

      {/* Date de l'événement */}
      <View>
        <Text style={styles.label}>Date de l'événement</Text>
        <Button title="Sélectionner la date" onPress={showDatepicker} />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      {/* Lieu de l'événement */}
      <View>
        <Text style={styles.label}>Lieu de l'événement</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrer le lieu de l'évènement"
          value={place}
          onChangeText={setPlace}
        />
      </View>

      {/* Affichage de la latitude et longitude */}
      <View>
        <Text>Latitude: {latitude}</Text>
        <Text>Longitude: {longitude}</Text>
      </View>

      {/* Bouton pour soumettre le formulaire */}
      <View>
        <Button title="Soumettre" onPress={handleSubmit} />
      </View>
    </View>
    </KeyboardAvoidingView>
  );
}

// attention : le StyleSheet doit bien être en dehors de la fonction!
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
  },
});
