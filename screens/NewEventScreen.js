import React, { useState } from 'react';
import { View, Image, Text, TextInput, Button, StyleSheet, Platform, Alert, KeyboardAvoidingView, TouchableOpacity, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';

const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_ADDRESS

export default function NewEventScreen({ navigation }) {

  // utilisation google fonts
  const [fontsLoaded] = useFonts({
    'Girassol-Regular': require('../assets/fonts/Girassol-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
  });

  // vérification du chargement de la font
  if (!fontsLoaded) {
    return null;
  };

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

    const formData = new FormData();
    formData.append('planner', user.username)
    formData.append('title', title);

    formData.append('date[day]', moment(day).format('YYYY-MM-DD'));
    formData.append('date[start]', startTime);
    formData.append('date[end]', endTime);

    formData.append('place[number]', placeNumber);
    formData.append('place[street]', street);
    formData.append('place[code]', code);
    formData.append('place[city]', city);

    formData.append('category', category);
    formData.append('description', description);
    formData.append('url', url);

    if (eventImage) {
      formData.append('eventImage', {
        uri: eventImage.uri,
        name: eventImage.fileName,
        type: eventImage.type,
      });
    }
      fetch(`${BACKEND_ADDRESS}/events/addevent`, {
        method: "POST",
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


/* 
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
  }; */


  /* return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
       <View style={styles.container}> */
      {/* Titre de l'événement */}
      {/* <View>
        <Text>Création de mon évènement</Text>
      </View> */}

      {/* Catégorie de l'événement */}
      {/* <View>
        <Text style={styles.label}>Catégorie de l'événement</Text>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Choisir une catégorie" value="" />
          <Picker.Item label="Salon" value="salon" />
          <Picker.Item label="Atelier" value="atelier" />
          <Picker.Item label="Conférence" value="conference" /> */}
          {/* Ajouter d'autres catégories ici */}
     /*    </Picker>
      </View> */

      {/* Titre de l'événement */}
      {/* <View>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Décrivez votre évènement"
          value={title}
          onChangeText={setTitle}
          multiline={true}
          numberOfLines={6}
        />
      </View> */}

      {/* Date de l'événement */}
      {/* <View>
        <Text style={styles.label}>Date de l'événement</Text>
        <Button title="Sélectionner la date" onPress={showDatepicker} />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )} */}
      /* </View> */

      {/* Lieu de l'événement */}
      {/* <View>
        <Text style={styles.label}>Lieu de l'événement</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrer le lieu de l'évènement"
          value={place}
          onChangeText={setPlace}
        />
      </View> */}

      {/* Affichage de la latitude et longitude */}
      {/* <View>
        <Text>Latitude: {latitude}</Text>
        <Text>Longitude: {longitude}</Text>
      </View> */}

      {/* Bouton pour soumettre le formulaire */}
      {/* <View>
        <Button title="Soumettre" onPress={handleSubmit} />
      </View>
    </View>
    </KeyboardAvoidingView>
  );
} */}

