import React from "react";

import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";

import { WebView } from "react-native-webview";

import { globalStyles } from '../styles/globalStyles';
import { LinearGradient } from "expo-linear-gradient";
import Icon from 'react-native-vector-icons/FontAwesome';


export default function ReadStoryScreen({ route, navigation }) {
  const { story } = route.params;
  console.log("Histoire reçue :", story);

  // https://reactnavigation.org/docs/navigation-object/#goback
  const goBack = () => navigation.goBack();


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

      <View
        style={styles.webView}
      >
        {/* affichage d'une 'entete' pour lecture */}
        <Image src={story.coverImage} />
        <Text style={styles.storyTitle}>{story.title}</Text>
        <Text style={styles.storyCategory}>{story.category}</Text>
        {/* <Text style={styles.storyPublic}>{{publicReader} ? "Contenu 18+" : "Tout public" }</Text> */}
        <Text style={styles.storyDescription}>{story.description}</Text>

        {/* affichage des fichiers pour lecture */}
        <WebView
          source={{ uri: story.storyFile }}
          // originWhitelist={['https://*']} pour contrôler les origines des URL
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  webView: {
    flex: 0.7
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
