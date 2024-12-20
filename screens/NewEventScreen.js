import React, { useState, useEffect } from 'react';

// BottomTab visible sur les Screens => globalStyles
import { globalStyles } from '../styles/globalStyles';

// import pour utiliser le comoposant Icon de la bibliothèque react-native-vector-icons (/FontAwesome)
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  View,
  Image,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Keyboard,
} from 'react-native';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient';

import { addEventPlanner } from "../reducers/event";

// import pour faire un menu déroulant
import { Picker } from '@react-native-picker/picker';


const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_ADDRESS


export default function NewEventScreen({ navigation }) {
  useEffect(() => {
    Keyboard.dismiss();
  }, []);

  // https://reactnavigation.org/docs/navigation-object/#goback
  const goBack = () => navigation.goBack();

  const user = useSelector((state) => state.user.value);
  const event = useSelector((state) => state.event.eventsPlanner)

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
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [eventImage, setEventImage] = useState(null);

  // Gestion de la visibilité du DatePicker / StartTime / EndTime
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setIsStarTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setIsEndTimePickerVisibility] = useState(false);

  const [categorySelected, setCategorySelected] = useState('');

  /* const [titleError, setTitleError] = useState('');
  const [dateError, setDateError] = useState('');
  const [startTimeError, setStartTimeError] = useState('');
  const [endTimeError, setEndTimeError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [identityPlaceError, setIdentityPlaceError] = useState('');
  const [placeError, setPlaceError] = useState('');
  const [descError, setDescError] = useState(''); */

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
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Utilise MediaTypeOptions
        quality: 1,
      });

      console.log("Résultat de la sélection d'image :", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setEventImage(result.assets[0]);
      } else {
        console.log("Aucune image sélectionnée.");
      }
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image", error);
    }
  };

  const handleSubmit = async () => {
    console.log("Planner :", user._id);
    console.log("Titre :", title);
    console.log("Catégorie :", category);
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
    if (!description) console.log("Erreur : La description est manquante");
    if (!day) console.log("Erreur : La date est manquante");
    if (!startTime) console.log("Erreur : L'heure de début est manquante");
    if (!endTime) console.log("Erreur : L'heure de fin est manquante");

    console.log("Préparation des données...");

    /* // validation des champs :
    let hasError = false;
   
    // Validation du titre
    if (!title) {
      setTitleError('Le titre est obligatoire');
      hasError = true;
    } else {
      setTitleError('');
    }
   
    // Validation de la catégorie
    if (!category) {
      setCategoryError('La catégorie est obligatoire');
      hasError = true;
    } else {
      setCategoryError('');
    }
   
    // Validation de la description
    if (!description) {
      setDescError('La description est obligatoire');
      hasError = true;
    } else {
      setDescError('');
    }
   
    // Validation de la date
    if (!day) {
      setDateError('La date est obligatoire');
      hasError = true;
    } else {
      setDateError('');
    }
   
    // Validation de l'heure de début
    if (!startTime) {
      setStartTimeError('L\'heure de début est obligatoire');
      hasError = true;
    } else {
      setStartTimeError('');
    }
   
    // Validation de l'heure de fin
    if (!endTime) {
      setEndTimeError('L\'heure de fin est obligatoire');
      hasError = true;
    } else {
      setEndTimeError('');
    }
   
    // Validation du lieu
    if (!identityPlace) {
      setIdentityPlaceError('Le lieu est obligatoire');
      hasError = true;
    } else {
      setIdentityPlaceError('');
    }
   
    // Validation de l'adresse
    if (!placeNumber || !street || !code || !city) {
      setPlaceError('L\'adresse complète est obligatoire');
      hasError = true;
    } else {
      setPlaceError('');
    }
   
    if (hasError) {
      console.log("Validation échouée, soumission annulée.");
      return; // early return
    } */

    /*   if (!placeNumber || !street || !code || !city) {
        console.log("Erreur sur l'adresse :", { placeNumber, street, code, city });
        setPlaceError('L\'adresse complète est obligatoire');
        hasError = true;
      } else {
        setPlaceError('');
      } */

    console.log("Planner (user._id) :", user._id);
    if (!user._id) {
      Alert.alert('Erreur', 'Utilisateur non authentifié.');
      return;
    };

    // Formatage des heures de début et de fin avant de créer l'objet eventData
    const start = startTime;
    const end = endTime;

    console.log("Variables pour eventData :");
    console.log("planner :", user?._id);
    console.log("title :", title);
    console.log("category :", category);
    console.log("date :", day);
    console.log("startTime :", startTime);
    console.log("endTime :", endTime);
    console.log("identityPlace :", identityPlace);
    console.log("placeNumber :", placeNumber);
    console.log("street :", street);
    console.log("city :", city);
    console.log("code :", code);
    console.log("description :", description);
    console.log("url :", url);

    console.log("Date validée (moment) :", moment(day).isValid());
    console.log("Heure de début validée (moment) :", moment(startTime).isValid());
    console.log("Heure de fin validée (moment) :", moment(endTime).isValid());


    // Création de l'objet conforme au backend
    const eventData = {
      planner: user._id,
      title,
      category,
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
    console.log("Envoi des données...");
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
          dispatch(addEventPlanner(data.event))

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
          setDescription('')
          setUrl('')
          setEventImage('')
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
            <Text style={globalStyles.title}>Proposer un évènement</Text>
            <TouchableOpacity onPress={goBack} activeOpacity={0.8}>
              <Icon style={globalStyles.returnContainer} name="chevron-circle-left" size={32} color='rgba(55, 27, 12, 0.3)' />
            </TouchableOpacity>
          </View>

          {/* formulaire pour créer un évènement */}
          <View style={styles.inputContainerSection}>
            <Text style={styles.label}>Titre de l'évènement *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Ex: Festival du livre, ..."
                onChangeText={(value) => setTitle(value)}
                value={title}
              />
            </View>
            {/* {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null} */}

            {/* Date Picker */}
            <View style={styles.datePickerContainer}>
              <Text style={styles.label}>Date *</Text>
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
            {/* {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null} */}

            {/* Start Time Picker */}
            <View style={styles.timePickerContainer}>
              <Text style={styles.label}>Heure de début *</Text>
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
            {/* {startTimeError ? <Text style={styles.errorText}>{startTimeError}</Text> : null} */}

            {/* End Time Picker */}
            <View style={styles.timePickerContainer}>
              <Text style={styles.label}>Heure de fin *</Text>
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
            {/* {endTimeError ? <Text style={styles.errorText}>{endTimeError}</Text> : null} */}
          </View>

          <Text style={styles.label}>Lieu *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Ex: Bibliothèque, Café, ..."
              value={identityPlace}
              onChangeText={setIdentityPlace}
            />
          </View>
          {/* {identityPlaceError ? <Text style={styles.errorText}>{identityPlaceError}</Text> : null} */}

          <View style={styles.placeContainer}>
            <Text style={styles.label}>Adresse *</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.inputSmall, styles.inputRow]}
                placeholder="N°"
                value={placeNumber}
                onChangeText={setPlaceNumber}
              />
              <TextInput
                style={[styles.inputLarge, styles.inputRow]}
                placeholder="Rue"
                value={street}
                onChangeText={setStreet}
              />
            </View>

            <View style={styles.row}>
              <TextInput
                style={[styles.inputSmall, styles.inputRow]}
                placeholder="Code postal"
                value={code}
                onChangeText={setCode}
              />
              <TextInput
                style={[styles.inputLarge, styles.inputRow]}
                placeholder="Ville"
                value={city}
                onChangeText={setCity}
              />
            </View>
          </View>
          {/* {placeError ? <Text style={styles.errorText}>{placeError}</Text> : null} */}

          {/* Catégorie : liste de choix */}
          <Text style={styles.label}>Catégorie *</Text>
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
          {/* {categoryError ? <Text style={styles.errorText}>{categoryError}</Text> : null} */}


          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.inputContainer}
            placeholder="Description (obligatoire)"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          {/* {descError ? <Text style={styles.errorText}>{descError}</Text> : null} */}

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
    paddingTop: 40,
    paddingLeft: 20,
    paddingRight: 20,
  },

  // CSS du container du formulaire
  inputContainerSection: {
    maxWidth: '100%',
    marginBottom: 20,
    paddingTop: 60,
  },

  // CSS de l'input title de l'évènement
  inputContainer: {
    backgroundColor: "rgba(238, 236, 232, 0.9)",
    paddingTop: 5,
    borderRadius: 5,
    borderBottomWidth: 0.7,
    borderBottomColor: "rgba(55, 27, 12, 0.50)",
    maxWidth: "100%",
    paddingLeft: 15,
    marginVertical: 15, // Augmenter l'espacement vertical
    marginHorizontal: 10, // Espacement horizontal
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
    marginVertical: 20,
  },

  pickerContainer: {
    marginVertical: 20,
  },

  dateText: {
    fontSize: 12,
    color: '#555',
  },

  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },

  placeContainer: {
    marginVertical: 20, // Pour la section lieu
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },

  inputRow: {
    paddingHorizontal: 10,
    height: 50,
    borderRadius: 5,
    backgroundColor: "rgba(238, 236, 232, 0.9)",
    borderBottomWidth: 0.7,
    borderBottomColor: "rgba(55, 27, 12, 0.50)",
  },

  inputSmall: {
    flex: 1, // Le champ occupe une part proportionnelle
    marginRight: 10, // Espacement entre les champs
  },

  inputLarge: {
    flex: 3, // Le champ occupe trois parts proportionnelles
  },


  // CSS du bouton publier avec spinner-button pour le temps de chargement
  buttonContainer: {
    justifyContent: 'center', // Centrer le contenu horizontalement
    alignItems: 'center',
    marginBottom: 60, // Ajoutez un peu d'espace vertical si nécessaire
    marginTop: 30,
    paddingBottom: 60,
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

  timePickerContainer: {
    marginVertical: 20,
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

  errorText: {
    textAlign: 'left',
    fontFamily: 'sans-serif',
    fontSize: 16,
    color: 'red',
    maxWidth: "85%",
    paddingLeft: 20,
  },
});