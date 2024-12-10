import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native'

export default function StoriesScreen({ navigation }) {

    const handleNewStory = () => {
        navigation.navigate('Histoire', { screen: 'NewStoryScreen' })
    }

    const handleMyPublishedStories = () => {
        navigation.navigate('Histoire', { screen: 'MyPublishedStoriesScreen' })
    }

    const handleMyCurrentReadings = () => {
        navigation.navigate('Histoire', { screen: 'MyCurrentReadingsScreen' })
    }

    const handleFindStories = () => {
        navigation.navigate('Histoire', { screen: 'FindStoriesScreen' })
    }


    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <Image source={require('../assets/LogoBc.png')} style={styles.logo} />

            <View>
                <Text style={styles.title}>Création d'histoires</Text>
            </View>

            <View style={styles.buttonContainer}>

                <TouchableOpacity onPress={handleNewStory} style={styles.button}>
                    <Text style={styles.textButton}>Ajouter une nouvelle histoire</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleMyPublishedStories} style={styles.button}>
                    <Text style={styles.textButton}>Mes histoires postées</Text>
                </TouchableOpacity>

            </View>


            <View>
                <Text style={styles.title}>Histoires à découvrir</Text>
            </View>

            <View>

                <TouchableOpacity onPress={handleMyCurrentReadings} style={styles.button}>
                    <Text style={styles.textButton}>Mes lectures en cours</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleFindStories} style={styles.button}>
                    <Text style={styles.textButton}>Trouver une histoire</Text>
                </TouchableOpacity>

            </View>
        </KeyboardAvoidingView>
    );
};


// attention : le StyleSheet doit bien être en dehors de la fonction!
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    logo: {
        flex: 0.5,
        width: '75%',
        height: '50%',
        marginBottom: 25,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
        marginBottom: 10,
        color: '#371B0C',
    },

    buttonContainer: {
        marginBottom: 25,
    },

    button: {
        backgroundColor: '#D84815',
        borderRadius: 10,
        paddingVertical: 15,
        margin: 15,
        width: '60%',
    },

    textButton: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
