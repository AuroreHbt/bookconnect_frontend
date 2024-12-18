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
        flex: 0.95,
        backgroundColor: 'pink',
        alignItems: 'center',
        justifyContent: 'center',
    },

});