import { useRef, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen({ route, navigation }) {
  const { latitude, longitude, events = {} } = route.params || {};
  const eventsData = Array.isArray(events.data) ? events.data : [];
  const mapRef = useRef(null);

  // État de la région initiale
  const [region, setRegion] = useState({
    latitude: latitude || 48.8566,
    longitude: longitude || 2.3522,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // État pour la position utilisateur
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isLocationLoaded, setIsLocationLoaded] = useState(false); // Pour éviter le re-rendu infini

  // Obtenir la permission et la localisation utilisateur
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation,
          });
          setCurrentPosition({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          setIsLocationLoaded(true);
        } else {
          Alert.alert('Permission refusée', 'Impossible d’accéder à votre position.');
          setIsLocationLoaded(true); // Éviter la boucle infinie même en cas d'échec
        }
      } catch (error) {
        console.error('Erreur de localisation :', error);
        setIsLocationLoaded(true);
      }
    };

    if (!isLocationLoaded) getLocation();
  }, [isLocationLoaded]);

  // Ajustement automatique de la carte pour les événements
  useEffect(() => {
    if (mapRef.current && eventsData.length > 0) {
      const validCoordinates = eventsData
        .filter(
          (event) =>
            event.latitude !== null &&
            event.longitude !== null &&
            !isNaN(event.latitude) &&
            !isNaN(event.longitude)
        )
        .map((event) => ({
          latitude: Number(event.latitude),
          longitude: Number(event.longitude),
        }));

      if (validCoordinates.length > 0) {
        mapRef.current.fitToCoordinates(validCoordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    }
  }, [eventsData]);

  // Retour à l'écran précédent
  const goBack = () => navigation.goBack();

  return (
    <>
      <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : null}
        style={styles.map}
        initialRegion={region}
        ref={mapRef}
        onRegionChangeComplete={setRegion}
      >
        {/* Marqueur de la position actuelle */}
        {currentPosition && (
          <Marker
            coordinate={currentPosition}
            title="Ma position"
            pinColor="#fecb2d"
          />
        )}

        {/* Marqueurs pour les événements */}
        {eventsData.map((event, index) => {
          const validLatitude = Number(event.latitude);
          const validLongitude = Number(event.longitude);

          if (
            !isNaN(validLatitude) &&
            !isNaN(validLongitude) &&
            event.latitude &&
            event.longitude
          ) {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: validLatitude,
                  longitude: validLongitude,
                }}
                title={event.title || 'Événement'}
                description={event.description || ''}
                pinColor="#FF4525"
              />
            );
          } else {
            console.warn(`Coordonnées invalides pour l'événement ${index}`);
            return null;
          }
        })}
      </MapView>

      {/* Bouton Retour */}
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
    flex: 1,
  },
  returnContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  textReturn: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: 'rgba(55, 27, 12, 0.7)',
  },
});