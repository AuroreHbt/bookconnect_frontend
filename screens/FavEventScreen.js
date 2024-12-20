import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  SafeAreaView,
  Linking,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import { unlikeEvent } from "../reducers/event";

export default function FavEventScreen() {
  const dispatch = useDispatch();
  const likedEvents = useSelector((state) => state.event.likes || []);

  console.log("Événements likés:", likedEvents);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        vertical
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.eventsContainer}
      >
        {likedEvents.length > 0 ? (
          likedEvents.map((event, index) => (
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
              <Text style={styles.eventDescription}>
                {event.description || "Description non disponible"}
              </Text>
              <Text style={styles.eventAddress}>
                {event.formattedAddress || "Adresse non disponible"}
              </Text>
              {/* URL cliquable */}
              {event.url && (
                <Text
                  style={styles.eventUrl}
                  onPress={() => Linking.openURL(event.url)}
                >
                  {event.url}
                </Text>
              )}
              <TouchableOpacity
                onPress={() => dispatch(unlikeEvent({ id: event._id }))}
                style={styles.deleteButton}
              >
                <Icon name="heart" size={24} color="red" />
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

const styles = StyleSheet.create({
  container: {
    flex: 0.95,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  eventsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center", // Centrer les cartes
    paddingHorizontal: 10,
  },
  eventCard: {
    margin: 15,
    alignItems: "center",
    borderRadius: 10,
    width: 300, // Rendre les cartes plus larges
    backgroundColor: "white",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  event: {
    width: "100%",
    height: 180, // Ajusté pour plus de visibilité
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
    fontSize: 18,
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
  eventDescription: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
    marginVertical: 5,
  },
  eventAddress: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
    marginBottom: 10,
  },
  eventUrl: {
    fontSize: 12,
    color: "orange",
    textAlign: "center",
    textDecorationLine: "underline",
    marginVertical: 5,
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
