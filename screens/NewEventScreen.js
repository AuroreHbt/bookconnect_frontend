import React, { useState } from 'react';

import {
  View,
  Image,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient';


const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_ADDRESS


export default function NewEventScreen({ navigation }) {

  // https://reactnavigation.org/docs/navigation-object/#goback
  const goBack = () => navigation.goBack();

  const user = useSelector((state) => state.user.value);

  const [title, setTitle] = useState('');

  const [day, setDay] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [placeNumber, setPlaceNumber] = useState('');
  const [street, setStreet] = useState('');
  const [code, setCode] = useState('');
  const [city, setCity] = useState('');

  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [eventImage, setEventImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleCategory = () => {
    if (!category) {
      alert("Veuillez sélectionner une catégorie.");
      return;
    }
    alert(`Catégorie sélectionnée : ${category}`);
  };


  // Demande de permission pour accéder à la galerie photo du mobile
  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la galerie.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setEventImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    console.log("Titre :", title);
    console.log("Catégorie :", category);
    console.log("Description :", description);
    console.log("Jour :", day);
    console.log("Heure de début :", startTime);
    console.log("Heure de fin :", endTime);
    console.log("Adresse :", `${placeNumber} ${street}, ${code} ${city}`);
    console.log("Image de couverture :", eventImage);

    if (!title || !placeNumber || !street || !code || !city || !category || !description || !day || !startTime || !endTime) {
      Alert.alert('Erreur', 'Tous les champs obligatoires doivent être remplis.');
      return;
    };

    console.log("Planner (user.username) :", user.username);
    if (!user.username) {
      Alert.alert('Erreur', 'Utilisateur non authentifié.');
      return;
    };


    // Création de l'objet conforme au backend
    const eventData = {
      planner: user.username,
      title,
      category,
      date: {
        day: moment(day).format('YYYY-MM-DD'),
        start: moment(`${moment(day).format('YYYY-MM-DD')}T${startTime}`).toISOString(),
        end: moment(`${moment(day).format('YYYY-MM-DD')}T${endTime}`).toISOString(),
      },
      place: {
        number: parseInt(placeNumber, 10),
        street,
        city,
        code: parseInt(code, 10),
      },
      description,
      url: url || '', // Fournir une valeur par défaut si `url` est facultatif
      isLiked: false, // Ajout d'une valeur par défaut
    };

    console.log("Données envoyées :", eventData);

    // Ajout de l'image si elle existe
    const formData = new FormData();
    formData.append('eventData', JSON.stringify(eventData));
    if (eventImage) {
    formData.append('eventImage', {
      uri: eventImage.uri,
      name: eventImage.fileName || 'event_image.jpg',
      type: eventImage.type || 'image/jpeg',
    });
    }
    fetch(`${BACKEND_ADDRESS}/events/addevent`, {
      method: "POST",
      headers: {
        'Accept': 'application/json', // Optionnel pour indiquer que vous attendez du JSON en réponse
        'Authorization': `Bearer ${user.token}` // Assurez-vous que le token est présent dans l'état utilisateur
      },
      body: formData,
    }).then((response) => response.json())
      .then((data) => {
        console.log("réponse du serveur", data)
        if (data.result) {
          console.log('Evènement créée');
        } else {
          console.log('erreur lors de la création', data.error);
        }
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.label}>Titre</Text>
          <TextInput
            style={styles.input}
            placeholder="Titre de l'évènement"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Jour</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            <Text>{day.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={day}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDay(selectedDate);
              }}
            />
          )}

          <Text style={styles.label}>Heure de début</Text>
          <TextInput
            style={styles.input}
            placeholder="Heure de début (HH:mm)"
            value={startTime}
            onChangeText={setStartTime}
          />

          <Text style={styles.label}>Heure de fin</Text>
          <TextInput
            style={styles.input}
            placeholder="Heure de fin (HH:mm)"
            value={endTime}
            onChangeText={setEndTime}
          />

          <Text style={styles.label}>Numéro</Text>
          <TextInput
            style={styles.input}
            placeholder="Numéro de rue"
            value={placeNumber}
            onChangeText={setPlaceNumber}
          />
          <Text style={styles.label}>Rue</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom de la rue"
            value={street}
            onChangeText={setStreet}
          />
          <Text style={styles.label}>Code Postal</Text>
          <TextInput
            style={styles.input}
            placeholder="Code postal"
            value={code}
            onChangeText={setCode}
          />
          <Text style={styles.label}>Ville</Text>
          <TextInput
            style={styles.input}
            placeholder="Ville"
            value={city}
            onChangeText={setCity}
          />

          <Text style={styles.label}>Catégorie</Text>
          <TextInput
            style={styles.input}
            placeholder="Catégorie de l'évènement"
            value={category}
            onChangeText={setCategory}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>URL</Text>
          <TextInput
            style={styles.input}
            placeholder="Lien associé (facultatif)"
            value={url}
            onChangeText={setUrl}
          />

          <Text style={styles.label}>Image</Text>
          <TouchableOpacity onPress={handleImagePick} style={styles.imageButton}>
            <Text>Sélectionner une image</Text>
          </TouchableOpacity>
          {eventImage && <Image source={{ uri: eventImage }} style={styles.imagePreview} />}

          <Button title="Créer l'évènement" onPress={handleSubmit} />
        </View>
        <View>
          <TouchableOpacity
            onPress={goBack}
            style={styles.returnContainer}
            activeOpacity={0.8}
          >
            <Text style={styles.textReturn}>Retour</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.95,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  imageButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 15,
  },
});