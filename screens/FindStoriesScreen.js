import {
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Text,
    View
} from 'react-native';


export default function FindStoriesScreen() {

    const handleStorySearch = () => {
        navigation.navigate('ResultResearchStories')
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <Text>FindStories Screen</Text>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleStorySearch}
            >
                <Text>Résultats de ma recherche (stories)</Text>
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
});