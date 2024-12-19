import { StyleSheet, TouchableOpacity, Platform, Text, View, FlatList, Image } from 'react-native';
import { useSelector } from 'react-redux';

import { globalStyles } from '../styles/globalStyles';

const defaultImage = require ('../assets/image-livre-defaut.jpg')

export default function FavReadingScreen() {
    const likedStories = useSelector((state) => state.story.value )

    const renderStory = ({ item }) => (<TouchableOpacity
            
            style={styles.storyCard}>
                <Image
                    source={item.coverImage ? { uri: item.coverImage } : defaultImage}
                    style={styles.coverImage}
                />
            <Text style={styles.storyTitle}>{item.title}</Text>
            <Text style={styles.storyCategory}>{item.category}</Text>
            <Text style={styles.storyAuthor}>{item.username}</Text>
        </TouchableOpacity>
    )

    return (
        <View>
        <FlatList
        data={likedStories}
        keyExtractor={(item) => item._id}
        renderItem={renderStory}
        style={styles.flatList}
                            />
                            </View>
    );
};


// attention : le StyleSheet doit bien être en dehors de la fonction!
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEECE8', // Couleur de fond similaire
        padding: 16,
    },

    flatList: {
        marginTop: 20,
    },

    storyCard: {
        backgroundColor: 'rgba(238, 236, 232, 1)', // Couleur de la carte
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(55, 27, 12, 0.1)', // Bordure légère
    },

    coverImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },

    storyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgba(55, 27, 12, 0.9)', // Couleur du texte
        textAlign: 'center',
        marginBottom: 5,
    },

    storyCategory: {
        fontSize: 14,
        color: 'rgba(55, 27, 12, 0.7)',
        textAlign: 'center',
        marginBottom: 5,
    },

    storyAuthor: {
        fontSize: 12,
        color: 'rgba(55, 27, 12, 0.5)', // Couleur plus claire pour l'auteur
        textAlign: 'center',
    },
});