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

  const [story, setStory] = useState('');
  const [title, setTitle] = useState('')
  const [cover, setCover] = useState('')

const handleSelectStoryFile = () => {

}

const handleSelectCoverImage = () => {
  
}

const handlePostStory = () => {
    navigation.navigate('Histoire', { screen: 'MyPublishedStoriesScreen' })
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
      <TouchableOpacity style={styles.iconButton} onPress={handleSelectStoryFile}>
        <FontAwesome name="file-text" size={24} color="black" />
        <Text style={styles.iconText}>
          {storyFile ? storyFile.name : "Choisissez un fichier texte"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton} onPress={handleSelectCoverImage}>
        <FontAwesome name="image" size={24} color="black" />
        <Text style={styles.iconText}>
          {coverImage ? coverImage.name : "Choisissez une image"}
        </Text>
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
});
