import React, { useState } from "react";

// BottomTab visible sur les Screens => globalStyles
import { globalStyles } from '../styles/globalStyles';

// import de Pressable pour gérer les interactions tactiles (onPress, onLongPress etc)
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable
} from "react-native";

import { useSelector, useDispatch } from "react-redux";

import { addStory } from "../reducers/story";

// import pour créer une case à cocher
import Checkbox from 'expo-checkbox';

// import pour faire un menu déroulant
import { Picker } from '@react-native-picker/picker';

// import pour utiliser le comoposant Icon de la bibliothèque react-native-vector-icons (/FontAwesome)
import Icon from 'react-native-vector-icons/FontAwesome';

// import pour utiliser des dégradés linéaires (x,y)
import { LinearGradient } from 'expo-linear-gradient';

// import pour accéder aux dossiers du téléphone
// https://docs.expo.dev/versions/latest/sdk/document-picker/#using-with-expo-file-system
import * as DocumentPicker from 'expo-document-picker'

// import pour mettre un spinner de chargement lors du press sur le bouton pour le délai d'upload/publication
// https://github.com/SimformSolutionsPvtLtd/react-native-spinner-button/blob/master/README.md
import SpinnerButton from 'react-native-spinner-button';

// composant wrapper pour résoudre cette erreur :
// Warning: A props object containing a "key" prop is being spread into JSX: <Animated(View) key={someKey} {...props} />
const SafeSpinnerButton = React.forwardRef((props, ref) => {
  const { key, ...otherProps } = props;
  return <SpinnerButton ref={ref} {...otherProps} />;
});

const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_ADDRESS


export default function NewStoryScreen({ navigation }) {

  // https://reactnavigation.org/docs/navigation-object/#goback
  const goBack = () => navigation.goBack();


  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [isAdult, setIsAdult] = useState(false);
  const [description, setDescription] = useState('');

  const [storyFile, setStoryFile] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const [titleError, setTitleError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [descError, setDescError] = useState('');
  const [fileError, setFileError] = useState('');

  const [categorySelected, setCategorySelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // variable d'état pour gérer l'état du spinner-button
  const [characterTitleCount, setCharacterTitleCount] = useState(0); // variable d'état pour gérer l'affichage du nombre de caractères pour le titre
  const [characterDescriptionCount, setCharacterDescriptionCount] = useState(0); // variable d'état pour gérer l'affichage du nombre de caractères pour la description


  const user = useSelector((state) => state.user.value)
  const story = useSelector((state) => state.story.value)

  const dispatch = useDispatch();

  const handleSelectStoryFile = async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "text/plain"],
        copyToCacheDirectory: true,
      });
      setIsLoading(true); // Activer le spinner

      console.log("Résultat brut pour le fichier texte :", document);

      // Vérifiez si l'utilisateur a annulé ou si `assets` est vide
      if (document.canceled || !document.assets || document.assets.length === 0) {
        console.log("Annulé par l'utilisateur");
        setIsLoading(false); // Arrêter le spinner
        return;
      }

      const selectedFile = document.assets[0];
      setStoryFile(selectedFile);
      console.log("Fichier texte sélectionné :", selectedFile.name);
    } catch (error) {
      console.error("Erreur lors de la sélection du fichier texte :", error);
    } finally {
      setIsLoading(false); // Arrêter le chargement une fois terminé
    }
  };

  // fonction qui permet d'accéder au téléphone
  const handleSelectCoverImage = async () => {
    try {
      const image = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png", "image/jpg"],
        copyToCacheDirectory: true,
      });
      setIsLoading(true); // Activer le spinner

      console.log("Résultat brut pour l'image :", image);

      // Vérifiez si l'utilisateur a annulé ou si `assets` est vide
      if (image.canceled || !image.assets || image.assets.length === 0) {
        console.log("Sélection annulée pour l'image.");
        setIsLoading(false); // Arrêter le spinner
        return;
      }
      const selectedImage = image.assets[0];
      setCoverImage(selectedImage);
      console.log("Image sélectionnée :", selectedImage.name);
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image :", error);
    } finally {
      setIsLoading(false); // Arrêter le chargement une fois terminé
    }
  };

  const handlePostStory = async () => {
    console.log("Contenu actuel de story :", story);
    console.log("Titre :", title);
    console.log("Catégorie :", category);
    console.log("Contenu 18+ :", isAdult);
    console.log("Description :", description);
    console.log("Fichier texte :", storyFile);
    console.log("Image de couverture :", coverImage);

    // validation des champs :
    let hasError = false

    if (!title) {
      setTitleError('Le titre est obligatoire')
      hasError = true
    } else {
      setTitleError('')
    }

    if (!category) {
      setCategoryError('La catégorie est obligatoire')
      hasError = true
    } else {
      setCategoryError('')
    }

    if (!description) {
      setDescError('La description est obligatoire')
      hasError = true
    } else {
      setDescError('')
    }

    if (!storyFile) {
      setFileError('Selectionnez un fichier texte')
      hasError = true
    } else {
      setFileError('')
    }

    // early return pour stopper le code si des erreurs sont détectées:
    if (hasError) {
      setIsLoading(false); // Désactiver le spinner si erreur
      return;
    }

    setIsLoading(true); // Activer le spinner

    // création de l'objet formData pour l'envoi de fichiers et de données
    const formData = new FormData();
    formData.append('author', user.username)
    formData.append('title', title)
    formData.append('category', category)
    formData.append("isAdult", isAdult ? true : false)
    formData.append('description', description)
    formData.append('storyFile', {
      uri: storyFile.uri,
      name: storyFile.name,
      type: storyFile.mimeType || "application/pdf"
    });

    // ajout de la cover (optionnel)
    if (coverImage) {
      formData.append('coverImage', {
        uri: coverImage.uri,
        name: coverImage.name,
        type: coverImage.mimeType
      })
    }

    fetch(`${BACKEND_ADDRESS}/stories/addstory`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("réponse du serveur", data)
        if (data.result) {
          console.log("data.result: ", data.result)
          dispatch(addStory(data.story))
          // console.log("data.story: ", data.story);

          setTitle('')
          setCategory('')
          setIsAdult(false)
          setDescription('')
          setStoryFile('')
          setCoverImage('')
          setIsLoading(false)
          setCharacterTitleCount(0)
          setCharacterDescriptionCount(0)
          console.log('Histoire publiée avec succès!');
          navigation.navigate('MyPublishedStories')
        } else {
          console.log('erreur lors de la publication', data.error);
        }
      });
  }


  return (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>

        <KeyboardAvoidingView
          style={globalStyles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View>

            {/* Titre + Bouton retour (goBack) */}
            <View style={globalStyles.titleContainer}>
              <Text style={globalStyles.title}>Ma nouvelle histoire</Text>
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

            {/* formulaire pour publier une histoire */}
            <View style={styles.inputContainer}>

              <View style={styles.titleInputContainer}>
                <TextInput
                  placeholder="Titre de votre histoire (obligatoire)"
                  maxLength={55}
                  onChangeText={(value) => {
                    setTitle(value);
                    setCharacterTitleCount(value.length);
                  }}
                  value={title}
                />
              </View>
              <Text
                style={
                  {
                    textAlign: 'right',
                    color: 'grey',
                    marginRight: 25,
                    marginTop: -5,
                    marginBottom: 5,
                  }
                } >
                {characterTitleCount}/55
              </Text>

              {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}

              {/* Catégorie : liste de choix */}
              <View style={styles.pickerContainer}>

                <Pressable
                  style={styles.picker}
                >
                  <Picker
                    prompt="Catégorie (obligatoire)"
                    style={{ color: !categorySelected ? 'grey' : 'black' }}
                    selectedValue={category}
                    // useNativeAndroidPickerStyle={false}
                    onValueChange={(value) => {
                      setCategory(value);
                      setCategorySelected(true);
                      console.log("Catégorie sélectionnée:", value); // Pour debug
                    }}
                    mode="dialog"
                  >
                    <Picker.Item label="Sélectionnez une catégorie" value="" />
                    <Picker.Item label="Autre" value="Autre" />
                    <Picker.Item label="Autobiographie / Biographie" value="Autobiographie / Biographie" />
                    <Picker.Item label="Essai" value="Essai" />
                    <Picker.Item label="Poésie" value="Poésie" />
                    <Picker.Item label="Science Fiction" value="Science Fiction" />
                    <Picker.Item label="Fantasy" value="Fantasy" />
                    <Picker.Item label="Romance" value="Romance" />
                    <Picker.Item label="Policier" value="Policier" />
                    {/* Ajouter d'autres catégories ici */}
                  </Picker>
                </Pressable>
                <Icon
                  style={styles.iconPicker}
                  name="check"
                  size={28}
                  color={categorySelected ? 'rgba(13, 173, 72, 0.8)' : 'rgba(211, 211, 211, 1)'}
                />
              </View>
              {categoryError ? <Text style={styles.errorText}>{categoryError}</Text> : null}

              <View style={isAdult ? styles.checkBoxTrue : styles.checkBoxContainer}>
                <Text style={styles.textCheckbox}>
                  Contenu 18+
                </Text>
                <Checkbox
                  value={isAdult}
                  onValueChange={(value) => setIsAdult(value)}
                  color={isAdult ? '#rgba(13, 173, 72, 0.9)' : undefined}
                />
              </View>

              <View style={styles.inputMultiline} >
                <TextInput
                  placeholder="Description (obligatoire)"
                  maxLength={200}
                  onChangeText={(value) => {
                    setDescription(value);
                    setCharacterDescriptionCount(value.length);
                  }}
                  value={description}
                  multiline
                  numberOfLines={5}
                />
              </View>
              <Text
                style={
                  {
                    textAlign: 'right',
                    color: 'grey',
                    marginRight: 25,
                    marginTop: -5,
                    marginBottom: 5,
                  }
                } >
                {characterDescriptionCount}/200
              </Text>
              {descError ? <Text style={styles.errorText}>{descError}</Text> : null}

              <View style={styles.fileContainer}>
                <TouchableOpacity
                  onPress={handleSelectStoryFile}
                >
                  <Text
                    style={[
                      styles.fileInput &&
                      {
                        color: !storyFile.name ? 'grey' : 'black'
                      }
                    ]}>
                    {storyFile ? storyFile.name : "Choisir un texte (obligatoire)"}
                  </Text>

                  <Icon
                    style={styles.fileIconContainer}
                    name="file-text"
                    size={24}
                    color={storyFile ? 'rgba(13, 173, 72, 0.8)' : 'rgba(211, 211, 211, 1)'}
                  />
                </TouchableOpacity>
              </View>

              {fileError ? <Text style={styles.errorText}>{fileError}</Text> : null}

              <View style={styles.fileContainer}>

                <TouchableOpacity
                  onPress={handleSelectCoverImage}
                >
                  <Text
                    style={[
                      styles.fileInput &&
                      {
                        color: !coverImage.name ? 'grey' : 'black'
                      }
                    ]}>
                    {coverImage ? coverImage.name : "Choisir une image (option)"}
                  </Text>

                  <Icon
                    style={styles.imgIconContainer}
                    name="image"
                    size={24}
                    color={coverImage ? 'rgba(13, 173, 72, 0.8)' : 'rgba(211, 211, 211, 1)'}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Bouton + spinner button */}
            <View style={styles.buttonContainer}>
              <LinearGradient
                colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.7 }}
                style={styles.gradientButton}
              >
                <SpinnerButton
                  isLoading={isLoading}
                  onPress={handlePostStory}
                  indicatorCount={10}
                  spinnerColor='rgba(253,255,0,1)' // "rgba(216, 72, 21, 0.9)"
                  spinnerType="PacmanIndicator"
                  buttonStyle={[styles.button]}
                  animateHeight={32}
                >
                  <Text style={styles.textButton}>Publier</Text>
                </SpinnerButton>
              </LinearGradient>
            </View>

          </View >
        </KeyboardAvoidingView >
      </View>
    </TouchableWithoutFeedback>
  );
}


const styles = StyleSheet.create({

  // CSS à revoir => bug affichage inputs sur emulateur

  // CSS du container du formulaire
  inputContainer: {
    maxWidth: '100%',

    // borderWidth: 1,
  },

  // CSS de l'input title de l'histoire
  titleInputContainer: {
    backgroundColor: "rgba(238, 236, 232, 0.9)",
    paddingTop: 5,
    borderRadius: 5,
    borderBottomWidth: 0.7,
    borderBottomColor: "rgba(55, 27, 12, 0.50)",

    maxWidth: "90%",
    paddingLeft: 15,
    margin: 10,

    // borderWidth: 1,
    // borderColor: "purple",
  },

  // CSS du formulaire : choix de la catégorie
  pickerContainer: {
    flexDirection: 'row',
    backgroundColor: "rgba(238, 236, 232, 0.9)",
    borderRadius: 5,

    maxWidth: "90%",
    margin: 10,

    // borderWidth: 1,
    // borderColor: "red",
  },

  picker: {
    backgroundColor: "rgba(238, 236, 232, 0.9)",
    borderRadius: 5,

    width: "85%",
    paddingLeft: 5,

    // borderWidth: 1,
    // borderColor: "blue",
  },

  pickerText: {
    fontFamily: 'sans-serif',
    fontSize: 16,
  },

  iconPicker: {
    position: 'absolute',
    height: '55%',
    width: '10%',
    top: 10,
    right: 5,

    // borderWidth: 1,
    // borderColor: "yellow",
  },

  iconPickerChecked: {
    color: 'rgba(13, 173, 72, 0.9)',
  },

  // CSS pour contenu 18+
  checkBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "rgba(238, 236, 232, 0.9)",
    paddingVertical: 5,
    paddingRight: 15,
    borderRadius: 5,
    maxWidth: "90%",
    margin: 10,
  },

  checkBoxTrue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: "rgba(34, 179, 89, 0.1)",
    backgroundColor: "rgba(253,255,0, 0.1)",
    paddingVertical: 5,
    paddingRight: 15,
    borderRadius: 5,
    maxWidth: "90%",
    margin: 10,
  },

  textCheckbox: {
    fontFamily: 'sans-serif',
    fontSize: 16,
    paddingLeft: 15,
    color: 'grey',
  },

  checkBox: {
    paddingRight: 10,
    marginRight: 10,
    width: '10%',
  },

  // CSS de l'input multilignes description
  inputMultiline: {
    backgroundColor: "rgba(238, 236, 232, 0.9)",
    paddingVertical: 5,
    borderRadius: 5,
    borderBottomWidth: 0.7,
    borderBottomColor: "rgba(55, 27, 12, 0.50)",
    maxWidth: "90%",
    paddingLeft: 15,
    margin: 10,
  },

  // CSS pour l'upload fichier PDF et img
  fileContainer: {
    justifyContent: 'space-between',
    backgroundColor: "rgba(238, 236, 232, 0.9)", //  #EEECE8
    paddingVertical: 5,
    borderRadius: 5,
    paddingLeft: 15,
    margin: 10,
    maxWidth: "90%",
  },

  fileInput: {
    paddingTop: 5,
    paddingLeft: 10,
    height: 30,
  },

  fileIconContainer: {
    position: 'absolute', // position absolue pour superposer l'icone sur l'input
    top: -3,
    right: 18,
  },

  imgIconContainer: {
    position: 'absolute', // position absolue pour superposer l'icone sur l'input
    top: -3,
    right: 15,
  },

  // CSS des messages d'erreur
  errorText: {
    textAlign: 'left',
    fontFamily: 'sans-serif',
    fontSize: 16,
    color: 'red',
    maxWidth: "85%",
    paddingLeft: 20,
  },

  // CSS du bouton publier avec spinner-button pour le temps de chargement
  buttonContainer: {
    justifyContent: 'center', // Centrer le contenu horizontalement
    alignItems: 'center',
    // width: '50%',
    marginVertical: 20, // Ajoutez un peu d'espace vertical si nécessaire    borderWidth: 1,
    // borderColor: 'blue',
  },

  gradientButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    padding: 25, // Ajustez la hauteur du bouton
    width: '50%', // Largeur du bouton
    // borderWidth: 1,
    // borderColor: 'red',
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10, // Ajustez le padding pour un meilleur espacement
    width: '50%', // Largeur du bouton
    // backgroundColor: 'transparent', // Laissez le fond transparent pour voir le gradient
    position: 'relative', // Position relative pour superposer le spinner
    shadowColor: 'transparent', // Masquer l'ombre
    elevation: 0, // Pour Android

    // borderWidth: 1,
    // borderColor: 'green',
  },

  textButton: {
    textAlign: 'center',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },

});
