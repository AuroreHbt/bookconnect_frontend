import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";


const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_ADDRESS;

export default function MyPublishedStoriesScreen({navigation}) {
  const [stories, setStories] = useState([]); //hook d'état pour stocker les histoires publiées
  const user = useSelector((state) => state.user.value); // Informations recupérées depuis le store

  useEffect(() => {
    fetch(`${BACKEND_ADDRESS}/stories/mypublishedstory/${user.username}`)
      .then((response) => response.json())
      .then((data) =>
        { console.log("Histoires recues :", data.stories)
          setStories(data.stories)
  }); // Mettre à jour l'etat avec les données des histoires
  }, [user.username]); // Actualisation sur l'utilisateur en cas de changement


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes oeuvres</Text>
      <FlatList
        keyExtractor={(item) => item._id}
        data={stories}
        renderItem={({ item }) => (
          <TouchableOpacity
          onPress={() => {
            console.log("Histoire sélectionnée :", item);
            navigation.navigate("ReadStory", { story: item });
          }}
          >
          <View style={styles.storyCard}>
            <View style={styles.leftRectangle}>
            <Text style={styles.storyTitle}>{item.title}</Text>
            <Text style={styles.storyCategory}>{item.category}</Text>
            <Text style={styles.storyDescription}>{item.description}</Text>
            </View>
            {item.coverImage && (
            <Image
              style={styles.coverImage}
              source={{ uri: item.coverImage }}
            />
  )}
          </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container : {
flex: 1,
padding: 20
    },

    title : {
        fontSize: 24,
        marginBottom: 20
    },

    storyCard : {
        flexDirection: 'row',
        backgroundColor: "#EEECE8", 
    padding: 10, 
    marginBottom: 15, 
    borderRadius: 8, 
    alignItems: 'center'
    },

    leftRectangle : {
        flex: 1,
        justifyContent: 'space-between'
    },

    storyTitle : {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5
    },

storyCategory : {
    fontSize: 16,
    marginBottom: 12,
    
},

    storyDescription : {
        fontSize: 14,
        marginTop: 12
    },

    coverImage : {
        flex : 1,
        height: 100,
        borderRadius : 10
    }
});
