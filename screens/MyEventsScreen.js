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
    
    const [events, setEvents] = useState([]); // État local pour les événements
    const user = useSelector((state) => state.user.value);
    const eventsFromStore = useSelector((state) => state.event.value); // Récupère les événements du store
    console.log('Événements dans le store Redux:', eventsFromStore);
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
      setEvents(eventsFromStore); // Mettre à jour l'état local avec les événements du store
    }, [eventsFromStore]); // Synchronisation avec le store Redux
  
    const handleDeleteEvent = (eventId) => {
      fetch(`${BACKEND_ADDRESS}/events/deleteevent`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: user.token, id: eventId }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            dispatch(deleteEvent(eventId)); // Supprime l'événement du store
            getMyEvents(); // Rafraîchir la liste des événements
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
  
          {/* Affichage des événements */}
          <FlatList
            initialScrollIndex={0}
            keyExtractor={(item) => item._id || item.id || item.title} // Utilisez un champ unique pour la clé
            data={events} // Utilise l'état `events` pour afficher les événements
            renderItem={({ item }) => {
                console.log('Affichage de l\'événement:', item); // Debugging
      return (
              <View style={styles.eventCard}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventDescription}>{item.description}</Text>
                <Text style={styles.eventDate}>Date : {new Date(item.date.day).toLocaleDateString()}</Text>
                <Text style={styles.eventTime}>Heure : {new Date(item.date.start).toLocaleTimeString()} - {new Date(item.date.end).toLocaleTimeString()}</Text>
                <Text style={styles.eventAddress}>Lieu: {item.identityPlace}</Text>
                <Text style={styles.eventAddress}>Adresse : {item.place.number} {item.place.street}, {item.place.code} {item.place.city}</Text>
                <Text style={styles.eventPlanner}>Planifié par : {item.planner.username}</Text>
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
    flex: 0.95,
    padding: 20,
  },

    // CSS global des cards Events
    eventCard: {
      backgroundColor: 'rgba(238, 236, 232, 1)', // "#EEECE8",
      padding: 10,
      marginBottom: 15,
      borderRadius: 8,
      width: '100%',
      // marginLeft: 10,
  
      borderWidth: 1,
      borderColor: 'rgba(55, 27, 12, 0.1)',
    },
  
    eventTitle: {
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
      fontSize: 18,
      padding: 5,
      margin: 5,
      flexWrap: 'wrap',
    },
  
    // CSS infos story + cover
    contentCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: 10,
  
      // borderWidth: 1,
      // borderColor: 'red',
    },
  
    eventCategory: {
      fontSize: 18,
      marginBottom: 10,
    },
  
    eventPublic: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
    },
  
    eventDescription: {
      fontSize: 16,
      marginBottom: 10,
    },
  
    // CSS des couvertures
    imageContainer: {
      width: '40%',
      padding: 5,
      // borderWidth: 1,
      // borderColor: 'blue',
    },
  
    // CSS du bouton Modifier + poubelle pour suppr
    buttonCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 10,
  
      // borderWidth: 1,
      // borderColor: 'rgba(238, 236, 232, 1)',
    },
  
    gradientButton: {
      borderRadius: 10,
    },
  
    button: {
      padding: 4,
      margin: 4,
    },
  
    textButton: {
      textAlign: 'center',
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      fontSize: 16,
      color: 'white', // 'rgba(55, 27, 12, 0.8)', // #371B0C
    },
  
    iconContainer: {
      top: 5,
      left: 15,
      marginRight: 30,
    },
    eventDate: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
      },
      
      eventTime: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
      },
      
      eventAddress: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
      },
      
      eventPlanner: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#888',
        marginBottom: 5,
      },
      
  
  });
  