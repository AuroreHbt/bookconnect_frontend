import { useRef, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen({ route, navigation }) {
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

  // Gestion de la localisation utilisateur
  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          const { latitude, longitude } = location.coords;
          setCurrentPosition({ latitude, longitude });
        });
      } else {
        console.log('Location permission not granted');
      }
    };
    requestLocationPermission();
  }, []);

  // Ajustement de la carte aux événements
  useEffect(() => {
    if (mapRef.current && eventsData.length > 0) {
      const validCoordinates = eventsData
        .map(event => ({ latitude: event.latitude, longitude: event.longitude }))
        .filter(coord => coord.latitude && coord.longitude);

      if (validCoordinates.length > 0) {
        mapRef.current.fitToCoordinates(validCoordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    }
  }, [eventsData]); 

  // Bouton "Retour"
  const goBack = () => navigation.goBack();

  return (
    <>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        ref={mapRef}
      >
        {/* Marqueur de la position actuelle */}
        {currentPosition && (
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
                coordinate={{ latitude, longitude }}
                title={title}
                description={description}
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
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: 'rgba(55, 27, 12, 0.7)',
  },
});