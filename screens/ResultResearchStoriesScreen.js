import {
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Text,
    View,
    FlatList
} from 'react-native';


export default function ResultResearchStoriesScreen({route}) {

    const { stories } = route.params

    console.log("Histoire reçue :", stories);

    const renderStory = ({item}) => (
      <View style={styles.storyContainer}>
        <Text style={styles.storyTitle}>{item.title}</Text>
        <Text style={styles.storyAuthor}>Auteur :{item.author.username}</Text>
        <Text style={styles.storyDesc}>Description :{item.category.username}</Text>
      </View>
    );

  return (
<View style={styles.container}>
    <Text style={styles.title}>Résultat de la recherche</Text>
    <FlatList
              initialScrollIndex={0}
              style={styles.flatlist}
              keyExtractor={(item) => item._id}
              data={stories}
              renderItem={renderStory}
/>
</View>
    )
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