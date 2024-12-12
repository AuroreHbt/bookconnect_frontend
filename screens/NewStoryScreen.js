import React, { useState } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Checkbox from 'expo-checkbox'

// import de la bibliothèque d'icône Fontawsome via react-native-vector-icons
import Icon from 'react-native-vector-icons/FontAwesome';

// https://docs.expo.dev/versions/latest/sdk/font/
// https://docs.expo.dev/develop/user-interface/fonts/
// import pour utliser le hook useFonts pour charger la police
import { useFonts } from 'expo-font';

import { LinearGradient } from 'expo-linear-gradient';

import { useDispatch } from "react-redux";

// import pour accéder aux dossiers du téléphone
import * as DocumentPicker from 'expo-document-picker'

const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_ADDRESS


export default function NewStoryScreen({ navigation }) {

  // utilisation google fonts
  const [fontsLoaded] = useFonts({
    'Girassol-Regular': require('../assets/fonts/Girassol-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
  });

  // vérification du chargement de la font
  if (!fontsLoaded) {
    return null;
  };

  const dispatch = useDispatch();

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



  // fonction qui permet d'accéder au téléphone
  const handleSelectStoryFile = async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "text/plain"],
        copyToCacheDirectory: true,
      });

      console.log("Résultat brut pour le fichier texte :", document);

      // Vérifiez si l'utilisateur a annulé ou si `assets` est vide
      if (document.canceled || !document.assets || document.assets.length === 0) {
        console.log("Annulé par l'utilisateur");
        return;
      }

      const selectedFile = document.assets[0];
      setStoryFile(selectedFile);
      console.log("Fichier texte sélectionné :", selectedFile.name);
    } catch (error) {
      console.error("Erreur lors de la sélection du fichier texte :", error);
    }
  };

  // fonction qui permet d'accéder au téléphone
  const handleSelectCoverImage = async () => {
    try {
      const image = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png", "image/jpg"],
        copyToCacheDirectory: true,
      });

      console.log("Résultat brut pour l'image :", image);

      // Vérifiez si l'utilisateur a annulé ou si `assets` est vide
      if (image.canceled || !image.assets || image.assets.length === 0) {
        console.log("Sélection annulée pour l'image.");
        return;
      }
      const selectedImage = image.assets[0];
      setCoverImage(selectedImage);
      console.log("Image sélectionnée :", selectedImage.name);
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image :", error);
    }
  };

  const handlePostStory = async () => {
    console.log("Titre :", title);
    console.log("Catégorie :", category);
    console.log("Contenu 18+ :", isAdult);
    console.log("Description :", description);
    console.log("Fichier texte :", storyFile);
    console.log("Image de couverture :", coverImage);

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

    if (hasError) return; // early return pour stopper le code

    const formData = new FormData();
    formData.append('author', author)
    formData.append('title', title)
    formData.append('category', category)
    formData.append("isAdult", isAdult ? true : false)
    formData.append('description', description)
    formData.append('storyFile', {
      uri: storyFile.uri,
      name: storyFile.name,
      type: storyFile.mimeType
    });

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
    }).then((response) => response.json())
      .then((data) => {
        console.log("réponse du serveur", data)
        if (data.result) {
          console.log('Histoire publiée');
          navigation.navigate('MyPublishedStories')
        } else {
          console.log('erreur lors de la publication', data.error);
        }
      });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View>
        <Text style={styles.title}>Votre histoire commence ici</Text>
      </View>

      <View style={styles.inputContainer}>

        <View style={styles.titleInputContainer}>
          <TextInput
            placeholder="Titre de votre histoire (obligatoire)"
            onChangeText={(value) => setTitle(value)}
            value={title}
          />
          {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
        </View>

        <View style={styles.titleInputContainer}>
          <TextInput
            placeholder="Type d'histoire (obligatoire)"
            onChangeText={(value) => setCategory(value)}
            value={category}
          />
          {categoryError ? <Text style={styles.errorText}>{categoryError}</Text> : null}
        </View>

        <View style={styles.checkBoxContainer}>
          <Text style={styles.textCheckbox}>
            Contenu 18+
          </Text>
          <Checkbox
            value={isAdult}
            onValueChange={(value) => setIsAdult(value)}
            color={isAdult ? '#rgba(216, 72, 21, 0.8)' : undefined}
            style={styles.checkBox}
          />
        </View>

        <View style={styles.inputMultiline} >
          <TextInput
            placeholder="Description (obligatoire), 250 caractères max"
            maxLength={300}
            multiline
            numberOfLines={7}
            onChangeText={(value) => setDescription(value)}
            value={description}
          />
          {descError ? <Text style={styles.errorText}>{descError}</Text> : null}
        </View>

        <View style={styles.fileContainer}>
          <TouchableOpacity
            onPress={handleSelectStoryFile}
          >
            <Text style={styles.fileInput}>
              {storyFile ? storyFile.name : "Sélectionner un fichier"}
            </Text>

            <Icon
              style={styles.iconContainer}
              name="file-text"
              size={24}
              color={storyFile ? 'rgba(216, 72, 21, 0.9)' : 'rgba(211, 211, 211, 1)'}
            />
          </TouchableOpacity>
          {fileError ? <Text style={styles.errorText}>{fileError}</Text> : null}
        </View>


        <View style={styles.fileContainer}>
          <TouchableOpacity
            onPress={handleSelectCoverImage}
          >
            <Text style={styles.fileInput}>
              {coverImage ? coverImage.name : "Aucune image sélectionnée"}
            </Text>

            <Icon
              style={styles.iconContainer}
              name="image"
              size={24}
              color={storyFile ? 'rgba(216, 72, 21, 0.9)' : '#D3D3D3'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>

        <View>
          <LinearGradient
            colors={['rgba(216, 72, 21, 1)', 'rgba(216, 72, 21, 0.8)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientButton}
          >
            <TouchableOpacity
              onPress={handlePostStory}
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.textButton}>Publier</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View>
          <TouchableOpacity
            onPress={goBack}
            style={styles.returnContainer}
            activeOpacity={0.8}
          >
            <Text style={styles.textReturn}>Retour</Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}


// attention : le StyleSheet doit bien être en dehors de la fonction!
const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'space-evenly',
    marginTop: 50,
    marginBottom: 50,
  },

  title: {
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 28,
    marginBottom: 10,
    color: 'rgba(55, 27, 12, 0.9)', // #371B0C
    maxWidth: '75%',
  },

  inputContainer: {
    alignItems: 'center',
    width: '100%'
  },

  titleInputContainer: {
    backgroundColor: "#EEECE8",
    paddingVertical: 5,
    borderRadius: 5,
    borderBottomWidth: 0.7,
    borderBottomColor: "rgba(55, 27, 12, 0.50)",
    width: "65%",
    paddingLeft: 5,
    margin: 10,
  },

  inputMultiline: {
    backgroundColor: "#EEECE8",
    paddingVertical: 5,
    borderRadius: 5,
    borderBottomWidth: 0.7,
    borderBottomColor: "rgba(55, 27, 12, 0.50)",
    width: "65%",
    paddingLeft: 5,
    margin: 10,
  },

  checkBoxContainer: {
    backgroundColor: "#EEECE8",
    paddingVertical: 5,
    borderRadius: 5,
    width: "65%",
    paddingLeft: 5,
    margin: 10,
  },

  textCheckbox: {
    paddingLeft: 10,
  },

  checkBox: {
    position: 'absolute', // position absolue pour superposer l'icone sur l'input
    top: 5,
    right: 10,
  },

  fileContainer: {
    backgroundColor: "#EEECE8",
    paddingVertical: 5,
    borderRadius: 5,
    width: "65%",
    paddingLeft: 5,
    margin: 10,
  },

  fileInput: {
    paddingLeft: 10,
    height: 30,
  },

  iconContainer: {
    position: 'absolute', // position absolue pour superposer l'icone sur l'input
    top: 3,
    right: 10,
  },

  errorText: {
    textAlign: 'left',
    fontFamily: 'sans-serif',
    fontSize: 16,
    color: 'red',
  },

  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },

  gradientButton: {
    borderRadius: 10,
    width: '40%',
  },

  button: {
    padding: 5,
    margin: 10,
  },

  textButton: {
    textAlign: 'center',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white', // 'rgba(55, 27, 12, 0.8)', // #371B0C
  },

  returnContainer: {
    backgroundColor: 'rgba(224, 210, 195, 0.8)', // "#E0D2C3",
    marginVertical: 35,
    borderRadius: 10,
    padding: 10,
    width: '40%',
  },

  textReturn: {
    textAlign: 'center',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    fontSize: 16,
    color: "rgba(55, 27, 12, 0.7)",
  },

});


