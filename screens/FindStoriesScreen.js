import React, { useEffect, useState } from "react";
import {
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    View,
    Pressable
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { LinearGradient } from 'expo-linear-gradient';



const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_ADDRESS;

export default function FindStoriesScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [stories, setStories] = useState([]);

    const [categorySelected, setCategorySelected] = useState('');
    const [category, setCategory] = useState('');

    const [allStories, setAllStories] = useState([]);
    const [randomStory, setRandomStory] = useState(null);
    const [lastStoryId, setLastStoryId] = useState([])


    // Fonction pour effectuer une recherche d'histoire

    // requête fetch vers le backend
    const handleStorySearch = () => {
        console.log('click');
        

        const query = `?${title ? `title=${title}` : ''}${author ? `&author=${author}` : ''}${category ? `&category=${category}` : ''}`;
    
        fetch(`${BACKEND_ADDRESS}/stories/search${query}`)
            .then((response) => response.json()) 
            .then((data) => {
                console.log('api', data);
                
                // Si réponse positive du backend
                if (data.result) {
                    setStories(data.stories); 
                    console.log('donnée', data.stories);
                    
                    // Navigation vers l'écran ResultResearchStories et affichage des résultats
                    navigation.navigate('ResultResearchStories', { stories: data.stories }); 
                }
            });
    };

    useEffect(() => {
        fetch(`${BACKEND_ADDRESS}/stories/allstories`)
        .then ((response) => response.json())
        .then ((data) => {
            if (data.result) {
                setAllStories(data.stories)
            }
        })
 }, []);

    const handleRandomStory  = () => {
        if (allStories.length > 1) {
            let randomIndex = Math.floor(Math.random() * allStories.length);
            while (allStories[randomIndex]._id === lastStoryId) {
                randomIndex = Math.floor(Math.random() * allStories.length)
            }
            const newRandomStory = allStories[randomIndex];
            setRandomStory(newRandomStory);
            setLastStoryId(newRandomStory._id)
            navigation.navigate("ReadStory", {story: newRandomStory})
        }
    }


    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <View style={styles.inputContainer}>
                <View style={styles.input}>
                    <TextInput
                        placeholder="Titre de l'histoire"
                        onChangeText={(value) => setTitle(value)}
                        value={title}
                    />
                </View>

                <View style={styles.input}>
                    <TextInput
                        placeholder="Nom de l'auteur"
                        onChangeText={(value) => setAuthor(value)}
                        value={author}
                    />
                </View>
                <View style={styles.pickerContainer}>
                <Pressable
              style={styles.picker}
            >
              <Picker
                selectedValue={category}
                onValueChange={(value) => { setCategory(value); setCategorySelected(value) }}
              >
                <Picker.Item label="Autre" value="autre" />
                <Picker.Item label="Autobiographie / Biographie" value="bio" />
                <Picker.Item label="Essai" value="essai" />
                <Picker.Item label="Poésie" value="poesie" />
                <Picker.Item label="Science-Fiction" value="sci-fi" />
                <Picker.Item label="Fantasy" value="fantasy" />
                <Picker.Item label="Romance" value="romance" />
                <Picker.Item label="Policier" value="policier" />
                {/* Ajouter d'autres catégories ici */}
              </Picker>
            </Pressable>
            </View>
            </View>

            <View style={styles.buttonGroup}>
                <LinearGradient
                            colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 0.7 }}
                            style={styles.gradientButton}
                          >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleStorySearch}
                    style={styles.button}
                >
                    <Text style={styles.textButton}>Rechercher</Text>
                </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                            colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 0.7 }}
                            style={styles.gradientButton}
                          >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleRandomStory}
                    style={styles.button}
                >
                    <Text style={styles.textButton}>Histoire aléatoire</Text>
                </TouchableOpacity>
                </LinearGradient>
            </View>

            
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'space-evenly',
        marginTop: 50,
        marginBottom: 50,
    },

    inputContainer: {
        alignItems: 'center',
        width: '90%',
        marginTop: 150,
    },

    input: {
        backgroundColor: "#EEECE8",
        paddingVertical: 10,
        borderRadius: 5,
        borderBottomWidth: 0.7,
        borderBottomColor: "rgba(55, 27, 12, 0.50)",
        width: "75%",
        paddingLeft: 15,
        margin: 10,
    },

    pickerContainer: {
        flexDirection: 'row',
        backgroundColor: "rgba(238, 236, 232, 0.9)",
        borderRadius: 5,
    
        maxWidth: "90%",
        margin: 10,
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
        color: 'rgba(211, 211, 211, 1)',
        height: '55%',
        width: '10%',
        top: 10,
        right: 5,
    
        // borderWidth: 1,
        // borderColor: "yellow",
      },

    buttonGroup: {
        width: '100%',
        alignItems: 'center',
        margin: 10
    },

    gradientButton: {
        borderRadius: 15,
        margin: 10,
        width: '60%',
    },

    button: {
        padding: 15,
        margin: 5,
    },


    textButton: {
        textAlign: 'center',
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white',
    },

    flatList: {
        
    },

    flatListContainer: {
        alignItems: 'center',
    },

    storyCard: {
        backgroundColor: '#EEECE8',
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    storyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgba(55, 27, 12, 0.9)',
    },
});
