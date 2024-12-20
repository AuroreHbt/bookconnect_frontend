import { useRef, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import MapView, { PROVIDER_DEFAULT, Marker } from "react-native-maps";
import * as Location from "expo-location";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";
import { likeEvent, unlikeEvent, addEvent } from "../reducers/event";
import { LinearGradient } from "expo-linear-gradient";

// Fonction pour définir les couleurs des catégories
const getCategoryColor = (category) => {
  switch (category) {
    case "Festival":
      return "rgb(216, 170, 21)"; // Bleu pour les festivals
    case "Salons":
      return "green"; // Vert pour les salons
    case "Ateliers":
      return "rgb(21, 83, 216)"; // Violet pour les ateliers
    case "Rencontres":
      return "rgb(214, 80, 31)"; // Orange pour les rencontres
    case "Concours":
      return "red"; // Rouge pour les concours
    case "Conférences":
      return "rgb(216, 21, 21)"; // Cyan pour les conférences
    case "Lectures publiques":
      return "pink"; // Rose pour les lectures publiques
    case "Expositions":
      return "rgb(129, 66, 6)"; // Jaune pour les expositions
    case "Autre":
      return "rgb(21, 161, 216)"; // Gris pour "Autre"
    default:
      return "rgb(113, 37, 136)"; // Couleur par défaut
  }
};

export default function MapScreen({ route }) {
  const dispatch = useDispatch();
  const likes = useSelector((state) => state.event.likes); // Accès à l'état Redux des likes
  const { latitude, longitude, events = {} } = route.params;
  const eventsData = events.data || [];

  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: latitude || 48.8566,
    longitude: longitude || 2.3522,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [currentPosition, setCurrentPosition] = useState(null);
  const [cityProvided, setCityProvided] = useState(!!latitude && !!longitude);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleEventModal = () => {
    setEventModalVisible(!eventModalVisible);
  };

  const handleParticipate = (event) => {
    dispatch(addEvent(event));
    alert("Votre événement a été ajouté au dashboard");
  };

  const toggleFavorite = (event) => {
    const isLiked = likes.some((likedEvent) => likedEvent._id === event._id);
    if (isLiked) {
      dispatch(unlikeEvent({ id: event._id }));
    } else {
      dispatch(likeEvent(event));
    }
  };

  const updateRegion = useCallback((newRegion) => {
    setRegion((prevRegion) => {
      if (
        prevRegion.latitude !== newRegion.latitude ||
        prevRegion.longitude !== newRegion.longitude
      ) {
        return newRegion;
      }
      return prevRegion;
    });
  }, []);

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          const { latitude, longitude } = location.coords;
          setCurrentPosition({ latitude, longitude });
        });
      } else {
        console.log("Location permission not granted");
      }
    };
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (mapRef.current && eventsData.length > 0) {
      const validCoordinates = eventsData
        .map((event) => ({
          latitude: event.location?.coordinates[1],
          longitude: event.location?.coordinates[0],
        }))
        .filter((coord) => coord.latitude && coord.longitude);

      if (validCoordinates.length > 0) {
        mapRef.current.fitToCoordinates(validCoordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    }
  }, [eventsData]);

  useEffect(() => {
    if (currentPosition && !cityProvided) {
      updateRegion({
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      });
    }
  }, [currentPosition, region, cityProvided]);

  const renderEventModalItem = ({ item }) => {
    const isLiked = likes.some((likedEvent) => likedEvent._id === item._id);
    return (
      <View style={styles.modalItem}>
        {item.eventImage && (
          <Image source={{ uri: item.eventImage }} style={styles.eventImage} />
        )}
        <View style={styles.itemHeader}>
          <Text style={styles.modalTitle}>
            {item.category || "Catégorie non renseignée"} -{" "}
            {item.title || "Titre non renseigné"}
          </Text>
          <TouchableOpacity
            onPress={() => toggleFavorite(item)}
            style={styles.favoriteButton}
          >
            <FontAwesome
              name={isLiked ? "heart" : "heart-o"}
              size={24}
              color={isLiked ? "red" : "gray"}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.modalDescription}>
          {item.description || "Aucune description disponible"}
        </Text>
        <Text style={styles.modalDetails}>
          Lieu : {item.place?.street || "Rue non renseignée"}{" "}
          {item.place?.city || "Ville non renseignée"}
        </Text>
        <Text style={styles.eventDate}>
          Date :{" "}
          {item.date?.day
            ? new Date(item.date.day).toLocaleDateString()
            : "Date non renseignée"}
        </Text>
        {item.url && (
          <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
            <Text style={styles.urlLink}>{item.url}</Text>
          </TouchableOpacity>
        )}
        <LinearGradient
          colors={["rgba(255, 123, 0, 0.9)", "rgba(216, 72, 21, 1)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.7 }}
          style={styles.participateButton}
        >
          <TouchableOpacity onPress={() => handleParticipate(item)}>
            <Text style={styles.participateButtonText}>Participer</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  };

  return (
    <>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        region={region}
        ref={mapRef}
      >
        {currentPosition && !cityProvided && (
          <Marker
            coordinate={currentPosition}
            title="Ma position"
            pinColor="#fecb2d"
          />
        )}

        {eventsData.map((event, index) => {
          const { coordinates } = event.location;
          const latitude = coordinates[1];
          const longitude = coordinates[0];

          if (latitude && longitude) {
            const isLiked = likes.some(
              (likedEvent) => likedEvent._id === event._id
            );
            const pinColor = getCategoryColor(event.category); // Définir la couleur du marqueur en fonction de la catégorie
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(latitude),
                  longitude: parseFloat(longitude),
                }}
                title={event.title}
                pinColor={isLiked ? "red" : pinColor} // Utilisation de la couleur en fonction de la catégorie
                onPress={() => {
                  setSelectedEvent(event);
                  setModalVisible(true);
                }}
              />
            );
          }
          return null;
        })}
      </MapView>
      <LinearGradient
        colors={["rgba(255, 123, 0, 0.9)", "rgba(216, 72, 21, 1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.7 }}
        style={styles.eventListButton}
      >
        <TouchableOpacity onPress={toggleEventModal}>
          <Text style={styles.eventListButtonText}>
            Voir les événements ({eventsData.length})
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <Modal
        animationType="slide"
        transparent={true}
        visible={eventModalVisible}
        onRequestClose={toggleEventModal}
      >
        <TouchableWithoutFeedback onPress={toggleEventModal}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <FlatList
                  data={eventsData}
                  renderItem={renderEventModalItem}
                  keyExtractor={(item) => item._id}
                  style={styles.modalFlatList}
                  scrollEnabled={true} // Active le scroll
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackgroundEvent}>
            <View style={styles.modalEventContainer}>
              {selectedEvent && renderEventModalItem({ item: selectedEvent })}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 0.95,
    marginTop: 35,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalBackgroundEvent: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    backgroundColor: "white",
    width: "95%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    height: "50%", // Taille réduite de la modal pour la liste des événements
    overflow: "hidden",
  },

  modalEventContainer: {
    backgroundColor: "white",
    width: "70%", // Ajustez la largeur
    borderRadius: 10,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  modalFlatList: {
    width: "100%",
    height: "100%", // Modal avec FlatList occupe toute la hauteur
    padding: 10,
  },
  modalItem: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    margin: 15,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
  eventImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 5,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    flexWrap: "wrap",
    maxWidth: "85%",
    lineHeight: 22,
  },
  favoriteButton: {
    padding: 5,
  },
  modalDescription: {
    fontSize: 14,
    textAlign: "left",
    marginBottom: 10,
  },
  modalDetails: {
    fontSize: 12,
    textAlign: "left",
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
    textAlign: "left",
  },
  separator: {
    height: 2,
    backgroundColor: "rgba(216, 72, 21, 1)",
    marginVertical: 6,
  },
  eventListButton: {
    position: "absolute",
    bottom: 80,
    left: "50%",
    transform: [{ translateX: -100 }],
    backgroundColor: "#FF4525",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  eventListButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  participateButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 15,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  participateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  urlLink: {
    color: "#FF4525",
    fontSize: 14,
    marginTop: 10,
  },
});
