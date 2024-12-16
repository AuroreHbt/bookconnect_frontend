import {
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Text,
    View
} from 'react-native';


export default function FindStoriesScreen({navigation}) {

    const handleStorySearch = () => {
        navigation.navigate('ResultResearchStories')
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <Text>FindStories Screen</Text>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleStorySearch}
                style={styles.button}
            >
                <Text style={styles.textButton}>Résultats de ma recherche (stories)</Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>
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

    button: {
        alignItems: 'center',
        backgroundColor: 'purple',
        borderRadius: 15,
        width: '50%',
        padding: 10,
        margin: 10,
    },

    textButton: {
        textAlign: 'center',
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white', // 'rgba(55, 27, 12, 0.8)', // #371B0C
    },

});