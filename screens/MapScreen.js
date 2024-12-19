import { useRef, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
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
    alert('Votre événement a été ajouté au dashboard');
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
          <Image 
            source={{ uri: item.eventImage }} 
            style={styles.eventImage} 
          />
        )}
        <View style={styles.itemHeader}>
          <Text style={styles.modalTitle}>
            {item.category || "Catégorie non renseignée"} - {item.title || "Titre non renseigné"}
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
        <Text style={styles.modalDescription}>{item.description || "Aucune description disponible"}</Text>
        <Text style={styles.modalDetails}>Lieu : {item.place?.street || "Rue non renseignée"} {item.place?.city || "Ville non renseignée"}</Text>
        <Text style={styles.eventDate}>
          Date : {item.date?.day ? new Date(item.date.day).toLocaleDateString() : "Date non renseignée"}
        </Text>
        <TouchableOpacity
          onPress={() => handleParticipate(item)}
          style={styles.participateButton}
        >
          <Text style={styles.participateButtonText}>Participer</Text>
        </TouchableOpacity>
        {item.url && (
          <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
            <Text style={styles.urlLink}>{item.url}</Text>
          </TouchableOpacity>
        )}
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
            const isLiked = likes.some((likedEvent) => likedEvent._id === event._id);
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(latitude),
                  longitude: parseFloat(longitude),
                }}
                title={event.title}
                pinColor={isLiked ? "red" : "#FF4525"}
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

      <TouchableOpacity
        style={styles.eventListButton}
        onPress={toggleEventModal}
      >
        <Text style={styles.eventListButtonText}>
          Voir les événements ({eventsData.length})
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={eventModalVisible}
        onRequestClose={toggleEventModal}
      >
        {/* Utiliser TouchableWithoutFeedback uniquement à l'extérieur */}
        <TouchableWithoutFeedback onPress={toggleEventModal}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <FlatList
                data={eventsData}
                renderItem={renderEventModalItem}
                keyExtractor={(item) => item._id}
                style={styles.modalFlatList}
                // Ne pas fermer la modal lors du scroll
                onTouchStart={() => {}}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        {/* Utiliser TouchableWithoutFeedback uniquement à l'extérieur */}
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackgroundEvent}>
            <View>
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
    height: "50%",  // Taille réduite de la modal pour la liste des événements
    overflow: "hidden",
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
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
    backgroundColor: "rgba(216, 72, 21, 1)",
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
