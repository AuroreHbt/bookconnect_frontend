import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useDispatch } from "react-redux";
import * as DocumentPicker from 'expo-document-picker'
import FontAwesome from 'react-native-vector-icons/FontAwesome'


export default function NewStoryScreen({ navigation }) {
  const dispatch = useDispatch();


  const [title, setTitle] = useState('')
  const [storyFile, setStoryFile] = useState('');
  const [coverImage, setCoverImage] = useState('')

  const handleSelectStoryFile = async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/plain'], 
        copyToCacheDirectory: true
      });

      console.log('Résultat brut pour le texte :', document);

      if (document.type !=='success') {
        console.log('Sélection annulée pour le texte.');
        return;
      }

      
      setStoryFile(document); 
      console.log('Fichier texte sélectionné :', document.name);
    } catch (error) {
      console.error('Erreur lors de la sélection du fichier texte :', error);
    }
  };


const handleSelectCoverImage = async () => {
  try {
    const document = await DocumentPicker.getDocumentAsync({
      type : ['image/jpeg', 'image/png']
    });
    console.log('resultimg', document);

    if (document.type === 'suces') {
      console.log('Image selectionnée:', document.name)
      setCoverImage(document);
    } else {
      console.log("Sélection annulée pour l'image'.")
    }
  } catch (error) {
    console.error('Erreur lors de la sélection du fichier image :', error)
  }

}

const handlePostStory = async () => {
  if (!title || !storyFile) {
    console.log('fichiers texte et titre obligatoire')
    return
  }
  const formData = new FormData();
  formData.append('title')
  formData.append('storyFile', {
    uri: storyFile.uri,
    name: storyFile.name,
    type: storyFile.type
  })

  if (coverImage) {
    formData.append('coverImage', {
      uri: coverImage.uri,
      name: coverImage.name,
      type: coverImage.type
    })
  }

  fetch(`${BACKEND_ADDRESS}/users/stories`, {
    method: "POST",
    body: formData,
  })

    navigation.navigate('MyPublishedStories', { screen: 'MyPublishedStoriesScreen' })
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
        <TouchableOpacity style={styles.fileRow} onPress={handleSelectStoryFile}>
          <Text style={styles.fileName}>
            {storyFile ? storyFile.name : "Aucun fichier texte sélectionné"}
          </Text>
          <FontAwesome name="file-text" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.fileRow} onPress={handleSelectCoverImage}>
          <Text style={styles.fileName}>
            {coverImage ? coverImage.name : "Aucune image sélectionnée"}
          </Text>
          <FontAwesome name="image" size={24} color="black" />
        </TouchableOpacity>
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


