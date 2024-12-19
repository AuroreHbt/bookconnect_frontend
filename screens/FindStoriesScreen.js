import React, { useEffect, useState } from "react";

import {
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
    Text,
    TextInput,
    View,
    Pressable,
    FlatList,
    Image
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { globalStyles } from '../styles/globalStyles'

import { LinearGradient } from 'expo-linear-gradient';

import Icon from 'react-native-vector-icons/FontAwesome';

const defaultImage = require('../assets/image-livre-defaut.jpg')


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

   

    const goBack = () => navigation.goBack();

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

                    // reset des champs de recherche
                    setTitle('');
                    setAuthor('');
                    setCategory('');
                    setCategorySelected('');

                    // Navigation vers l'écran ResultResearchStories et affichage des résultats
                    navigation.navigate('ResultResearchStories', { stories: data.stories });
                }
            });
    };

    useEffect(() => {
        fetch(`${BACKEND_ADDRESS}/stories/allstories`)
            .then((response) => response.json())
            .then((data) => {
                if (data.result) {
                    setAllStories(data.stories)
                }
            })
    }, []);

    const handleRandomStory = () => {
        console.log('click2')
        if (allStories.length > 1) {
            let randomIndex = Math.floor(Math.random() * allStories.length);
            while (allStories[randomIndex]._id === lastStoryId) {
                randomIndex = Math.floor(Math.random() * allStories.length)
            }
            const newRandomStory = allStories[randomIndex];
            console.log("histoire", newRandomStory);
            setRandomStory(newRandomStory);
            setLastStoryId(newRandomStory._id)
            navigation.navigate("ReadStory", { story: newRandomStory })
        }
    }

    useEffect(() => {
        fetch(`${BACKEND_ADDRESS}/stories/laststories`)
            .then((response) => response.json())
            .then((data) => {
                if (data.result) {
                    setAllStories(data.stories)
                }
            })
    }, []);

    const renderStory = ({ item }) => (<TouchableOpacity
        onPress={() => navigation.navigate("ReadStory", { story: item })}
        style={styles.storyCard}>
        <Image
            source={item.coverImage ? { uri: item.coverImage } : defaultImage}
            style={styles.coverImage}
        />
        <Text style={styles.storyTitle}>{item.title}</Text>
        <Text style={styles.storyCategory}>{item.category}</Text>
        <Text style={styles.storyAuthor}>{item.author.username}</Text>
    </TouchableOpacity>
    )


    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                    <View style={styles.titlePageContainer}>
                        <Text style={styles.titlePage} >Rechercher une histoire</Text>
                        <TouchableOpacity
                            onPress={goBack}
                            activeOpacity={0.8}
                        >
                            <Icon
                                style={styles.returnContainer}
                                name="chevron-circle-left"
                                size={32}
                                color='rgba(55, 27, 12, 0.3)'
                            />
                        </TouchableOpacity>
                    </View>
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
                                    prompt="Choisir une catégorie"

                                    selectedValue={category}
                                    onValueChange={(value) => { setCategory(value); setCategorySelected(value) }}
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
                    <FlatList
                        data={allStories}
                        keyExtractor={(item) => item._id}
                        renderItem={renderStory}
                        style={styles.flatList}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />

                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
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

    titlePageContainer: {
        position: 'absolute',
        top: 50,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',

    },

    titlePage: {
        fontWeight: 'bold',
        fontSize: 28,
        color: 'rgba(55, 27, 12, 0.9)',
        flex: 1
    },



    inputContainer: {
        alignItems: 'center',
        width: '90%',
        marginTop: 150,
    },

    input: {
        backgroundColor: "#EEECE8",
        paddingVertical: 5,
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
        borderRadius: 10,
        margin: 10,
        width: '55%',
    },

    button: {
        padding: 8,
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
        marginTop: 20,
        maxHeight: 250
    },

    flatListContainer: {
        alignItems: 'center',
    },

    coverImage: {
        width: 150,
        height: 150,
        borderRadius: 10

    },

    storyCard: {

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

    storyCategory: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5
    },

    storyAuthor: {
        fontSize: 10,
        fontWeight: 'bold'
    }
});
