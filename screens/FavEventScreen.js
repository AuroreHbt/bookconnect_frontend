import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons"; // Exemple d'icône, à adapter si nécessaire
import { unlikeEvent } from "../reducers/event"; // Remplacez par votre chemin correct

export default function FavEventScreen() {
  const dispatch = useDispatch();
  
  // Récupération des événements likés depuis le store Redux
  const likedEvents = useSelector((state) => state.event.likes || []);
  
  // Vous pouvez utiliser likedEvents directement comme displayedEvents
  const displayedEvents = likedEvents;

  console.log('Événements likés:', likedEvents); // Affiche les événements likés
  console.log('Événements filtrés:', displayedEvents); // Affiche les événements affichés

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        vertical
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.eventsContainer}
      >
        {displayedEvents.length > 0 ? (
          displayedEvents.map((event, index) => (
            <View key={index} style={styles.eventCard}>
              <View
                style={[
                  styles.event,
                  {
                    backgroundColor: event.eventImage ? "transparent" : "#F9E4D4",
                  },
                ]}
              >
                {event.eventImage && (
                  <Image
                    source={{ uri: event.eventImage }}
                    style={styles.eventImage}
                    resizeMode="cover"
                  />
                )}
              </View>
              <Text style={styles.eventTitle}>
                {event.title || "Nom de l'événement"}
              </Text>
              <Text style={styles.eventDate}>
                {event.date?.day
                  ? new Date(event.date.day).toLocaleDateString()
                  : "Date non renseignée"}
              </Text>
              <Text style={styles.eventTime}>
                {event.date?.start && event.date?.end
                  ? `${new Date(event.date.start).toLocaleTimeString()} - ${new Date(event.date.end).toLocaleTimeString()}`
                  : "Heure non renseignée"}
              </Text>
              <TouchableOpacity
                onPress={() => dispatch(unlikeEvent({ id: event._id }))}
                style={styles.deleteButton}
              >
                <Icon name="heart-dislike" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.emptyMessage}>Aucun événement trouvé.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles épurés
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  eventsContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Ajout pour gérer les événements sur plusieurs lignes
    paddingHorizontal: 10,
  },
  eventCard: {
    margin: 10,
    alignItems: "center",
    borderRadius: 10,
    width: 250,
    backgroundColor: "white",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Pour Android
  },
  event: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  eventImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 5,
    lineHeight: 22,
  },
  eventDate: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
  eventTime: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    marginTop: 20,
  },
  deleteButton: {
    marginTop: 10,
    alignItems: "center",
  },
});
