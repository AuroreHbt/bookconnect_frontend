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

import { deleteStory, updateStory } from "../reducers/story";

// import de la bibliothèque d'icône Fontawsome via react-native-vector-icons
import Icon from 'react-native-vector-icons/FontAwesome';

// import pour utiliser des dégradés linéaires (x,y)
import { LinearGradient } from 'expo-linear-gradient';


const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_ADDRESS;

export default function MyPublishedStoriesScreen({ navigation }) {

  // https://reactnavigation.org/docs/navigation-object/#goback
  const goBack = () => navigation.goBack();

  const [stories, setStories] = useState([]); //hook d'état pour stocker les histoires publiées
  const [isVisible, setIsVisible] = useState(false) // hook d'état pour le spoiler sur les images sensibles

  const user = useSelector((state) => state.user.value); // Informations recupérées depuis le store
  const story = useSelector((state) => state.story.value) || [] // story list = tableau d'objets

  const dispatch = useDispatch();

  const handleShowContent = () => {
    setIsVisible(!isVisible);
  }

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
  const handleUpdateStory = async (storyId) => {
    // Debug ok
    console.log("ID de l'histoire sélectionnée : ", storyId);
    console.log("Type de storyId :", typeof storyId);
    console.log("Type de user.token :", typeof user.token);

    try {
      const response = await
        fetch(`${BACKEND_ADDRESS}/stories/updatepublishedstory`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: user.token,
            id: storyId,
            // title: story.title, // Include title for update
            // category: story.category,
            // isAdult: story.isAdult,
            // description: story.description,
            // coverImage: story.coverImage,
            // storyFile: story.storyFile,
          }),
        })
      // Envoi de l'ID de l'histoire à supprimer lié au token de l'author : sans cette ligne, la requete est vide (cf. console.log de req.body sur la route) e renvoie => (NOBRIDGE) ERROR  Erreur lors de la modification:  [SyntaxError: JSON Parse error: Unexpected character: <]    
      const data = await response.json();

      if (data.result) {
        console.log('Réponse du serveur (data.result): ', data.result);
        dispatch(updateStory({ id, data: { title: 'Updated Title' } })); // Dispatch update action
        console.log('Modification effectuée avec succès');
        getMyPublishedStories(); // Re-fetch stories
      } else {
        console.error('Erreur lors de la mise à jour:', data.error);
      }
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
    }
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
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
          // data={Array.isArray(stories) ? stories.reverse() : []} // Check if stories is an array pour inverser l'affichage des story postées sans gérer un tri par date
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("ReadStory", { story: item })} // Navigation avec paramètres
            >
              <View style={styles.storyContainer}>
                {/* affichage des infos venant de addNewStory */}
                <View>
                  <Text style={styles.storyTitle}>{item.title}</Text>
                </View>

                <View style={styles.rowContainer}>

                  <View style={styles.storyCard} >
                    <Text style={styles.storyPublic}>{item.isAdult ? 'Contenu 18+' : "Tout public"}</Text>
                    <Text style={styles.storyCategory}>{"Catégorie: " + item.category}</Text>
                  </View>

                  <View style={styles.imageContainer}>
                    {/* affichage du fichier image téléchargé */}
                    {item.coverImage
                      ?
                      <Image
                        source={{ uri: story.coverImage }}
                        style={
                          item.isAdult // isAdult=true (18+)
                            ? [styles.coverImageAdult, { width: 200, height: 115 }]
                            : [styles.coverImage, { width: 200, height: 115 }]
                        }
                        blurRadius={item.isAdult ? 10 : 0}
                      />
                      :
                      < Image
                        source={require('../assets/bookCover-placeholder.png')}
                        style={[
                          styles.coverImage, { width: 200, height: 115 }]
                        }
                      />
                    }

                    <TouchableOpacity
                      onPress={handleShowContent}
                    >
                      {item.isAdult && (
                        <Text style={item.isAdult ? styles.showContent : null} >Contenu sensible</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.storyDescription}>
                  {"Résumé: " + item.description}
                </Text>

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
                      onPress={handleUpdateStory}
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

  container: {
    flex: 0.95, // l'écran prend 95% + 5% de barre de nav
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: 25,
    paddingHorizontal: 15,

    // borderWidth: 2,
    // borderColor: 'red',
  },

  storyContainer: {
    width: '100%',
    padding: 5,
    backgroundColor: "rgba(238, 236, 232, 0.9)",
    borderRadius: 10,

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
    // borderColor: 'yellow',
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
    height: 115,

    borderWidth: 1,
    borderColor: 'blue',
  },

  coverImage: {
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(55, 27, 12, 0.5)',
  },

  coverImageAdult: {
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 123, 0, 0.5)',

    backgroundColor: 'rgba(0, 0, 0, 1)',
    opacity: 0.5,
  },

  showContent: {
    position: 'absolute',
    top: -65,
    right: 7,
    backgroundColor: 'rgba(253,255,0, 1)',
    textAlign: 'center',
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
