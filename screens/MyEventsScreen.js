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
  ScrollView,
  Image,
  SafeAreaView,
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
      setEventPlanner(eventsFromStore); // Mettre à jour l'état local avec les événements organisés du store
    }, [eventsFromStore]); // Synchronisation avec le store Redux

    useEffect(() => {
      setEventUser(addedEvents); // Mettre à jour l'état local avec les événements particpés du store
    }, [addedEvents]); // Synchronisation avec le store Redux

    const EventComponent = ({ item }) => {
      const handleOpenUrl = (url) => {
        if (url) {
          Linking.openURL(url).catch((err) => console.error('Erreur lors de l\'ouverture du lien :', err));
        }
      };
    };

  
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
        <ScrollView>
        <View>
          <View style={globalStyles.titleContainer}>
            <Text style={globalStyles.title}>Mes évènements</Text>
            <TouchableOpacity onPress={goBack} activeOpacity={0.8}>
              <Icon style={globalStyles.returnContainer} name="chevron-circle-left" size={32} color='rgba(55, 27, 12, 0.3)' />
            </TouchableOpacity>
          </View>
  
  
          {/* Affichage des événements que j'organise */}
<View style={{ flex: 1 }}>
  <Text style={styles.texttest}>Evènements que j'organise</Text>
  <ScrollView style={styles.horizontalScrollView} horizontal={true} showsHorizontalScrollIndicator={false}>
    {eventPlanner.map((item) => (
      <View key={item._id || item.id || item.title} style={styles.eventCard}>
        <View style={styles.cardContent}>
          {/* Informations sur l'événement */}
          <View style={styles.sectionTop}>
            {/* Affichage de l'image */}
            {item.eventImage ? (
              <Image source={{ uri: item.eventImage }} style={styles.eventImage} />
            ) : (
              <View style={styles.noImageContainer}>
                <Icon name="camera-retro" size={80} color="gray" />
              </View>
            )}
            <View style={styles.eventInfoTitle}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDescription}>{item.description}</Text>
            </View>
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
    ))}
  </ScrollView>
</View>

{/* Affichage des événements auxquels je participe */}
<View style={{ flex: 1 }}>
  <Text style={styles.texttest}>Evènements auxquels je participe</Text>
  <ScrollView style={styles.horizontalScrollView} horizontal={true} showsHorizontalScrollIndicator={false}>
    {eventUser.map((item) => (
      <View key={item._id || item.id || item.title} style={styles.eventCard}>
        <View style={styles.cardContent}>
          {/* Informations sur l'événement */}
          <View style={styles.sectionTop}>
            {/* Affichage de l'image */}
            {item.eventImage ? (
              <Image source={{ uri: item.eventImage }} style={styles.eventImage} />
            ) : (
              <View style={styles.noImageContainer}>
                <Icon name="camera-retro" size={80} color="gray" />
              </View>
            )}
            <View style={styles.eventInfoTitle}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDescription}>{item.description}</Text>
            </View>
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
              <Text style={styles.textButton}>Ne plus particper</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    ))}
  </ScrollView>
</View>

        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
  


// attention : le StyleSheet doit bien être en dehors de la fonction!
const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
      },

      // Conteneur spécifique pour chaque ScrollView horizontale
    horizontalScrollView: {
      marginBottom: 20, // Espacement entre les sections
      height: 500, // Ajustez la hauteur pour inclure toutes les cartes
  },

    // CSS global des cards Events
    eventCard: {
      backgroundColor: 'rgba(238, 236, 232, 1)',
      marginHorizontal: 10,
      marginVertical: 10, // Ajout de marges verticales
      padding: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
      width: 350, // Ajuster la largeur pour les cartes dans la ScrollView horizontale
      height: 470,
      flexDirection: 'column',
    },
    cardContent: {
      flex: 1,
    },
    sectionTop: {
      flexDirection: 'column', // Aligne horizontalement
      justifyContent: 'space-between', // Titre à gauche, image à droite
      alignItems: 'center', // Aligne verticalement au centre
      marginBottom: 15, // Espacement avec la section suivante
    },
    eventInfoTitle: {
      marginTop: 10, // Espacement entre l'image et le texte
      alignItems: 'center', // Centre les textes sous l'image
      paddingHorizontal: 10,
    },
    eventTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center', // Justifié à gauche
      marginBottom: 5,
    },
    eventDescription: {
      fontSize: 12,
      textAlign: 'center', // Justifié à gauche
    },
    sectionBottom: {
      justifyContent: 'center', // Centré verticalement
      margin: 5,
      alignItems: 'center',
    },
    label: {
      fontWeight: 'bold', // Texte en gras pour les indicateurs
    },
    eventDate: {
      fontSize: 12,
      marginBottom: 10,
    },
    eventTime: {
      fontSize: 12,
      marginBottom: 10,
    },
    eventAddress: {
      fontSize: 12,
      marginBottom: 10,
    },
    eventUrl: {
      fontSize: 12,
      marginBottom: 10,
    },
    eventImage: {
      width: 300,
      height: 150,
      borderRadius: 10,
      resizeMode: 'cover', // Ajustement de l'image
      marginTop: 5,
    },
    noImageContainer: {
      width: 300,
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      marginTop: 5,
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
      fontSize: 20,
      marginBottom: 20,
      color: "#371B0C",
      textAlign: "left",
      padding: 10,
    },
  
  });
  