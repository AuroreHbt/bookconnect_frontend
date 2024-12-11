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


export default function NewStoryScreen({ navigation }) {
  const dispatch = useDispatch();

  const [story, setStory] = useState('');
  const [title, setTitle] = useState('')
  const [cover, setCover] = useState('')

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
        <TextInput
          placeholder="Titre de votre histoire (obligatoire)"
          onChangeText={(value) => setTitle(value)}
          value={title}
          style={styles.input}
        />
        <FontAwesome name={iconName} size={size} color={color} />
        <TextInput
          placeholder="Fichier du texte (Obligatoire)"
          onChangeText={(value) => setStory(value)}
          value={story}
          style={styles.input}
        />
        <FontAwesome name={iconName} size={size} color={color} />
        <TextInput
          placeholder="Fichier Image (optionnel)"
          onChangeText={(value) => setCover(value)}
          value={cover}
          style={styles.input}
        />
        <FontAwesome name={iconName} size={size} color={color} />
        <TouchableOpacity
          onPress={() => handlePostStory()}
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
