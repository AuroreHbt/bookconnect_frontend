import React, { useEffect, useState } from "react";

// BottomTab visible sur les Screens => globalStyles
import { globalStyles } from '../styles/globalStyles';

import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking // créer un lien hypertexte
} from "react-native";

import { useSelector, useDispatch } from "react-redux";

import { deleteEvent } from "../reducers/event";

// import de la bibliothèque d'icône Fontawsome via react-native-vector-icons
import Icon from 'react-native-vector-icons/FontAwesome';

// import pour utiliser des dégradés linéaires (x,y)
import { LinearGradient } from 'expo-linear-gradient';


const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_ADDRESS;


export default function MyEventsScreen({ navigation }) {
    const goBack = () => navigation.goBack();
    
    const [eventPlanner, setEventPlanner] = useState([]); // État local pour les événements organisés
    const [eventUser, setEventUser] = useState([]); // État local pour les événements participés

    const user = useSelector((state) => state.user.value);
    const eventsFromStore = useSelector((state) => state.event.eventsPlanner); // Récupère les événements du store
    console.log('Événements crées dans le store Redux:', eventsFromStore);
    const addedEvents = useSelector((state) => state.event.events);
    console.log('Événements participés dans le store Redux:', addedEvents);
    const dispatch = useDispatch();

    
  
    // Fonction pour récupérer les événements
    const getMyEvents = () => {
      fetch(`${BACKEND_ADDRESS}/events/searcheventByUser/${user.username}`)
        .then((response) => response.json())
        .then((data) => setEvents(data.events));
    };
  
    useEffect(() => {
      getMyEvents(); // Récupérer les événements dès que le composant se monte
    }, [user.username]); // Récupérer les événements lors d'un changement de l'utilisateur
  
    useEffect(() => {
      setEventPlanner(eventsFromStore); // Mettre à jour l'état local avec les événements du store
    }, [eventsFromStore]); // Synchronisation avec le store Redux

    useEffect(() => {
      setEventUser(addedEvents); // Mettre à jour l'état local avec les événements du store
    }, [addedEvents]); // Synchronisation avec le store Redux

  
    const handleDeleteEvent = (eventId) => {
      fetch(`${BACKEND_ADDRESS}/events/deleteevent`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: user.token, // Le token de l'utilisateur
          id: eventId, // L'ID de l'événement à supprimer
        }),
      })
        .then((response) => {
          console.log("Réponse du serveur:", response); // Log pour voir ce qui est renvoyé
          if (response.ok) {
            return response.json(); // Parse la réponse uniquement si le statut HTTP est 2xx
          } else {
            throw new Error('Erreur serveur');
          }
        })
        .then((data) => {
          if (data.result) {
            dispatch(deleteEvent(eventId)); // Supprimer l'événement du store
            getMyEvents(); // Rafraîchir la liste des événements
          } else {
            console.error("Erreur lors de la suppression de l'événement:", data.error);
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression de l'événement:", error);
        });
    };
  
    return (
      <KeyboardAvoidingView style={globalStyles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View>
          <View style={globalStyles.titleContainer}>
            <Text style={globalStyles.title}>Mes évènements</Text>
            <TouchableOpacity onPress={goBack} activeOpacity={0.8}>
              <Icon style={globalStyles.returnContainer} name="chevron-circle-left" size={32} color='rgba(55, 27, 12, 0.3)' />
            </TouchableOpacity>
          </View>
  
          {/* Affichage des événements que j'organise */}
          <View>
            <Text style={styles.texttest}>Evènements que j'organise</Text>
          </View>
          <FlatList
  initialScrollIndex={0}
  keyExtractor={(item) => item._id || item.id || item.title} // Utilisez un champ unique pour la clé
  data={eventPlanner}
  renderItem={({ item }) => {
    console.log('Affichage de l\'événement:', item); // Debugging
    console.log('URL de l\'image :', item.eventImage); // Vérifie spécifiquement l'image
    return (
      <View style={styles.eventCard}>
        <View style={styles.cardContent}>

          {/* Informations sur l'événement */}
          <View style={styles.sectionTop}>
          <View style={styles.eventInfoTitle}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDescription}>{item.description}</Text>
            </View>
            {/* Affichage de l'image */}
            {item.eventImage ? (
        <Image
          source={{ uri: item.eventImage }}
          style={styles.eventImage}
        />
      ) : (
        <View style={styles.noImageContainer}>
        <Icon name="camera-retro" size={80} color="gray" />
        </View>
      )}
          </View>

          <View style={styles.sectionBottom}>
  <Text style={styles.eventDate}>
    <Text style={styles.label}>Date : </Text>
    {new Date(item.date.day).toLocaleDateString()}
  </Text>
  <Text style={styles.eventTime}>
    <Text style={styles.label}>Heure : </Text>
    {new Date(item.date.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{" "}
    {new Date(item.date.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
  </Text>
  <Text style={styles.eventAddress}>
    <Text style={styles.label}>Lieu : </Text>
    {item.identityPlace}
  </Text>
  <Text style={styles.eventAddress}>
    <Text style={styles.label}>Adresse : </Text>
    {item.place.number} {item.place.street}, {item.place.code} {item.place.city}
  </Text>
  <Text style={styles.eventUrl}>
  <Text style={styles.label}>Lien : </Text>
      {item.url ? (
        <Text style={styles.link} onPress={() => handleOpenUrl(item.url)}>
          {item.url}
        </Text>
      ) : (
        <Text style={styles.noLink}>Aucun lien disponible</Text>
      )}
  </Text>
</View>
          </View>


        <View style={styles.buttonCard}>
          <LinearGradient colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.7 }} style={styles.gradientButton}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.textButton}>Modifier</Text>
            </TouchableOpacity>
          </LinearGradient>
          <TouchableOpacity style={styles.iconContainer} onPress={() => handleDeleteEvent(item._id)}>
            <Icon name="trash-o" size={28} color="rgba(55, 27, 12, 0.7)" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }}
/>
          {/* Affichage des événements auxquels je participe*/}
          <View>
            <Text style={styles.texttest}>Evènements auxquels je participe</Text>
          </View>
          <FlatList
  initialScrollIndex={0}
  keyExtractor={(item) => item._id || item.id || item.title} // Utilisez un champ unique pour la clé
  data={eventUser}
  renderItem={({ item }) => {
    console.log('Affichage de l\'événement:', item); // Debugging
    console.log('URL de l\'image :', item.eventImage); // Vérifie spécifiquement l'image
    return (
      <View style={styles.eventCard}>
        <View style={styles.cardContent}>

          {/* Informations sur l'événement */}
          <View style={styles.sectionTop}>
          <View style={styles.eventInfoTitle}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDescription}>{item.description}</Text>
            </View>
            {/* Affichage de l'image */}
            {item.eventImage ? (
        <Image
          source={{ uri: item.eventImage }}
          style={styles.eventImage}
        />
      ) : (
        <View style={styles.noImageContainer}>
        <Icon name="camera-retro" size={80} color="gray" />
        </View>
      )}
          </View>

          <View style={styles.sectionBottom}>
  <Text style={styles.eventDate}>
    <Text style={styles.label}>Date : </Text>
    {new Date(item.date.day).toLocaleDateString()}
  </Text>
  <Text style={styles.eventTime}>
    <Text style={styles.label}>Heure : </Text>
    {new Date(item.date.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{" "}
    {new Date(item.date.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
  </Text>
  <Text style={styles.eventAddress}>
    <Text style={styles.label}>Lieu : </Text>
    {item.identityPlace}
  </Text>
  <Text style={styles.eventAddress}>
    <Text style={styles.label}>Adresse : </Text>
    {item.place.number} {item.place.street}, {item.place.code} {item.place.city}
  </Text>
  <Text style={styles.eventUrl}>
  <Text style={styles.label}>Lien : </Text>
      {item.url ? (
        <Text style={styles.link} onPress={() => handleOpenUrl(item.url)}>
          {item.url}
        </Text>
      ) : (
        <Text style={styles.noLink}>Aucun lien disponible</Text>
      )}
  </Text>
</View>
          </View>


        <View style={styles.buttonCard}>
          <LinearGradient colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.7 }} style={styles.gradientButton}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.textButton}>Modifier</Text>
            </TouchableOpacity>
          </LinearGradient>
          <TouchableOpacity style={styles.iconContainer} onPress={() => handleDeleteEvent(item._id)}>
            <Icon name="trash-o" size={28} color="rgba(55, 27, 12, 0.7)" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }}
/>
          

        </View>
      </KeyboardAvoidingView>
    );
  }
  


// attention : le StyleSheet doit bien être en dehors de la fonction!
const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
      },

    // CSS global des cards Events
    eventCard: {
      backgroundColor: 'rgba(238, 236, 232, 1)',
      marginVertical: 40,
      padding: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
      height: 450,
      flexDirection: 'column', // Organisation verticale
    },
    cardContent: {
      flex: 1,
    },
    sectionTop: {
      flexDirection: 'row', // Aligne horizontalement
      justifyContent: 'space-between', // Titre à gauche, image à droite
      alignItems: 'center', // Aligne verticalement au centre
      marginBottom: 10, // Espacement avec la section suivante
    },
    eventInfoTitle: {
      flex: 1, // Occupe tout l'espace disponible à gauche
      justifyContent: 'flex-start', // Aligne le texte en haut
      marginRight: 10, // Espace entre le texte et l'image
    },
    eventTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'left', // Justifié à gauche
      marginLeft: 5,
      marginBottom: 5,
      marginTop: 5,
    },
    eventDescription: {
      fontSize: 16,
      textAlign: 'left', // Justifié à gauche
      marginBottom: 10,
      marginLeft: 5,
    },
    sectionBottom: {
      justifyContent: 'center', // Centré verticalement
      margin: 5,
      textAlign: 'left',
    },
    label: {
      fontWeight: 'bold', // Texte en gras pour les indicateurs
    },
    eventDate: {
      fontSize: 14,
      marginBottom: 10,
    },
    eventTime: {
      fontSize: 14,
      marginBottom: 10,
    },
    eventAddress: {
      fontSize: 14,
      marginBottom: 10,
    },
    eventUrl: {
      fontSize: 14,
      marginBottom: 10,
    },
    eventPlanner: {
      fontSize: 14,
      fontStyle: 'italic',
    },
    eventImage: {
      width: 140,
      height: 200,
      borderRadius: 10,
      resizeMode: 'cover', // Ajustement de l'image
      marginLeft: 5, // Espace entre l'image et le texte
      marginTop: 5,
      marginRight: 5,
    },
    noImageContainer: {
      width: 140,
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      marginLeft: 5,
      marginTop: 5,
      marginRight: 5,
    },
    buttonCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    gradientButton: {
      flex: 1,
      borderRadius: 5,
      marginRight: 10,
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 40,
    },
    textButton: {
      color: '#fff',
      fontWeight: 'bold',
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 40,
    },
    link: {
      color: 'blue',
      textDecorationLine: 'underline',
      fontSize: 16,
    },
    noLink: {
      fontSize: 16,
      color: 'gray',
    },
    texttest: {
      fontFamily: "Poppins-Medium", // ou GermaniaOne-Regular
      fontWeight: "500",
      fontSize: 18,
      marginBottom: 50,
      color: "#371B0C",
      textAlign: "center",
    },
  
  });
  