import React from "react";

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

  // https://reactnavigation.org/docs/navigation-object/#goback
  const goBack = () => navigation.goBack();


  const googleDocsUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
    story.storyFile
  )}`;

  return (

    <View style={globalStyles.container}>

      {/* Titre + Bouton retour (goBack) */}
      <View style={globalStyles.titleContainer}>
        <Text style={globalStyles.title}>Titre: {story.title}</Text>
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
      </View>

      <View>
        {/* affichage d'une 'entete' pour lecture */}
        <Image src={story.coverImage} />
        <Text style={styles.storyTitle}>{story.title}</Text>
        <Text style={styles.storyCategory}>{story.category}</Text>
        {/* <Text style={styles.storyPublic}>{{publicReader} ? "Contenu 18+" : "Tout public" }</Text> */}
        <Text style={styles.storyDescription}>{story.description}</Text>

        {/* affichage des fichiers pour lecture */}
        <WebView
          // app.json pour permission android, https://docs.expo.dev/guides/permissions/
          source={{ uri: googleDocsUrl }}
          style={styles.webview}
          scalesPageToFit={true}
        // originWhitelist={['*']}
        // javaScriptEnabled={true}
        // domStorageEnabled={true}
        // startInLoadingState={true}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({

  webview: {
    flex: 0.8,
    maxWidth: '100%',
    // height: '100%',
  },

  storyTitle: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 18,
    padding: 5,
    marginBottom: 15,
    flexWrap: 'wrap',
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(55, 27, 12, 0.5)"
  },

  storyCategory: {
    fontSize: 18,
    marginTop: 5,
    marginBottom: 10,
    flexWrap: 'wrap',
    // width: '55%',
    maxWidth: '55%',
    height: 60,

    // borderWidth: 1,
    // borderColor: 'red',
  },

  storyPublic: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 30,
    flexWrap: 'wrap',
    width: '50%',

    // borderWidth: 1,
    // borderColor: 'purple',
  },

  storyDescription: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'justify',
    flexWrap: 'wrap',
    maxWidth: '100%',

    // borderWidth: 1,
    // borderColor: 'purple',
  },



});
