import { useRef, useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaProvider,
  SafeAreaView,
} from "react-native";
import MapView, { PROVIDER_DEFAULT, Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function MapScreen({ route, navigation }) {

  const { latitude, longitude, events = {} } = route.params;

  const eventsData = events.data || [];

  const mapRef = useRef(null);

  const [region, setRegion] = useState({
    latitude: latitude || 48.8566, // Si aucune latitude n'est fournie, par défaut Paris
    longitude: longitude || 2.3522, // Si aucune longitude n'est fournie, par défaut Paris
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [currentPosition, setCurrentPosition] = useState(null);
  const [cityProvided, setCityProvided] = useState(!!latitude && !!longitude); // On vérifie si une ville a été fournie

  // Gestion de la localisation utilisateur
  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          const { latitude, longitude } = location.coords;
          console.log('location.coords: ', location.coords);
          setCurrentPosition({ latitude, longitude });
        });
      } else {
        console.log("Location permission not granted");
      }
    };
    requestLocationPermission();
  }, []);

  // Ajustement de la carte aux événements
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

  // Eviter les boucles infinies en contrôlant les mises à jour du region
  const updateRegion = useCallback(
    (newRegion) => {
      setRegion((prevRegion) => {
        // On compare la nouvelle région avec l'ancienne pour éviter une mise à jour inutile
        if (
          prevRegion.latitude !== newRegion.latitude ||
          prevRegion.longitude !== newRegion.longitude
        ) {
          return newRegion;
        }
        return prevRegion; // Ne pas mettre à jour si les valeurs sont identiques
      });
    },
    [] // Nous n'avons pas de dépendances ici, donc la fonction sera stable
  );

  // Si la position actuelle change, mettre à jour la région de la carte
  useEffect(() => {
    if (currentPosition && !cityProvided) {
      updateRegion({
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      });
    }
  }, [currentPosition, region, updateRegion, cityProvided]); // On évite de mettre à jour si une ville a été fournie

  return (
    <>
      {/* Bouton "Retour" */}
      <TouchableOpacity
        onPress={goBack}
        style={styles.returnContainer}
        activeOpacity={0.8}
      >
        <Text style={styles.textReturn}>Retour</Text>
      </TouchableOpacity>

      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        ref={mapRef}
      >
        {/* Marqueur de la position actuelle */}
        {currentPosition && !cityProvided && ( // Afficher la position uniquement si la ville n'est pas fournie
          <Marker
            coordinate={currentPosition}
            title="Ma position"
            pinColor="#fecb2d"
          />
        )}

        {/* Marqueurs des événements */}
        {eventsData.map((event, index) => {
          const { latitude, longitude, title, description } = event;
          if (latitude && longitude) {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(latitude), // Conversion en nombre pour IOS trop capriceux
                  longitude: parseFloat(longitude),
                }}
                title={event.title}
                description={event.description}
                pinColor="#FF4525"
              >
            </Marker>
            );
          }
          return null;
        })}
      </MapView>

      {/* Bouton "Retour" */}
      <TouchableOpacity
        onPress={goBack}
        style={styles.returnContainer}
        activeOpacity={0.8}
      >
        <Text style={styles.textReturn}>Retour</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 0.95,
  },
  
  textReturn: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "rgba(55, 27, 12, 0.7)",
  },
});
