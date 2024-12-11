import { StyleSheet, KeyboardAvoidingView, Platform, Text, View } from 'react-native';

export default function ResultResearchStoriesScreen () {

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <Text>Result Research Stories Screen</Text>
        </KeyboardAvoidingView>
    );
};


// attention : le StyleSheet doit bien être en dehors de la fonction!
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'pink',
        alignItems: 'center',
        justifyContent: 'center',
    },
});