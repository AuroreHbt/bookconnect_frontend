import React, { use, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Checkbox from 'expo-checkbox'

import { useDispatch } from "react-redux";
import * as DocumentPicker from 'expo-document-picker'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_ADDRESS

export default function NewStoryScreen({ navigation }) {
  const dispatch = useDispatch();


  const [title, setTitle] = useState('')
  const [storyFile, setStoryFile] = useState('');
  const [coverImage, setCoverImage] = useState('')
  const [description, setDescription] = useState('')

  const [titleError, setTitleError] = useState("");
  const [fileError, setFileError] = useState("");
  const [descError, setDescError] = useState('')

  const [isAdult, setIsAdult] = useState(false)

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
  let hasError = false
  if (!title) {
    setTitleError('Le titre est obligatoire')
    hasError = true
  } else {
    setTitleError('')
  }

  if (!storyFile) {
    setFileError('Selectionnez un fichiers texte')
    hasError = true
  } else {
    setFileError('')
  }

  if (!description) {
    setFileError('Entrez une description')
    hasError = true
  } else {
    setDescError('')
  }


  if (hasError) return;

  const formData = new FormData();
  formData.append('title', title)
  formData.append('description', description)
  formData.append("isAdult", isAdult)
  formData.append('storyFile', {
    uri: storyFile.uri,
    name: storyFile.name,
    type: storyFile.mimeType
  });
  formData.append("isAdult", isAdult)
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
    if (data.result){
      console.log('Histoire publiée');
      navigation.navigate('MyPublishedStories', { screen: 'MyPublishedStoriesScreen' })
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
      <Image style={styles.logo} source={require("../assets/LogoBc.png")} />
      <View>
        <Text style={styles.title}>Partagez votre histoire</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Titre de votre histoire (obligatoire)"
          onChangeText={(value) => setTitle(value)}
          value={title}
          style={styles.input}
        />
        {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
        <TextInput
        placeholder="Description (obligatoire)"
        onChangeText={(value) => setDescription(value)}
        value={description}
        style={styles.input}
        />
        {descError ? <Text style={styles.errorText}>{descError}</Text> : null}
        <TouchableOpacity style={styles.fileRow} onPress={handleSelectStoryFile}>
          <Text style={styles.fileName}>
            {storyFile ? storyFile.name : "Aucun fichier texte sélectionné"}
          </Text>
          <FontAwesome name="file-text" size={24} color="black" />
        </TouchableOpacity>
        {fileError ? <Text style={styles.errorText}>{fileError}</Text> : null}
        <TouchableOpacity style={styles.fileRow} onPress={handleSelectCoverImage}>
          <Text style={styles.fileName}>
            {coverImage ? coverImage.name : "Aucune image sélectionnée"}
          </Text>
          <FontAwesome name="image" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.checkBoxContainer}>
          <Checkbox value={isAdult} onValueChange={(value) => setIsAdult(value)} color={isAdult ? '#4630EB' : undefined }
          />
          <Text style={styles.textCheckbox}>L'histoire est-elle destinée pour les personnes majeures ?</Text>
        </View>
        <TouchableOpacity
          onPress={handlePostStory}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>Publier</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}



// attention : le StyleSheet doit bien être en dehors de la fonction!
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo :{
    flex: 0.3,
    width: "50%",
    height: "50%"
  },

  title: {
    fontSize: 30,
    marginBottom: 150,
    fontWeight: 'bold',
    color: '#371B0C',
  },

  inputContainer: {
    justifyContent: "center",
    alignItems: 'center',
    width: '50%'
  },

  input: {
    backgroundColor: "#EEECE8",
    padding: 5,
    borderRadius: 5,
    marginVertical: 10,
    width: "100%",
  },

  button: {
    backgroundColor: "#CE5705",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  textButton: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});


