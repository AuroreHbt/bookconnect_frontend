import { useRef, useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View, Modal, TouchableWithoutFeedback, FlatList } from "react-native";
import MapView, { PROVIDER_DEFAULT, Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function MapScreen({ route }) {
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

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

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
    if (currentPosition && !cityProvided) {
      updateRegion({
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      });
    }
  }, [currentPosition, region, updateRegion, cityProvided]);

  const renderEventModalItem = ({ item }) => (
    <View style={styles.modalItem}>
      <Text style={styles.modalTitle}>
        {item.category || "Catégorie non renseignée"} -{" "}
        {item.title || "Titre non renseigné"}
      </Text>
      <Text style={styles.modalDescription}>
        {item.description || "Aucune description disponible"}
      </Text>
      <Text style={styles.modalDetails}>
        Lieu : {item.place?.street || "Rue non renseignée"}, {item.place?.city || "Ville non renseignée"}
      </Text>
      <Text style={styles.eventDate}>
        Date : {item.date?.day ? new Date(item.date.day).toLocaleDateString() : "Date non renseignée"}
      </Text>
      <Text style={styles.eventTime}>
        Heure : {item.date?.start && item.date?.end
          ? `${new Date(item.date.start).toLocaleTimeString()} - ${new Date(item.date.end).toLocaleTimeString()}`
          : "Heure non renseignée"}
      </Text>
    </View>
  );

  return (
    <>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
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
                pinColor="#FF4525"
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <FlatList
                data={[selectedEvent, ...eventsData.filter((e) => e !== selectedEvent)]}
                renderItem={renderEventModalItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.modalFlatList}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={true}
              />
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
    flex: 1, // Takes the full space to ensure the background is tappable
    backgroundColor: "transparent",
    justifyContent: "flex-end",
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
  },
  modalItem: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center", // Center all the text elements in the card
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center", // Center title
  },
  modalDescription: {
    fontSize: 14,
    textAlign: "center", // Center description
    marginBottom: 10,
  },
  modalDetails: {
    fontSize: 12,
    textAlign: "center", // Center details (place)
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
    textAlign: "center", // Center date
  },
  eventTime: {
    fontSize: 14,
    color: "#555",
    textAlign: "center", // Center time
  },
  separator: {
    height: 2,
    backgroundColor: "rgba(216, 72, 21, 1)",
    marginVertical: 6,
  },
});