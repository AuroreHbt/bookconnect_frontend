import { useRef, useEffect, useState, useCallback } from "react";
import { useDispatch } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
} from "react-native";
import MapView, { PROVIDER_DEFAULT, Marker } from "react-native-maps";
import * as Location from "expo-location";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";
import { likeEvent, unlikeEvent, addEvent } from "../reducers/event";

export default function MapScreen({ route }) {
  const dispatch = useDispatch();
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
  const [favorites, setFavorites] = useState([]); // Tableau des indices des événements favoris

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleEventModal = () => {
    setEventModalVisible(!eventModalVisible);
  };

  const handleParticipate = (event) => {
    console.log('Tentative d\'ajouter l\'événement :', event);
    dispatch(addEvent(event)); // Envoie l'événement au reducer
    alert('Votre événement a été ajouté au dashboard');
  };
  

  // Fonction de gestion des favoris
  const toggleFavorite = (eventIndex) => {
    const event = eventsData[eventIndex];
  
    // Si l'événement est déjà dans les favoris
    if (favorites.includes(eventIndex)) {
      // Retirer de la liste des favoris
      dispatch(unlikeEvent(event)); // Dispatch de l'action `unlikeEvent`
    } else {
      // Ajouter aux favoris
      dispatch(likeEvent(event)); // Dispatch de l'action `likeEvent`
    }
  
    // Mettre à jour localement l'état des favoris (facultatif si vous voulez garder cette gestion visuelle)
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(eventIndex)) {
        return prevFavorites.filter((index) => index !== eventIndex);
      } else {
        return [...prevFavorites, eventIndex];
      }
    });
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

  const renderEventModalItem = ({ item, index }) => (
    <View style={styles.modalItem}>
      <View style={styles.itemHeader}>
        <Text style={styles.modalTitle}>
          {item.category || "Catégorie non renseignée"} -{" "}
          {item.title || "Titre non renseigné"}
        </Text>
        <TouchableOpacity
          onPress={() => toggleFavorite(index)} // Appelle la fonction pour ajouter/retirer des favoris en utilisant l'index
          style={styles.favoriteButton}
        >
          <FontAwesome
            name={favorites.includes(index) ? "heart" : "heart-o"} // "heart" si favori, "heart-o" sinon
            size={24}
            color={favorites.includes(index) ? "red" : "gray"} // Rouge si favori, gris sinon
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
      <Text style={styles.eventTime}>
        Heure :{" "}
        {item.date?.start && item.date?.end
          ? `${new Date(item.date.start).toLocaleTimeString()} - ${new Date(
              item.date.end
            ).toLocaleTimeString()}`
          : "Heure non renseignée"}
      </Text>

      {/* Bouton "Participer" */}
       <TouchableOpacity
         onPress={() => {
          console.log('Bouton Participer cliqué !');
          handleParticipate(selectedEvent); // Ajoute l'événement au reducer
          alert("Votre événement a été ajouté au dashboard !"); // Affiche le message de confirmation
        }}
      style={styles.participateButton}
    >
        <Text style={styles.participateButtonText}>Participer</Text>
      </TouchableOpacity>
    </View>
  );

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
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(latitude),
                  longitude: parseFloat(longitude),
                }}
                title={event.title}
                pinColor={favorites.includes(index) ? "red" : "#FF4525"} // Si l'événement est favori, le marqueur devient rouge
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

      {/* Bouton pour afficher la modale Liste des événements */}
      <TouchableOpacity
        style={styles.eventListButton}
        onPress={toggleEventModal}
      >
        <Text style={styles.eventListButtonText}>
          Voir les événements ({eventsData.length})
        </Text>
        <View style={styles.eventListButtonBar} />
      </TouchableOpacity>

      {/* Modal Liste des événements */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={eventModalVisible}
        onRequestClose={toggleEventModal}
      >
        <TouchableWithoutFeedback onPress={toggleEventModal}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <FlatList
                data={eventsData}
                renderItem={renderEventModalItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.modalFlatList}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false} // Supprime la barre de défilement
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal Détails de l'événement */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackgroundEvent}>
            <View>
              {selectedEvent && (
                <View style={styles.modalItem}>
                  {/* Conteneur pour le titre et le bouton cœur */}
                  <View style={styles.titleContainer}>
                    <Text style={styles.modalTitle}>
                      {selectedEvent.category || "Catégorie non renseignée"} -{" "}
                      {selectedEvent.title || "Titre non renseigné"}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        toggleFavorite(eventsData.indexOf(selectedEvent))
                      }
                      style={styles.favoriteButton}
                    >
                      <FontAwesome
                        name={
                          favorites.includes(eventsData.indexOf(selectedEvent))
                            ? "heart"
                            : "heart-o"
                        }
                        size={24}
                        color={
                          favorites.includes(eventsData.indexOf(selectedEvent))
                            ? "red"
                            : "gray"
                        }
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.modalDescription}>
                    {selectedEvent.description ||
                      "Aucune description disponible"}
                  </Text>
                  <Text style={styles.modalDetails}>
                    Lieu : {selectedEvent.place?.street || "Rue non renseignée"}
                    , {selectedEvent.place?.city || "Ville non renseignée"}
                  </Text>
                  <Text style={styles.eventDate}>
                    Date :{" "}
                    {selectedEvent.date?.day
                      ? new Date(selectedEvent.date.day).toLocaleDateString()
                      : "Date non renseignée"}
                  </Text>
                  <Text style={styles.eventTime}>
                    Heure :{" "}
                    {selectedEvent.date?.start && selectedEvent.date?.end
                      ? `${new Date(
                          selectedEvent.date.start
                        ).toLocaleTimeString()} - ${new Date(
                          selectedEvent.date.end
                        ).toLocaleTimeString()}`
                      : "Heure non renseignée"}
                  </Text>
                  <TouchableOpacity
                    style={styles.participateButton}
                    onPress={() => {
                      console.log('Bouton Participer cliqué !');
                      handleParticipate(selectedEvent); // Ajoute l'événement au reducer
                      alert("Votre événement a été ajouté au dashboard !"); // Affiche le message de confirmation
                    }}
                  >
                    <Text style={styles.participateButtonText}>Participer</Text>
                  </TouchableOpacity>
                </View>
              )}
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
    justifyContent: "center", // Centrer la modale verticalement
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    width: "95%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    height: "50%",
    overflow: "hidden",
  },
  modalFlatList: {
    width: "100%",
    height: "100%",
    padding: 10, // Ajout de padding pour améliorer l'apparence
  },
  modalItem: {
    padding: 15,
    backgroundColor: "#f9f9f9", // Fond gris clair pour les éléments de la liste
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  itemHeader: {
    flexDirection: "row", // Alignement horizontal pour le titre et le bouton cœur
    alignItems: "center", // Aligner verticalement le titre et le bouton cœur
    justifyContent: "space-between", // Espacement entre le titre et le bouton cœur
    marginBottom: 10, // Espace sous le titre
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left", // Aligné à gauche
    flexWrap: "wrap", // Permet au texte de passer à la ligne
    maxWidth: "85%", // Limite la largeur pour laisser de l'espace à l'icône
    lineHeight: 22, // Espacement entre les lignes
  },
  favoriteButton: {
    padding: 5, // Un peu d'espace autour de l'icône
  },
  modalDescription: {
    fontSize: 14,
    textAlign: "left", // Alignement à gauche pour mieux correspondre au titre
    marginBottom: 10,
  },
  modalDetails: {
    fontSize: 12,
    textAlign: "left", // Alignement à gauche
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
    textAlign: "left", // Aligné à gauche
  },
  eventTime: {
    fontSize: 14,
    color: "#555",
    textAlign: "left", // Aligné à gauche
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
    transform: [{ translateX: -120 }],
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
  eventListButtonBar: {
    width: "40%",
    height: 3,
    backgroundColor: "#fff",
    marginTop: 2,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  participateButton: {
    backgroundColor: "rgba(216, 72, 21, 1)", // Couleur de fond
    paddingVertical: 6, // Réduit la hauteur du bouton
    paddingHorizontal: 12, // Réduit la largeur du bouton
    borderRadius: 20, // Bordure arrondie
    marginTop: 15, // Espacement au-dessus
    alignSelf: "center", // Centre le bouton horizontalement
    alignItems: "center",
    justifyContent: "center",
  },
  participateButtonText: {
    color: "#fff",
    fontSize: 16, // Taille du texte réduite
    fontWeight: "bold",
  },
  participateButtEvent: {
    position: "absolute", // Positionnement absolu
    bottom: 20, // Espacement du bas de la modale
    left: "50%", // Centrer horizontalement
    transform: [{ translateX: -100 }], // Ajuste la position pour centrer précisément
    backgroundColor: "rgba(216, 72, 21, 1)", // Couleur de fond
    paddingVertical: 8, // Ajuste la hauteur du bouton
    paddingHorizontal: 20, // Ajuste la largeur du bouton
    borderRadius: 20, // Bordure arrondie
    alignItems: "center", // Aligne le texte au centre
    justifyContent: "center", // Assure que le texte est centré dans le bouton
  },
});
