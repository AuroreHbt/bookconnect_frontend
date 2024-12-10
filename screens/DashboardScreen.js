import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  SafeAreaView,                                                                                                                                                                                                                                                              feAreaView,
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
} from "react-native";
import Popover from "react-native-popover-view";
import Tooltip from 'rn-tooltip';

export default function DashboardScreen() {
 //faire une const databook avec un .map pour rapeller les livres en lecture 

  // const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value);

  const [isParameterVisible, setIsParameterVisible] = useState(false);


  return (
    <SafeAreaView style={styles.container}>
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
        <Image source={require("../assets/avatar.png")} style={styles.avatar} />
        <Text style={styles.welcome}>Hello {user.username}</Text>
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
              source={require("../assets/avatar.png")}
              style={styles.avatar}
            />
          </View>
          <View>
            <Text style={styles.carrousel}>Book2</Text>
            <Image
              source={require("../assets/avatar.png")}
              style={styles.avatar}
            />
          </View>
          <View>
            <Text style={styles.carrousel}>Book3</Text>
            <Image
              source={require("../assets/avatar.png")}
              style={styles.avatar}
            />
          </View>
          <View>
            <Text style={styles.carrousel}>Book4</Text>
            <Image
              source={require("../assets/avatar.png")}
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
  );
}

// attention : le StyleSheet doit bien être en dehors de la fonction!
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    position: "absolute", // Colle le header en haut
    top: 40, // Définit le haut
    width: "100%", // Prend toute la largeur
    flexDirection: "row", // En ligne
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20, // Espacement horizontal
    paddingVertical: 10, // Espacement vertical
    zIndex: 1, // Place au-dessus du contenu
  },

  identityApp: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    height: 90,
    width: 90,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
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
    backgroundColor: "#f2f2f2",
  },

  welcome: {
    fontSize: 24,
    color: "#333",
  },

  sectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    color: "#555",
    marginRight: 10,
  },
  ParameterContent: {
    position: 'absolute',
    top: 60, // Ajuste pour correspondre à la position de ton icône
    right: 20, // Ajuste selon l'alignement de l'icône
    backgroundColor: '#a2845e',
    borderRadius: 10,
    padding: 10,
    width: 150, // Ajuste la largeur du menu
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Pour ombre sur Android
    zIndex: 100, // Assure-toi qu'elle est au premier plan
  },
  ParameterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionButton: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },

  popover : {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    width: 100,
    backgroundColor: "transparent",
    color:"white",
    borderRadius: 4,
    transitionDuration: 0.5,
    cursor: "pointer",
  }
});
