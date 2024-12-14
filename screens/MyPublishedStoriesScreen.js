import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { deleteStory } from "../reducers/story";

// import de la bibliothèque d'icône Fontawsome via react-native-vector-icons
import Icon from 'react-native-vector-icons/FontAwesome';

// import pour utiliser des dégradés linéaires (x,y)
import { LinearGradient } from 'expo-linear-gradient';


const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_ADDRESS;

export default function MyPublishedStoriesScreen({ navigation }) {

  const [stories, setStories] = useState([]); //hook d'état pour stocker les histoires publiées

  const user = useSelector((state) => state.user.value); // Informations recupérées depuis le store

  const story = useSelector((state) => state.story.value)

  const dispatch = useDispatch();

  // https://reactnavigation.org/docs/navigation-object/#goback
  const goBack = () => navigation.goBack();


  useEffect(() => {
    fetch(`${BACKEND_ADDRESS}/stories/mypublishedstory/${user.username}`)
      .then((response) => response.json())
      .then((data) => setStories(data.stories)); // Mettre à jour l'etat avec les données des histoires
  }, [user.username]); // Actualisation sur l'utilisateur en cas de changement


  // Fonction pour supprimer une histoire que l'on a postée
  const handleDeleteStory = () => {
    console.log(user.username)
    console.log(user)
    console.log(story)
    fetch(`${BACKEND_ADDRESS}/stories/deletepublishedstory/${user.username}/${story}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.result) {
          console.log('Réponse du serveur:', data)
          dispatch(deleteStory(story._id))
          setStory('')
          console.log('story supprimée !');
          navigation.navigate('MyPublishedStories')
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de l'histoire:", error);
      });
  };

  // Fonction pour modifier une histoire postée : à définir
  const handlePutStory = async () => {

  }


  return (
    <View style={styles.container}>

      {/* Bouton retour (goBack) */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Mes oeuvres</Text>
        <TouchableOpacity
          onPress={goBack}
          activeOpacity={0.8}
        >
          <Icon
            style={styles.returnContainer}
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

              <View style={styles.leftRectangle}>

                {/* affichage des infos venant de addNewStory */}
                <View>
                  <Text style={styles.storyTitle}>{item.title}</Text>
                </View>
                <View>
                  <Text style={styles.storyCategory}>{item.category}</Text>
                  <Text style={styles.storyDescription}>{item.description}</Text>
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
                    onPress={handleDeleteStory}
                  >
                    <Icon
                      name='trash-o'
                      size={28}
                      color='rgba(55, 27, 12, 0.7)'
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.imageContainer}>
                {/* affichage du fichier image téléchargé */}
                {item.coverImage && (
                  <Image
                    style={styles.coverImage}
                    source={{ uri: item.coverImage }}
                  />
                )}
              </View>
            </ View>
          </TouchableOpacity>
        )}
      />
    </View >
  );
}

const styles = StyleSheet.create({
  // CSS du "header"
  container: {
    flex: 0.95,
    justifyContent: 'center',
  },

  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: 20,
  },

  title: {
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 28,
    padding: 5,
    color: 'rgba(55, 27, 12, 0.9)', // #371B0C
  },

  returnContainer: {
    position: 'absolute',
    top: 10,
    right: 0,
  },

  // CSS des cards Story
  storyCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(238, 236, 232, 1)', // "#EEECE8",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    width: '95%',
    marginLeft: 10,
  },

  leftRectangle: {
    width: '60%',
    padding: 5,
    // borderWidth: 1,
    // borderColor: 'red',
  },

  storyTitle: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 18,
    marginBottom: 5,
    // borderWidth: 1,
    // borderColor: 'orange',
  },

  storyCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  storyDescription: {
    fontSize: 16,
    marginBottom: 10,
  },

  // CSS du bouton Modifier + poubelle pour suppr
  buttonCard: {
    flexDirection: 'row',
    width: '50%',
    marginTop: 10,
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
  },

  // CSS des couvertures
  imageContainer: {
    width: '40%',
    padding: 5,
    // borderWidth: 1,
    // borderColor: 'blue',
  },

  coverImage: {
    height: 170,
    borderRadius: 10
  },

});
