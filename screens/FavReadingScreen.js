import { StyleSheet, TouchableOpacity, Platform, Text, View, FlatList, Image, KeyboardAvoidingView } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { globalStyles } from '../styles/globalStyles';
import { useState } from "react";
import { addLike, removeLike } from "../reducers/story";


import Icon from "react-native-vector-icons/FontAwesome";


const defaultImage = require ('../assets/image-livre-defaut.jpg')


export default function FavReadingScreen({navigation, route}) {

    const likedStories = useSelector((state) => state.story.value )

    const user = useSelector((state) => state.user.value);

    const { stories: initialStories = [] } = route.params || {};
    const [stories, setStories] = useState(initialStories)

    const [isVisible, setIsVisible] = useState(false);

    const goBack = () => navigation.goBack();

    const dispatch = useDispatch();

  const handleLike = (story) => {
    // Met à jour isLiked pour l'histoire cliquée
    const updatedStory = { ...story, isLiked: !story.isLiked };

    setStories((prevStories) =>
      prevStories.map((currentStory) =>
        currentStory._id === story._id ? updatedStory : currentStory
      )
    );
    // Envoie l'action appropriée à Redux
    if (updatedStory.isLiked) {
      dispatch(addLike(updatedStory));
    } else {
      dispatch(removeLike(updatedStory._id));
    }
    console.log("état isLiked", updatedStory);
  };

  const handleShowContent = () => {
    setIsVisible(!isVisible);
  };



    return (
        <KeyboardAvoidingView
              style={globalStyles.container}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View>
                {/* Titre + Bouton retour (goBack) */}
                <View style={globalStyles.titleContainer}>
                  <Text style={globalStyles.title}>Lectures favorites</Text>
                  <TouchableOpacity onPress={goBack} activeOpacity={0.8}>
                    <Icon
                      style={globalStyles.returnContainer}
                      name="chevron-circle-left"
                      size={32}
                      color="rgba(55, 27, 12, 0.3)"
                    />
                  </TouchableOpacity>
                </View>
        
                {/* Affichage des histoires publiées */}
                <FlatList
                  initialScrollIndex={0}
                  keyExtractor={(item) => item._id}
                  // data={stories}
                  data={likedStories}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => navigation.navigate("ReadStory", { story: item })} // Navigation avec paramètres
                    >
                      <View style={styles.storyCard}>
                        {/* affichage des infos venant de addNewStory */}
                        <View style={styles.headContent}>
                          <View>
                            <Text style={styles.storyTitle}>{item.title}</Text>
                          </View>
                          <View>
                            <TouchableOpacity onPress={() => handleLike(item)}>
                              <Icon
                                style={styles.likeButton}
                                name={item.isLiked ? "heart" : "heart-o"}
                                size={26}
                                color={item.isLiked ? "red" : "rgba(55, 27, 12, 0.3)"}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={styles.contentCard}>
                          <View>
                            <Text style={styles.storyPublic}>
                              {item.isAdult ? "Contenu 18+" : "Tout public"}
                            </Text>
                            <Text style={styles.storyCategory}>
                              {"Catégorie: " + item.category}
                            </Text>
                            <Text style={styles.storyDescription}>
                              {"Résumé: " + item.description}
                            </Text>
                          </View>
        
                          <View style={styles.imageContainer}>
                                              {/* affichage du fichier image téléchargé */}
                                                <Image
                                                source={item.coverImage ? { uri: item.coverImage } : defaultImage}
                                                  style={
                                                    item.isAdult // isAdult=true (18+)
                                                      ? [
                                                          styles.coverImageAdult,
                                                          { width: 130, height: 115 },
                                                        ]
                                                      : [styles.coverImage, { width: 130, height: 115 }]
                                                  }
                                                  blurRadius={item.isAdult ? 10 : 0}
                                                />
                                              <TouchableOpacity onPress={handleShowContent}>
                                                {item.coverImage && (
                                                  <Text style={item.isAdult ? styles.showContent : null}>
                                                    Contenu sensible
                                                  </Text>
                                                )}
                                              </TouchableOpacity>
                                            </View>
                                          </View>
                                          <View style={styles.buttonCard}></View>
                                        </View>
                                      </TouchableOpacity>
                                    )}
                                  />
                                </View>
                              </KeyboardAvoidingView>
                            );
                          }
                          


// attention : le StyleSheet doit bien être en dehors de la fonction!
const styles = StyleSheet.create({
    storyCard: {
      backgroundColor: "rgba(238, 236, 232, 1)", // "#EEECE8",
      padding: 10,
      marginBottom: 15,
      borderRadius: 8,
      width: "100%",
      // marginLeft: 10,
  
      borderWidth: 1,
      borderColor: "rgba(55, 27, 12, 0.1)",
      // elevation: 0,
    },
  
    headContent: {
      flexDirection: "row",
      width: "100%",
    },
  
    storyTitle: {
      fontFamily: "Poppins-Regular",
      fontWeight: "400",
      fontSize: 18,
      padding: 5,
      marginBottom: 15,
      flexWrap: "wrap",
      borderBottomWidth: 0.5,
      borderBottomColor: "rgba(55, 27, 12, 0.5)",
    
    },
  
    // CSS infos story + cover
    contentCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      padding: 10,
  
      // borderWidth: 1,
    },
  
    storyPublic: {
      fontSize: 16,
      fontWeight: "bold",
      paddingHorizontal: 5,
      marginTop: 10,
      width: "100%",
  
      // borderWidth: 1,
      // borderColor: 'purple',
    },
  
    storyCategory: {
      fontSize: 18,
      paddingHorizontal: 5,
      marginVertical: 5,
      width: "100%",
      height: 70,
  
      // borderWidth: 1,
      // borderColor: 'red',
    },
  
    storyDescription: {
      fontSize: 16,
      paddingHorizontal: 5,
      marginVertical: 5,
      textAlign: "justify",
      maxWidth: "100%",
      flexWrap: "wrap",
  
      // borderWidth: 1,
      // borderColor: 'purple',
    },
  
    // CSS des couvertures
    imageContainer: {
      position: "absolute",
      top: 0,
      right: 5,
      width: "36%",
      height: 115,
      // borderWidth: 1,
      // borderColor: 'blue',
    },
  
    likeButton: {
      top: 0,
      position: "absolute",
      right: 0,
      padding: 5,
      alignItems: "center",
      justifyContent: "center",
    },
  
    coverImage: {
      borderRadius: 10,
      borderWidth: 0.5,
      borderColor: "rgba(55, 27, 12, 0.5)",
    },
  
    coverImageAdult: {
      borderRadius: 10,
      borderWidth: 0.6,
      borderColor: "rgba(255, 123, 0, 0.5)",
      backgroundColor: "rgba(0, 0, 0, 1)",
      opacity: 0.2,
    },
  
    showContent: {
      position: "absolute",
      top: -65,
      right: 7,
      backgroundColor: "rgba(253,255,0, 1)",
      textAlign: "center",
    },
  
    // CSS du bouton Modifier + poubelle pour suppr
    buttonCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
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
      textAlign: "center",
      fontFamily: "sans-serif",
      fontWeight: "bold",
      fontSize: 16,
      color: "white", // 'rgba(55, 27, 12, 0.8)', // #371B0C
    },
  
    iconContainer: {
      top: 5,
      left: 15,
      marginRight: 30,
    },
  });