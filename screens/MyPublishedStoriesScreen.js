import React, { useEffect, useState } from "react";

// BottomTab visible sur les Screens => globalStyles
import { globalStyles } from '../styles/globalStyles';

import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native";

import { useSelector, useDispatch } from "react-redux";

import { deleteStory } from "../reducers/story";

// import de la bibliothèque d'icône Fontawsome via react-native-vector-icons
import Icon from 'react-native-vector-icons/FontAwesome';

// import pour utiliser des dégradés linéaires (x,y)
import { LinearGradient } from 'expo-linear-gradient';


const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_ADDRESS;

export default function MyPublishedStoriesScreen({ navigation }) {

  // https://reactnavigation.org/docs/navigation-object/#goback
  const goBack = () => navigation.goBack();

  const [stories, setStories] = useState([]); //hook d'état pour stocker les histoires publiées


  const user = useSelector((state) => state.user.value); // Informations recupérées depuis le store

  const story = useSelector((state) => state.story.value) // story list = tableau d'objets

  const dispatch = useDispatch();

  // Fonction pour récupérer les histoires publiées
  const getMyPublishedStories = () => {
    fetch(`${BACKEND_ADDRESS}/stories/mypublishedstory/${user.username}`)
      .then((response) => response.json())
      .then((data) => setStories(data.stories)); // Mettre à jour l'etat avec les données des histoires
  };

  useEffect(() => {
    getMyPublishedStories();
  }, [user.username]); // Actualisation sur l'utilisateur en cas de changement


  // Fonction pour supprimer une histoire que l'on a postée
  const handleDeleteStory = (storyId) => {
    // Debug ok
    // console.log("ID de l'histoire sélectionnée : ", storyId) // ID de l'histoire sélectionnée
    console.log("Type de storyId :", typeof storyId); // Vérifiez le type
    console.log("Type de user.token :", typeof user.token); // Vérifiez le type

    fetch(`${BACKEND_ADDRESS}/stories/deletepublishedstory`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: user.token, id: storyId }),
      // Envoi de l'ID de l'histoire à supprimer lié au token de l'author : sans cette ligne, la requete est vide (cf. console.log de req.body sur la route delete)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("DATA: ", data)
        console.log("ID: ", storyId)

        if (data.result) {

          console.log('Réponse du serveur (data.result): ', data.result)
          dispatch(deleteStory(storyId)) // supprime l'histoire du store
          console.log('story supprimée avec succès');
          getMyPublishedStories(); // pour recharger la page avec les stories publiées
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de l'histoire:", error);
      });
  };

  // Fonction pour modifier une histoire postée : à définir
  // const handlePutStory = async () => {

  // }


  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View>

        {/* Titre + Bouton retour (goBack) */}
        <View style={globalStyles.titleContainer}>
          <Text style={globalStyles.title}>Mes oeuvres</Text>
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

        {/* Affichage des histoires publiées */}
        <FlatList
          initialScrollIndex={0}
          keyExtractor={(item) => item._id}
          data={stories}
          //data={stories.reverse()} // pour inverser l'affichage des story postées sans gérer un tri par date
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("ReadStory", { story: item })} // Navigation avec paramètres
            >
              <View style={styles.storyCard}>
                {/* affichage des infos venant de addNewStory */}
                <View>
                  <Text style={styles.storyTitle}>{item.title}</Text>
                </View>

                <View style={styles.contentCard}>

                  <View>
                    <Text style={styles.storyCategory}>{"Catégorie: " + item.category}</Text>
                    <Text style={styles.storyPublic}>{item.isAdult ? 'Contenu 18+' : "Tout publique"}</Text>
                    <Text style={styles.storyDescription}>{"Résumé: " + item.description}</Text>
                  </View>

                  <View style={styles.imageContainer}>
                    {/* affichage du fichier image téléchargé */}
                    {item.coverImage && (
                      <Image
                        source={{ uri: item.coverImage }}
                        style={story.isAdult ? styles.coverImage : styles.coverImageAdult}
                        blurRadius={story.isAdult ? 10 : 0}
                      />
                    )}
                  </View>
                </View>

                <View style={styles.buttonCard}>

                  {/* bouton pour modifier (route PUT à définir) */}
                  <LinearGradient
                    colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 0.7 }}
                    style={styles.gradientButton}
                    activeOpacity={0.8}
                  >
                    <TouchableOpacity
                      // onPress={handlePutStory} : à définir
                      style={styles.button}
                    >
                      <Text style={styles.textButton}>Modifier</Text>
                    </TouchableOpacity>
                  </LinearGradient>

                  {/* bouton pour delete */}
                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => handleDeleteStory(item._id)} // Passez l'ID de l'histoire ici
                  >
                    <Icon
                      name='trash-o'
                      size={28}
                      color='rgba(55, 27, 12, 0.7)'
                    />
                  </TouchableOpacity>

                </ View>
              </View>

            </TouchableOpacity>
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({

  // CSS global des cards Story
  storyCard: {
    backgroundColor: 'rgba(238, 236, 232, 1)', // "#EEECE8",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    width: '100%',
    // marginLeft: 10,

    borderWidth: 1,
    borderColor: 'rgba(55, 27, 12, 0.1)',
  },

  storyTitle: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 18,
    padding: 5,
    margin: 5,
    flexWrap: 'wrap',
  },

  // CSS infos story + cover
  contentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,

    // borderWidth: 1,
    // borderColor: 'red',
  },

  storyCategory: {
    fontSize: 18,
    marginBottom: 10,
  },

  storyPublic: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  storyDescription: {
    fontSize: 16,
    marginBottom: 10,
  },

  // CSS des couvertures
  imageContainer: {
    width: '40%',
    padding: 5,
    // borderWidth: 1,
    // borderColor: 'blue',
  },

  coverImage: {
    height: 150,
    borderRadius: 10
  },

  coverImageAdult: {
    height: 150,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(55, 27, 12, 0.5)',
  },

  // CSS du bouton Modifier + poubelle pour suppr
  buttonCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,

    // borderWidth: 1,
    // borderColor: 'rgba(238, 236, 232, 1)',
  },

  gradientButton: {
    borderRadius: 10,
  },

  button: {
    padding: 4,
    margin: 4,
  },

  textButton: {
    textAlign: 'center',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white', // 'rgba(55, 27, 12, 0.8)', // #371B0C
  },

  iconContainer: {
    top: 5,
    left: 15,
    marginRight: 30,
  },

});
