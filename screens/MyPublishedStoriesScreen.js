import React, { useEffect, useState } from "react";

// BottomTab visible sur les Screens => globalStyles
import { globalStyles } from '../styles/globalStyles';

import {
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  Modal,
  TextInput,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";

import { deleteStory, updateStory, addStory } from "../reducers/story";

// import de la bibliothèque d'icône Fontawsome via react-native-vector-icons
import Icon from 'react-native-vector-icons/FontAwesome';

// import pour utiliser des dégradés linéaires (x,y)
import { LinearGradient } from 'expo-linear-gradient';



const EXPO_PUBLIC_BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_ADDRESS;

export default function MyPublishedStoriesScreen({ navigation }) {

  // https://reactnavigation.org/docs/navigation-object/#goback
  const goBack = () => navigation.goBack();

  const defaultImage = require('../assets/image-livre-defaut.jpg')

  const user = useSelector((state) => state.user.value); // Informations recupérées depuis le store
  const story = useSelector((state) => state.story.value); // story list = tableau d'objets
  // console.log('story:', story);

  const dispatch = useDispatch();

  const [stories, setStories] = useState([]); //hook d'état pour stocker les histoires publiées
  const [isVisible, setIsVisible] = useState(false) // hook d'état pour le spoiler sur les images sensibles
  const [characterTitleCount, setCharacterTitleCount] = useState(0); // variable d'état pour gérer l'affichage du nombre de caractères pour la description
  const [characterDescriptionCount, setCharacterDescriptionCount] = useState(0); // variable d'état pour gérer l'affichage du nombre de caractères pour la description


  // variables d'état pour gérer la modif titre et description
  const [modaleIsVisible, setModaleIsVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleShowContent = () => {
    console.log('isVisible initial: ', isVisible);
    setIsVisible(!isVisible); // Inverse l'état de isVisible
    if (isVisible === false) {
      Alert.alert("Contenu sensible visible");
    }
  };

  console.log('état modaleIsVisible: ', modaleIsVisible);
  const handleShowModal = () => {
    setModaleIsVisible(!modaleIsVisible); // Inverse l'état de modaleIsVisible
    setNewTitle('');
    setNewDescription('');
  };

  // Fonction pour récupérer les histoires publiées
  const getMyPublishedStories = () => {
    fetch(`${EXPO_PUBLIC_BACKEND_ADDRESS}/stories/mypublishedstory/${user.username}`)
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

    fetch(`${EXPO_PUBLIC_BACKEND_ADDRESS}/stories/deletepublishedstory`, {
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

  // Debug
  // console.log("Valeur de newTitle avant mise à jour :", newTitle);
  // console.log("Valeur de newDescription avant mise à jour :", newDescription);
  // console.log("Contenu de story :", story);


  // Fonction pour modifier une histoire postée : à définir
  const handleUpdateStory = async (id) => {

    // parametre id pour cibler la story qu'on veut

    // Debug 
    console.log("handleUpdateStory fonction appelée"); // ok
    console.log("storyId:", id);
    console.log("user.token:", user.token); // ok
    console.log("newTitle:", newTitle); // ok null
    console.log("newDescription:", newDescription); // ok null

    // Création d'un objet contenant uniquement les champs à mettre à jour
    const updateData = {
      token: user.token,
      storyId: id,
      title: newTitle,
      description: newDescription,
    };

    if (newTitle.trim()) updateData.newTitle = newTitle.trim();
    if (newDescription.trim()) updateData.newDescription = newDescription.trim();

    try {
      const response = await
        fetch(`${EXPO_PUBLIC_BACKEND_ADDRESS}/stories/updatepublishedstory`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

      const data = await response.json();
      console.log('Données reçues par le serveur :', data);

      if (data.result) {
        console.log('data.result: ', data.result);

        // Dispatch de la fonction updateStory pour mettre à jour le state
        dispatch(updateStory({
          id: storyId,
          data: {
            title: updateData.newTitle || story[0].title, // Utilise le titre actuel s'il n'est pas modifié
            description: updateData.newDescription || story[0].description, // Utilise la description actuelle s'il n'est pas modifié
          }
        }));

        console.log('Histoire mise à jour avec succès :', data.story);

        Alert.alert("Succès", "L'histoire a été mise à jour avec succès.");

        getMyPublishedStories(); // Re-fetch stories
        return data.story;

      } else {
        console.error('Erreur lors de la mise à jour :', data.error);
        Alert.alert(`Erreur lors de la mise à jour : auteur ou histoire non trouvée`);
      }
    } catch (error) {
      console.error('Erreur lors de la requête :', error);
      Alert.alert('Erreur lors de la requête');
    }
  };


  return (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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

                    {/* affichage du fichier image téléchargé */}
                    <View style={styles.imageContainer}>

                      {/* Spoiler sur Image */}
                      <Image
                        source={item.coverImage ? { uri: item.coverImage } : defaultImage}
                        style={
                          item.isAdult // isAdult=true (18+)
                            ? [styles.coverImageSpoiler, { width: 130, height: 130 }]
                            : [styles.coverImage, { width: 130, height: 130 }]
                        }
                      />

                      {item.coverImage && item.isAdult ? ( // si isAdult = true => 18+ => isVisible doit être false (donc true) pour retirer le spoiler et afficher l'image uploadée
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
                          source={{ uri: item.coverImage }}
                          style={[styles.coverImageVisible, { width: 130, height: 130 }]}
                        />
                      )}
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
                      {/* Bouton MODIFIER qui ouvre une modale pour modifier titre et description */}
                      <View>
                        <TouchableOpacity
                          onPress={handleShowModal} // passe à true pour ouvrir la modale
                          style={styles.button}
                        >
                          <Text style={styles.textButton}>Modifier</Text>
                        </TouchableOpacity>
                      </View>
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

                  </View>
                  <View>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                      <Modal
                        transparent={true}
                        animationType="fade"
                        visible={modaleIsVisible}
                      //onRequestClose={handleShowModal}  // bouton Fermer pour fermer la modale
                      >
                        <View style={styles.modalContainer}>
                          <Text style={styles.textModal}>
                            Modifier vos informations
                          </Text>

                          <TextInput
                            placeholder="Titre"
                            value={newTitle}
                            onChangeText={(value) => {
                              setNewTitle(value);
                              setCharacterTitleCount(value.length);
                            }}
                            maxLength={55}
                            style={styles.input}
                          />
                          <Text
                            style={
                              {
                                color: 'grey',
                                marginTop: -10,
                                marginBottom: 10,
                              }
                            } >
                            {characterTitleCount}/55
                          </Text>

                          <TextInput
                            placeholder="Description"
                            value={newDescription}
                            onChangeText={(value) => {
                              setNewDescription(value);
                              setCharacterDescriptionCount(value.length);
                            }}
                            style={styles.input}
                            multiline
                            numberOfLines={5}
                            maxLength={200}
                          />
                          <Text
                            style={
                              {
                                color: 'grey',
                                marginTop: -10,
                                marginBottom: 10,
                              }
                            } >
                            {characterDescriptionCount}/200
                          </Text>

                          <LinearGradient
                            colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 0.7 }}
                            style={styles.modalButton}
                            activeOpacity={0.8}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                handleUpdateStory(item._id);
                                handleShowModal(); // repasse à false
                              }}
                            >
                              <Text style={styles.textButton}>Mettre à jour</Text>
                            </TouchableOpacity>
                          </LinearGradient>

                          <LinearGradient
                            colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 0.7 }}
                            style={styles.modalButton}
                            activeOpacity={0.8}
                          >
                            <TouchableOpacity
                              onPress={handleShowModal} // repasse à false
                            >
                              <Text style={styles.textButton}>Fermer</Text>
                            </TouchableOpacity>
                          </LinearGradient>

                        </View>
                      </Modal>
                    </TouchableWithoutFeedback>

                  </ View>
                </View>

              </TouchableOpacity>
            )}
          />
        </View>
      </KeyboardAvoidingView >
    </TouchableWithoutFeedback>
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
    // borderColor: 'purple',
  },

  storyTitle: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 18,
    paddingHorizontal: 5,
    paddingVertical: 5,
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
    height: 140,

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
    marginVertical: 5,
    width: '100%',
    height: 70,

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

  // contentHidden: { // eye
  //   position: 'absolute',
  //   top: 20,
  //   right: 25,
  //   color: 'lightgrey', // 'rgba(216, 72, 21, 0.8)',
  //   opacity: 0.5,
  //   borderRadius: 50,
  //   padding: 10,
  //   // elevation: 10,
  // },

  // CSS du bouton Modifier + poubelle pour suppr
  buttonCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    marginVertical: 10,
    marginLeft: 10,

    // borderWidth: 1,
    // borderColor: 'red', // 'rgba(238, 236, 232, 1)',
  },

  gradientButton: {
    borderRadius: 10,
  },

  button: {
    paddingVertical: 2,
    paddingHorizontal: 15,
    margin: 10,
  },

  textButton: {
    textAlign: 'center',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white', // 'rgba(55, 27, 12, 0.8)', // #371B0C
  },

  // style de la modale
  modalContainer: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 25,
    margin: 'auto',
  },

  textModal: {
    fontSize: 24,
    fontFamily: 'sans-serif',
    textAlign: 'center',
    margin: 5,
    marginVertical: 25,
    color: "rgba(55, 27, 12, 0.8)",
  },

  input: {
    backgroundColor: "rgba(238, 236, 232, 0.7)",
    paddingLeft: 10,
    paddingVertical: 15,
    marginVertical: 15,
    borderRadius: 5,
    borderBottomWidth: 0.7,
    borderBottomColor: "rgba(55, 27, 12, 0.50)",
    width: "75%",
  },

  modalButton: {
    backgroundColor: "rgba(224, 210, 195, 1)",
    borderRadius: 10,
    width: "50%",
    paddingVertical: 10,
    paddingHorizontal: 5,
    margin: 15,
  },

  iconContainer: {
    top: 5,
    left: 15,
    marginRight: 30,
  },

});
