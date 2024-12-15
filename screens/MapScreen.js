import React, { useEffect, useState } from 'react';

import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';


export default function MapScreen({ route }) {
  const dispatch = useDispatch();



  const { latitude, longitude } = route.params;

  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await Location.requestForegroundPermissionsAsync();
      const status = result?.status;

      if (status === 'granted') {
        Location.watchPositionAsync({ distanceInterval: 10 },
          (location) => {
            setCurrentPosition(location.coords);
          });
      }
    })();
  }, []);

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={{
        latitude: latitude || currentPosition?.latitude || 37.7749, // Utiliser la latitude de la ville ou la position actuelle
        longitude: longitude || currentPosition?.longitude || -122.4194, // Utiliser la longitude de la ville ou la position actuelle
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {currentPosition && (
        <Marker
          coordinate={currentPosition}
          title="My position"
          pinColor="#fecb2d"
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({

  map: {
    flex: 0.95,
  },

});
