import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";


import { globalStyles } from '../styles/globalStyles';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
} from "react-native";

// pour afficher les fichiers PDF hébergés en ligne
import { WebView } from "react-native-webview";

import { addLike, removeLike } from "../reducers/story";


export default function ReadStoryScreen({ route, navigation }) {
  const { story } = route.params;
  // console.log("Histoire reçue :", story);

  const { stories: initialStories = [] } = route.params || {}; // Récupère les histoires depuis les paramètres ou initialise un tableau vide
  const [stories, setStories] = useState(initialStories); // Définit l'état local avec les histoires initiales
  const [isVisible, setIsVisible] = useState(false) // hook d'état pour le spoiler sur les images sensibles
  const [isLiked, setIsLiked] = useState(story.isLiked || false);


  const dispatch = useDispatch();

  const handleShowContent = () => {
    console.log('isVisible initial: ', isVisible);
    setIsVisible(!isVisible); // Inverse l'état de isVisible
    if (isVisible === false) {
      Alert.alert("Contenu sensible visible");
    }
  };


  const handleLike = () => {
    const updatedStory = { ...story, isLiked: !isLiked };
    setIsLiked(!isLiked);
  
    if (!isLiked) {
      dispatch(addLike(updatedStory));
    } else {
      dispatch(removeLike(updatedStory._id));
    }
  };

  const defaultImage = require('../assets/image-livre-defaut.jpg')

  const coverImage = story.coverImage
  // console.log("coverImage reçue :", coverImage);

  const user = useSelector((state) => state.user.value); // Informations recupérées depuis le store

  // https://reactnavigation.org/docs/navigation-object/#goback
  const goBack = () => navigation.goBack();

  const googleDocsUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(story.storyFile)}`;
  // console.log('uri: ', story.storyFile);


  return (

    <View style={globalStyles.container}>

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

        <View style={styles.headContent}>
          <View style={styles.storyTitleContainer}>
            <Text style={styles.storyTitle}>{story.title}</Text>
          </View>

          <View style={styles.likeButton}>
            <TouchableOpacity onPress={() => handleLike()}>
              <Icon
                name={isLiked ? "heart" : "heart-o"}
                size={28}
                color={isLiked ? "red" : "rgba(55, 27, 12, 0.3)"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rowContainer}>

          <View style={styles.storyCard}>
            <Text style={styles.storyPublic}>{story.isAdult ? 'Contenu 18+' : "Tout public"}</Text>
            <Text style={styles.storyCategory}>{story.category}</Text>
          </View>


          {/* affichage du fichier image téléchargé */}
          <View style={styles.imageContainer}>

            {/* Spoiler sur Image */}
            <Image
              source={story.coverImage !== null ? { uri: coverImage } : defaultImage}
              style={
                story.isAdult // isAdult=true (18+)
                  ? [styles.coverImageSpoiler, { width: 130, height: 130 }]
                  : [styles.coverImage, { width: 130, height: 130 }]
              }
            />

            {story.coverImage && story.isAdult ? ( // si isAdult = true => 18+ => isVisible doit être false (donc true) pour retirer le spoiler et afficher l'image uploadée
              <Icon
                name={isVisible ? null : 'eye-slash'} // si isVisible est true (donc = false), pas d'icon, else icon eye-slash
                size={72}
                style={isVisible ? null : styles.contentVisible}
                onPress={handleShowContent}
              />
            ) : null}

            {/* Affiche l'image si isVisible est false donc true */}
            {isVisible && (
              <Image
                source={{ uri: coverImage }}
                style={[styles.coverImageVisible, { width: 130, height: 130 }]}
              />
            )}
          </View>
        </View>

        <Text style={styles.storyDescription}>
          {story.description}
        </Text>

      </View >

      <View style={styles.webViewContainer}>
        {/* affichage des fichiers pour lecture */}
        <WebView
          // app.json pour permission android, https://docs.expo.dev/guides/permissions/
          source={{ uri: googleDocsUrl }}
          scalesPageToFit={true}
        />
      </View>
    </View >
  );
}


const styles = StyleSheet.create({

  storyContainer: {
    width: '100%',
    padding: 5,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "rgba(238, 236, 232, 0.9)",
    elevation: 0, // Pour Android => permet de mettre ce contenu en "arriere plan" pour acceder au onPress={handleShowContent} qui était masqué

    // borderWidth: 2,
    // borderColor: 'pink',
  },

  // Title + likeButton
  headContent: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-between',
    width: '100%',

    // borderWidth: 1,
    // borderColor: 'purple',
  },
  storyTitleContainer: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(55, 27, 12, 0.5)",
    width: '100%',

    // borderWidth: 1,
    // borderColor: 'green',
  },

  storyTitle: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 18,
    width: '90%',

    // borderWidth: 1,
    // borderColor: 'red',
  },

  likeButton: {
    position: 'absolute',
    top: 5,
    right: 5,

    // borderWidth: 1,
    // borderColor: 'blue',
  },

  // bloc storyCard + cover
  rowContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 150,

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
    height: 75,

    // borderWidth: 1,
    // borderColor: 'red',
  },

  storyDescription: {
    fontSize: 16,
    paddingHorizontal: 5,
    marginBottom: 15,
    textAlign: 'justify',
    width: '100%',
    flexWrap: 'wrap',

    // borderWidth: 1,
    // borderColor: 'purple',
  },

  // bloc des couvertures
  imageContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '40%',
    height: 135,
    paddingVertical: 2,
    paddingHorizontal: 3,
    marginBottom: 10,

    // borderWidth: 1,
    // borderColor: 'blue',
  },

  coverImage: {
    borderRadius: 10,
  },

  coverImageVisible: {
    position: 'absolute', // supersposition de l'image sur le spoiler
    top: 0,
    right: 0,
    borderRadius: 10,
  },

  coverImageSpoiler: {
    position: 'absolute', // supersposition de l'image sur le spoiler
    top: 0,
    right: 0,

    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    opacity: 0.3,
  },

  contentVisible: { // eye-slash
    position: 'absolute',
    top: 20,
    right: 20,
    color: 'rgba(253,255,0, 0.8)',
    backgroundColor: 'rgba(255, 123, 0, 0.7)',
    borderRadius: 50,
    padding: 10,
    // elevation: 10,

    // borderWidth: 1,
    // borderColor: 'yellow',
  },

  // bloc du display de PDF
  webViewContainer: {
    flex: 1,
    width: '100%',

    // borderWidth: 1,
    // borderColor: 'green',
  },

});
