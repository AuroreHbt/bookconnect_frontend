                                                                                                                                                                                           import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { LinearGradient } from 'expo-linear-gradient';

// import de la bibliothèque d'icône Fontawsome via react-native-vector-icons
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import { useDispatch } from "react-redux";
import { logout } from "../reducers/user";


export default function DashboardScreen({ navigation }) {

  /*  const data = [
     { id: '1', image: require('../assets/avatar.png') },
     { id: '2', image: require('../assets/avatar.png') },
     { id: '3', image: require('../assets/avatar.png') },
   ]; */

  // utiliser .map sur les reducer pour affichage dynamique

  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value);

  const [isParameterVisible, setIsParameterVisible] = useState(false);

  const toggleParameter = () => {
    setIsParameterVisible(!isParameterVisible);
  };

  // Déconnexion
  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate('Home')
  };

  const handleMyCurrentReadings = () => {
    navigation.navigate('MyCurrentReadings')
  }

  const handleMyEvents = () => {
    navigation.navigate('MyEvents')
  }


  return (
    <SafeAreaView style={styles.container} >
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Dégradé en haut */}
        <View style={styles.gradientContainer}>
          <LinearGradient
            colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']}
            start={{ x: 0.7, y: 0 }} // Début du gradient (coin haut gauche)
            end={{ x: 0.5, y: 0.9 }}  // Fin du gradient (coin bas droit)
            style={styles.gradient}
          />
        </View>
        <View style={styles.header}>

          {/* Logo et Nom de l'app */}
          <View style={styles.identityApp}>

            {/* Icône Paramètre */}
          </View>
          <TouchableOpacity onPress={toggleParameter} style={styles.ParameterButton}>
            <Icon name="gear" size={36} color="white" />
          </TouchableOpacity>
        </View>

        {/* Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isParameterVisible}
          onRequestClose={toggleParameter}
        >
          {/* TouchableWithoutFeedback pour fermer la modal quand on touche n'importe où sur l'écran */}
          <TouchableWithoutFeedback onPress={toggleParameter}>
            <View style={styles.overlay}>
              <View style={styles.ParameterContent}>

                {/* Options de paramètres */}
                <TouchableOpacity style={styles.optionButton}>
                  <Text style={styles.optionText} onPress={() => handleLogout()}>Déconnexion</Text>
                  <Icon name='sign-out' size={20} color='rgba(216, 72, 21, 0.9)' style={styles.logoutIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Photo de profil et Message de bienvenue */}
        <View style={styles.identityUser}>
          <Image
            source={require('../assets/avatar1.jpeg')}
            style={styles.avatar}
          />
          <Text style={styles.welcome}>Hello {user?.username || 'Utilisateur'}</Text>
        </View>

        {/* Section carrousel mes lectures en cours */}
        <View style={styles.sectionContainer}>
          {/* Titre de la section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.textSection}>Mes lectures en cours</Text>
            <TouchableOpacity
              onPress={handleMyCurrentReadings}
              activeOpacity={0.8}
            >
              <Icon name="chevron-circle-right" size={20} color="rgba(216, 72, 21, 0.9)" />
            </TouchableOpacity>
          </View>

          {/* ScrollView horizontal */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.booksContainer}>
            <View style={styles.bookCard}>
              <Image
                source={require('../assets/book3.png')}
                style={styles.book}
              />
              <Text style={styles.textCard}>Book1</Text>
              <Text style={styles.subtextCard}>Elina M.</Text>
            </View>
            <View style={styles.bookCard}>
              <Image
                source={require('../assets/book1.png')}
                style={styles.book}
              />
              <Text style={styles.textCard}>Book2</Text>
              <Text style={styles.subtextCard}>Aurore H.</Text>
            </View>
            <View style={styles.bookCard}>
              <Image
                source={require('../assets/book2.png')}
                style={styles.book}
              />
              <Text style={styles.textCard}>Book3</Text>
              <Text style={styles.subtextCard}>Robin L.</Text>
            </View>
            <View style={styles.bookCard}>
              <Image
                source={require('../assets/book4.png')}
                style={styles.book}
              />
              <Text style={styles.textCard}>Book4</Text>
              <Text style={styles.subtextCard}>Marie B.</Text>
            </View>
          </ScrollView>
        </View>

        {/* Section carrousel mes évènements */}
        <View style={styles.sectionContainer}>
          {/* Titre de la section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.textSection}>Mes évènements</Text>
            <TouchableOpacity
              onPress={handleMyEvents}
              activeOpacity={0.8}
            >
              <Icon name="chevron-circle-right" size={20} color="rgba(216, 72, 21, 0.9)" />
            </TouchableOpacity>
          </View>
          {/* ScrollView horizontal des évènements*/}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.eventsContainer}>
            <View style={styles.bookCard}>
              <View style={styles.event} backgroundColor={'green'}></View>
              <Text style={styles.textCard}>Event1</Text>
              <Text style={styles.subtextCard}>Samedi 14 décembre</Text>
            </View>
            <View style={styles.bookCard}>
              <View style={styles.event} backgroundColor={'blue'}></View>
              <Text style={styles.textCard}>Event2</Text>
              <Text style={styles.subtextCard}>Samedi 21 décembre</Text>
            </View>
            <View style={styles.bookCard}>
              <View style={styles.event} backgroundColor={'red'}></View>
              <Text style={styles.textCard}>Event3</Text>
              <Text style={styles.subtextCard}>Mercredi 25 décembre</Text>
            </View>
            <View style={styles.bookCard}>
              <View style={styles.event} backgroundColor={'pink'}></View>
              <Text style={styles.textCard}>Event4</Text>
              <Text style={styles.subtextCard}>Mercredi 31 décembre</Text>
            </View>
          </ScrollView>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};


// attention : le StyleSheet doit bien être en dehors de la fonction!
const styles = StyleSheet.create({

  container: {
    flex: 0.95,
    justifyContent: 'center',
    alignItems: 'center',
  },

  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 150, // Hauteur du gradient
    borderBottomLeftRadius: 150, // Arrondi en bas à gauche
    borderBottomRightRadius: 150, // Arrondi en bas à droite
    overflow: 'hidden', // Nécessaire pour l'arrondi
  },

  gradient: {
    flex: 1, // Remplit tout l'espace du conteneur
  },

  scrollContent: {
    paddingVertical: 20,
  },

  header: {
    position: 'absolute', // Colle le header en haut
    top: 10, // Définit le haut
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

  ParameterButton: {
    padding: 10, // Zone cliquable plus grande
  },

  identityUser: {
    marginTop: 60, // Décale le contenu pour éviter le header
    alignItems: "center",
    marginVertical: 50,
  },

  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 10,
  },

  welcome: {
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 36,
    color: 'rgba(55, 27, 12, 0.9)',
  },

  sectionContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 40,
    paddingBottom: 30,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingLeft: 10,
  },

  booksContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 5,
  },

  bookCard: {
    marginRight: 15, // Espacement entre les livres
    alignItems: "center",
    shadowColor: '#000', // Couleur de l'ombre
    shadowOffset: { width: 0, height: 4 }, // Décalage de l'ombre
    shadowOpacity: 0.5, // Opacité de l'ombre
    shadowRadius: 5, // Rayon de flou de l'ombre
    elevation: 5, // Ombre sur Android
  },

  textSection: {
    fontSize: 20,
    color: '#443108',
    fontWeight: '600',
    marginRight: 10,
    fontFamily: 'Poppins',
  },

  textCard: {
    fontSize: 20,
    fontFamily: 'Times',
    color: 'black',
  },

  subtextCard: {
    fontSize: 12,
    fontFamily: 'Poppins',
    color: 'grey',
  },

  book: {
    width: 180,
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },

  eventsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 5,
  },

  event: {
    width: 180,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },

  ParameterContent: {
    position: 'absolute',
    top: 85, // Ajuste pour correspondre à la position de ton icône
    right: 80, // Ajuste selon l'alignement de l'icône
    backgroundColor: '#EEECE8',
    borderRadius: 10,
    padding: 10,
    width: 150, // Ajuste la largeur du menu
    shadowColor: '#000', // couleur de l'ombre
    shadowOffset: { width: 0, height: 4 }, // direction de l'ombre
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Pour ombre sur Android
    zIndex: 100, // Premier plan
  },
  ParameterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: 'rgba(216, 72, 21, 0.9)',
    fontWeight: 'bold',
    textAlign: 'left',
    fontFamily: 'Poppins',
  },

  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Fond semi-transparent
  },

});