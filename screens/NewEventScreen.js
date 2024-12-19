import React, { useState } from 'react';

// BottomTab visible sur les Screens => globalStyles
import { globalStyles } from '../styles/globalStyles';

// import pour utiliser le comoposant Icon de la bibliothèque react-native-vector-icons (/FontAwesome)
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  View,
  Image,
  Text,
  TextInput,

  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient';

import { addEvent } from "../reducers/event";

// import pour faire un menu déroulant
import { Picker } from '@react-native-picker/picker';


const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_ADDRESS


export default function NewEventScreen({ navigation }) {

  // https://reactnavigation.org/docs/navigation-object/#goback
  const goBack = () => navigation.goBack();

  const user = useSelector((state) => state.user.value);
  const event = useSelector((state) => state.event.value)

  const dispatch = useDispatch();

  const [title, setTitle] = useState('');

  const [day, setDay] = useState(new Date()); // Date par défaut
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [identityPlace, setIdentityPlace] = useState('');
  const [placeNumber, setPlaceNumber] = useState('');
  const [street, setStreet] = useState('');
  const [code, setCode] = useState('');
  const [city, setCity] = useState('');

  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [eventImage, setEventImage] = useState(null);

  // Gestion de la visibilité du DatePicker / StartTime / EndTime
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setIsStarTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setIsEndTimePickerVisibility] = useState(false);

  const [categorySelected, setCategorySelected] = useState('');
  const [subcategorySelected, setSubcategorySelected] = useState('');

  // Fonctions pour gérer le DatePicker / StartTime / EndTime
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const showStartTimePicker = () => setIsStarTimePickerVisibility(true);
  const hideStartTimePicker = () => setIsStarTimePickerVisibility(false);
  const showEndTimePicker = () => setIsEndTimePickerVisibility(true);
  const hideEndTimePicker = () => setIsEndTimePickerVisibility(false);

  // Bouton pour sélectionner la date
  const handleConfirmDate = (selectedDate) => {
    // Convertir la date au format Date
    const formattedDate = moment(selectedDate).toDate(); // Utiliser .toDate() pour obtenir un objet Date
    setDay(formattedDate);  // Mettre à jour l'état avec l'objet Date
    hideDatePicker(); // Fermer le picker
  };

   // Bouton pour sélectionner l'heure de début
   const handleStartTimeConfirm = (selectedStart) => {
    // Convertir la date au format Date
    const formattedStart = moment(selectedStart).toDate(); // Utiliser .toDate() pour obtenir un objet Date
    setStartTime(formattedStart);  // Mettre à jour l'état avec l'objet Date
    hideStartTimePicker(); // Fermer le picker
  };

  // Bouton pour sélectionner l'heure de fin
  const handleEndTimeConfirm = (selectedEnd) => {
    // Convertir la date au format Date
    const formattedEnd = moment(selectedEnd).toDate(); // Utiliser .toDate() pour obtenir un objet Date
    setEndTime(formattedEnd);  // Mettre à jour l'état avec l'objet Date
    hideEndTimePicker(); // Fermer le picker
  };


  // Demande de permission pour accéder à la galerie photo du mobile
  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (!permissionResult.granted) {
        Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la galerie.');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        quality: 1,
      });
  
      console.log(result);
  
      if (result.cancelled) {
        console.log("Aucune image sélectionnée.");
        return;
      }
  
      setEventImage(result.assets[0]);
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image", error);
    }
  };

  const handleSubmit = async () => {
  console.log("Planner :", user._id);
  console.log("Titre :", title);
  console.log("Catégorie :", category);
  console.log("Sous-catégorie :", subcategory);
  console.log("Description :", description);
  console.log("Jour :", day);
  console.log("Heure de début :", startTime);
  console.log("Heure de fin :", endTime);
  console.log("Lieu :", identityPlace);
  console.log("Adresse :", `${placeNumber} ${street}, ${code} ${city}`);
  console.log("Image de couverture :", eventImage);

  if (!title) console.log("Erreur : Le titre est manquant");
  if (!identityPlace) console.log("Erreur : Le lieu est manquant");
  if (!placeNumber) console.log("Erreur : Le numéro de place est manquant");
  if (!street) console.log("Erreur : La rue est manquante");
  if (!code) console.log("Erreur : Le code postal est manquant");
  if (!city) console.log("Erreur : La ville est manquante");
  if (!category) console.log("Erreur : La catégorie est manquante");
  if (!subcategory) console.log("Erreur : La sous-catégorie est manquante");
  if (!description) console.log("Erreur : La description est manquante");
  if (!day) console.log("Erreur : La date est manquante");
  if (!startTime) console.log("Erreur : L'heure de début est manquante");
  if (!endTime) console.log("Erreur : L'heure de fin est manquante");

  // Vérification plus précise des valeurs
  if (!day || !(day instanceof Date) || isNaN(day.getTime())) {
    console.log("Erreur : La date est invalide ou manquante");
  }
  if (!startTime || !(startTime instanceof Date) || isNaN(startTime.getTime())) {
    console.log("Erreur : L'heure de début est invalide ou manquante");
  }
  if (!endTime || !(endTime instanceof Date) || isNaN(endTime.getTime())) {
    console.log("Erreur : L'heure de fin est invalide ou manquante");
  }
    if (!title || !identityPlace || !placeNumber || !street || !code || !city || !category || !subcategory || !description || !day || !startTime || !endTime) {
      Alert.alert('Erreur', 'Tous les champs obligatoires doivent être remplis.');
      return;
    };

    console.log("Planner (user._id) :", user._id);
    if (!user._id) {
      Alert.alert('Erreur', 'Utilisateur non authentifié.');
      return;
    };

    // Formatage des heures de début et de fin avant de créer l'objet eventData
    const start = startTime;
    const end = endTime;


    // Création de l'objet conforme au backend
    const eventData = {
      planner: user._id,
      title,
      category,
      subcategory,
      date: {
        day: moment(day).toDate(),  // Utilise la date formatée en ISO
        start: start,
        end: end,
      },
      identityPlace,
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
          console.log('Évènement créé avec succès. Navigation vers MyEvents.');
          navigation.navigate('MyEvents');
          dispatch(addEvent(data.event))

          setTitle('')
          setDay(new Date());
          setStartTime('')
          setEndTime('')
          setIdentityPlace('')
          setPlaceNumber('')
          setStreet('')
          setCode('')
          setCity('')
          setCategory('')
          setSubcategory('')
          setDescription('')
          setUrl('')
          setEventImage('')
          navigation.navigate('MyEvents')
        } else {
          console.log('erreur lors de la création', data.error);
        }
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView>
      <View>

        {/* Titre + Bouton retour (goBack) */}
          <View style={globalStyles.titleContainer}>
            <Text style={globalStyles.title}>Mes évènements</Text>
            <TouchableOpacity onPress={goBack} activeOpacity={0.8}>
              <Icon style={globalStyles.returnContainer} name="chevron-circle-left" size={32} color='rgba(55, 27, 12, 0.3)' />
            </TouchableOpacity>
          </View>

          {/* formulaire pour créer un évènement */}
          <View style={styles.inputContainerSection}>
          <Text style={styles.label}>Titre de l'évènement</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Titre de l'évènement (obligatoire)"
                onChangeText={(value) => setTitle(value)}
                value={title}
              />
            </View>

          {/* Date Picker */}
          <View style={styles.datePickerContainer}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity onPress={showDatePicker} style={styles.inputContainer}>
              <Text style={styles.dateText}>{moment(day).format('DD MMMM YYYY')}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              date={new Date(day)} // Convertir 'day' en objet Date
              onConfirm={handleConfirmDate}
              onCancel={hideDatePicker}
              locale="fr"
              headerTextIOS="Choisissez une date"
              confirmTextIOS="Confirmer"
              cancelTextIOS="Annuler"
            />
          </View>

          {/* Start Time Picker */}
          <View style={styles.timePickerContainer}>
            <Text style={styles.label}>Heure de début</Text>
            <TouchableOpacity onPress={showStartTimePicker} style={styles.inputContainer}>
            <Text style={styles.dateText}>{moment(startTime).format('HH:mm')}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
            isVisible={isStartTimePickerVisible}
            mode="time"
            date={new Date(startTime)} // Convertir 'startTime' en objet Date
            onConfirm={handleStartTimeConfirm}
            onCancel={hideStartTimePicker}
            locale="fr"
            headerTextIOS="Choisissez une heure de début"
            confirmTextIOS="Confirmer"
            cancelTextIOS="Annuler"
          />
        </View>

        {/* End Time Picker */}
        <View style={styles.timePickerContainer}>
        <Text style={styles.label}>Heure de fin</Text>
        <TouchableOpacity onPress={showEndTimePicker} style={styles.inputContainer}>
        <Text style={styles.dateText}>{moment(endTime).format('HH:mm')}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
        isVisible={isEndTimePickerVisible}
        mode="time"
        date={new Date(endTime)} // Convertir 'endTime' en objet Date
        onConfirm={handleEndTimeConfirm}
        onCancel={hideEndTimePicker}
        locale="fr"
        headerTextIOS="Choisissez une heure de fin"
        confirmTextIOS="Confirmer"
        cancelTextIOS="Annuler"
      />
      </View>
      </View>

            <Text style={styles.label}>Lieu</Text>
          <TextInput
          style={styles.inputContainer}
            placeholder="Lieu de l'évènement"
            value={identityPlace}
            onChangeText={setIdentityPlace}
          />

          <Text style={styles.label}>Numéro</Text>
          <TextInput
          style={styles.inputContainer}
            placeholder="Numéro de rue (obligatoire)"
            value={placeNumber}
            onChangeText={setPlaceNumber}
          />
          
          <Text style={styles.label}>Rue</Text>
          <TextInput
            style={styles.inputContainer}
            placeholder="Nom de la rue (obligatoire)"
            value={street}
            onChangeText={setStreet}
          />
          <Text style={styles.label}>Code Postal</Text>
          <TextInput
            style={styles.inputContainer}
            placeholder="Code postal"
            value={code}
            onChangeText={setCode}
          />
          <Text style={styles.label}>Ville</Text>
          <TextInput
            style={styles.inputContainer}
            placeholder="Ville (obligatoire)"
            value={city}
            onChangeText={setCity}
          />

            {/* Catégorie : liste de choix */}
            <Text style={styles.label}>Catégorie</Text>
            <View style={styles.pickerContainer}>
            <Pressable
              style={styles.picker}
            >
              <Picker
                selectedValue={category}
                onValueChange={(value) => { setCategory(value); setCategorySelected(value) }}
                prompt="Catégorie (obligatoire)"
              >
                <Picker.Item label="Festival & Salons" value="Festival" />
                <Picker.Item label="Ateliers" value="Ateliers" />
                <Picker.Item label="Rencontres" value="Rencontres" />
                <Picker.Item label="Concours" value="Concours" />
                <Picker.Item label="Conférences" value="Conférences" />
                <Picker.Item label="Lectures publiques" value="Lectures" />
                <Picker.Item label="Expositions" value="Expositions" />
                <Picker.Item label="Autre" value="Autre" />
              </Picker>
            </Pressable>
            <Icon
              style={styles.iconPicker}
              name="check"
              size={22}
              color={categorySelected ? styles.iconPickerChecked : null}
            />
          </View>

          {/* Sous-Catégorie : liste de choix */}
          <Text style={styles.label}>Sous-Catégorie</Text>
            <View style={styles.pickerContainer}>
            <Pressable
              style={styles.picker}
            >
              <Picker
                selectedValue={subcategory}
                onValueChange={(value) => { setSubcategory(value); setSubcategorySelected(value) }}
                prompt="Sous-Catégorie (obligatoire)"
              >
                <Picker.Item label="Festival & Salons" value="Festival" />
                <Picker.Item label="Ateliers" value="Ateliers" />
                <Picker.Item label="Rencontres" value="Rencontres" />
                <Picker.Item label="Concours" value="Concours" />
                <Picker.Item label="Conférences" value="Conférences" />
                <Picker.Item label="Lectures publiques" value="Lectures" />
                <Picker.Item label="Expositions" value="Expositions" />
                <Picker.Item label="Autre" value="Autre" />
              </Picker>
            </Pressable>
            <Icon
              style={styles.iconPicker}
              name="check"
              size={22}
              color={subcategorySelected ? styles.iconPickerChecked : null}
            />
          </View>


          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.inputContainer}
            placeholder="Description (obligatoire)"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>URL</Text>
          <TextInput
            style={styles.inputContainer}
            placeholder="Lien associé (facultatif)"
            value={url}
            onChangeText={setUrl}
          />

          <Text style={styles.label}>Image</Text>
          <TouchableOpacity onPress={handleImagePick} style={styles.inputContainer}>
            <Text>Sélectionner une image</Text>
          </TouchableOpacity>
          {eventImage && <Image source={{ uri: eventImage.uri }} style={styles.imagePreview} />}

        </View>

        {/* Bouton */}
        <View style={styles.buttonContainer}>
          <LinearGradient
            colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.7 }}
            style={styles.gradientButton}
          >
            <TouchableOpacity
              onPress={handleSubmit}
            >
              <Text style={styles.textButton}>Publier</Text>
            </TouchableOpacity>
          </LinearGradient>
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

  // CSS du container du formulaire
  inputContainerSection: {
    maxWidth: '100%',
  }, 

  // CSS de l'input title de l'évènement
  inputContainer: {
    backgroundColor: "rgba(238, 236, 232, 0.9)",
    paddingTop: 5,
    borderRadius: 5,
    borderBottomWidth: 0.7,
    borderBottomColor: "rgba(55, 27, 12, 0.50)",
    maxWidth: "90%",
    paddingLeft: 15,
    margin: 10,
    height: 50,
    justifyContent: 'center',
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },

  datePickerContainer: {
    marginVertical: 15,
  },

  dateText: {
    fontSize: 16,
    color: '#555',
  },

  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },

  // CSS du bouton publier avec spinner-button pour le temps de chargement
  buttonContainer: {
    justifyContent: 'center', // Centrer le contenu horizontalement
    alignItems: 'center',
    marginBottom: 60, // Ajoutez un peu d'espace vertical si nécessaire
    marginTop: 30,
  },

  gradientButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    padding: 25, // Ajustez la hauteur du bouton
    width: '50%', // Largeur du bouton
  },

  textButton: {
    textAlign: 'center',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
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
  picker: {
    backgroundColor: "rgba(238, 236, 232, 0.9)",
    borderRadius: 5,

    width: "85%",
    paddingLeft: 5,
  },

  pickerText: {
    fontFamily: 'sans-serif',
    fontSize: 16,
  },

  iconPicker: {
    position: 'absolute',
    color: 'rgba(211, 211, 211, 1)',
    height: '55%',
    width: '10%',
    top: 10,
    right: 5,
  },

  iconPickerChecked: {
    color: 'green',
  },
});
