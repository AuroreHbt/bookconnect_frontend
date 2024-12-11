import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MapView, { PROVIDER_GOOGLE , Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen({ route }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  // Assurez-vous que les paramètres sont passés correctement
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
        latitude: latitude || currentPosition?.latitude || 37.7749, // Utilisez la latitude de la ville ou la position actuelle
        longitude: longitude || currentPosition?.longitude || -122.4194, // Utilisez la longitude de la ville ou la position actuelle
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
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: 150,
    borderBottomColor: '#ec6e5b',
    borderBottomWidth: 1,
    fontSize: 16,
  },
  button: {
    width: 150,
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 8,
    backgroundColor: '#ec6e5b',
    borderRadius: 10,
  },
  textButton: {
    color: '#ffffff',
    height: 24,
    fontWeight: '600',
    fontSize: 15,
  },
});
