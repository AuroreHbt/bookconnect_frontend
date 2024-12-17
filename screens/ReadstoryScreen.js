import React from "react";
import { useSelector } from "react-redux";

import { globalStyles } from '../styles/globalStyles';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";

// pour afficher les fichiers PDF hébergés en ligne
import { WebView } from "react-native-webview";


export default function ReadStoryScreen({ route, navigation }) {
  const { story } = route.params;
  console.log("Histoire reçue :", story);

  const user = useSelector((state) => state.user.value); // Informations recupérées depuis le store

  // https://reactnavigation.org/docs/navigation-object/#goback
  const goBack = () => navigation.goBack();


  const googleDocsUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(story.storyFile)}`;
  console.log('uri: ', story.storyFile);


  return (

    <View style={styles.container}>

      {/* Titre + Bouton retour (goBack) */}
      <View style={globalStyles.titleContainer}>
        <Text style={globalStyles.title}>Bonne lecture {user.username} !</Text>
        <TouchableOpacity
          onPress={goBack}
          activeOpacity={0.8}
        >
          <Icon
            style={globalStyles.returnContainer}
            name="chevron-circle-left"
            size={32}
            color='rgba(55, 27, 12, 0.3)'
          />
        </TouchableOpacity>
      </View >

      <View style={styles.storyContainer}>
        {/* affichage d'une 'entete' pour lecture */}
        <Text style={styles.storyTitle}>{story.title}</Text>

        <View style={styles.rowContainer}>
          <View style={styles.storyCard}>
            <Text style={styles.storyPublic}>{story.isAdult ? 'Contenu 18+' : "Tout public"}</Text>
            <Text style={styles.storyCategory}>{story.category}</Text>
          </View>

          <View style={styles.imageContainer}>
            {/* affichage du fichier image téléchargé */}
            {story.coverImage
              ? <Image
                source={{ uri: story.coverImage }}
              />
              : <Image
                source={ './assets/bookCover-placeholder.png' }
              />
            }
          </View>
        </View>
        <Text style={styles.storyDescription}>{story.description}</Text>
      </View>

      <View style={styles.webViewContainer}>
        {/* affichage des fichiers pour lecture */}
        <WebView
          // app.json pour permission android, https://docs.expo.dev/guides/permissions/
          source={{ uri: googleDocsUrl }}
          scalesPageToFit={true}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 0.95, // l'écran prend 95% + 5% de barre de nav
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 25,
    paddingHorizontal: 15,

    // borderWidth: 2,
    // borderColor: 'red',
  },

  storyContainer: {
    width: '100%',
    padding: 5,

    // borderWidth: 2,
    // borderColor: 'purple',
  },

  storyTitle: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 18,
    paddingHorizontal: 5,
    marginBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(55, 27, 12, 0.5)",

    // borderWidth: 1,
    // borderColor: 'purple',
  },

  // bloc storyCard + cover
  rowContainer: {
    flexDirection: 'row',
    width: '100%',

    // borderWidth: 1,
    // borderColor: 'green',
  },

  // bloc des infos de l'histoire: public, category, description
  storyCard: {
    width: '60%',

    // borderWidth: 1,
    // borderColor: 'darkorange',
  },

  storyPublic: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 5,
    marginTop: 10,
    width: '100%',

    // borderWidth: 1,
    // borderColor: 'pink',
  },

  storyCategory: {
    fontSize: 18,
    paddingHorizontal: 5,
    marginVertical: 10,
    width: '100%',
    height: 60,

    // borderWidth: 1,
    // borderColor: 'red',
  },

  storyDescription: {
    fontSize: 16,
    paddingHorizontal: 5,
    marginVertical: 5,
    textAlign: 'justify',
    width: '100%',

    // borderWidth: 1,
    // borderColor: 'purple',
  },

  // bloc des couvertures
  imageContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '40%',
    height: 115,

    // borderWidth: 1,
    // borderColor: 'blue',
  },

  coverImage: {
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(55, 27, 12, 0.5)',
  },

  // bloc du display de PDF
  webViewContainer: {
    flex: 1,
    width: '100%',

    // borderWidth: 1,
    // borderColor: 'green',
  },

});
