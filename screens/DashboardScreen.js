import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  SafeAreaProvider,
  Image,
  GreySeparator,
  FlatList,
  Dimensions,
} from 'react-native';


export default function DashboardScreen() {

  const data = [
    { id: '1', image: require('../assets/avatar.png') },
    { id: '2', image: require('../assets/avatar.png') },
    { id: '3', image: require('../assets/avatar.png') },
  ];
  
  const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
  
    const onScroll = (event) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffsetX / Dimensions.get('window').width);
      setCurrentIndex(index);
    };
  }
  // const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value);

  const [isParameterVisible, setIsParameterVisible] = useState(false);

  const toggleParameter = () => {
    setIsParameterVisible(!isParameterVisible);
  };

  return (
    
      <SafeAreaView style={styles.container} >
        <View style={styles.header}>

          {/* Logo et Nom de l'app */}
          <View style={styles.identityApp}>
          <Image
            source={require('../assets/LogoBc.png')}
            style={styles.logo}
          />
            <Text style={styles.title}>BookConnect</Text>

            {/* Icône Paramètre */}
          </View>
          <TouchableOpacity onPress={toggleParameter} style={styles.ParameterButton}>
            <FontAwesome name="gear" size={50} color="#a2845e" />
          </TouchableOpacity>
        </View>

        {/* Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isParameterVisible}
          onRequestClose={toggleParameter}
        >
          <View style={styles.ParameterOverlay}>
            <View style={styles.ParameterContent}>
              <Text style={styles.ParameterTitle}>Paramètres</Text>

              {/* Options de paramètres */}
              <TouchableOpacity style={styles.optionButton}>
                <Text style={styles.optionText}>Modifier ma photo de profil</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.optionText}>Modifier mon username</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton}>
                <Text style={styles.optionText}>Modifier mon email</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton}>
                <Text style={styles.optionText}>Modifier mon mot de passe</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton}>
                <Text style={styles.optionText}>Déconnexion</Text>
              </TouchableOpacity>

              {/* Bouton Fermer */}
              <TouchableOpacity onPress={toggleParameter} style={styles.closeButton}>
                <FontAwesome name="close" size={30} color="#a2845e" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Photo de profil et Message de bienvenue */}
        <View style={styles.identityUser}>
          <Image
            source={require('../assets/avatar.png')}
            style={styles.avatar}
          />
          <Text style={styles.welcome}>Hello {user?.username || 'Utilisateur'}</Text>
        </View>

        {/* Section carrousel mes lectures en cours */}
        <View style={styles.sectionContainer}>
          <View style={styles.section}>
            <Text style={styles.textSection}>Mes lectures en cours</Text>
            <FontAwesome name="arrow-right" size={20} color="#a2845e" />
          </View>

			
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<View>
        <Text style={styles.carrousel}>Book1</Text>
        <Image
            source={require('../assets/avatar.png')}
            style={styles.avatar}
          />
				</View>
        <View>
        <Text style={styles.carrousel}>Book2</Text>
        <Image
            source={require('../assets/avatar.png')}
            style={styles.avatar}
          />
				</View>
        <View>
        <Text style={styles.carrousel}>Book3</Text>
        <Image
            source={require('../assets/avatar.png')}
            style={styles.avatar}
          />
				</View>
        <View>
        <Text style={styles.carrousel}>Book4</Text>
        <Image
            source={require('../assets/avatar.png')}
            style={styles.avatar}
          />
				</View>
			</ScrollView>
      </View>

        {/* Section carrousel mes évenements plannifiés*/}
        <View style={styles.sectionContainer}>
          <View style={styles.section}>
            <Text style={styles.textSection}>Mes évènements</Text>
            <FontAwesome name="arrow-right" size={20} color="black" />
          </View>
          <Text style={styles.calendrier}>Calendrier</Text>
        </View>
      </SafeAreaView>
    
  )
};


// attention : le StyleSheet doit bien être en dehors de la fonction!
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    position: 'absolute', // Colle le header en haut
    top: 40, // Définit le haut
    width: '100%', // Prend toute la largeur
    flexDirection: "row", // En ligne
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20, // Espacement horizontal
    paddingVertical: 10, // Espacement vertical
    zIndex: 1, // Place au-dessus du contenu
  },

  identityApp: {
    flexDirection: "row",
    alignItems: 'center',
  },

  logo: {
    height: 90,
    width: 90,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },

  ParameterButton: {
    padding: 10, // Zone cliquable plus grande
  },

  identityUser: {
    marginTop: 10, // Décale le contenu pour éviter le header
    alignItems: "center",
    marginVertical: 20,
  },

  avatar: {
    width: 150,
    height: 150,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
  },

  welcome: {
    fontSize: 24,
    color: '#333',
  },

  sectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  section: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  textSection: {
    fontSize: 16,
    color: '#555',
    marginRight: 10,
  },

});