import { StyleSheet, KeyboardAvoidingView, Platform, Text, View } from 'react-native';

export default function ReadStoryScreen() {

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <Text>Read Story Screen</Text>
            <Text>attention à la MAJUSCULE!!</Text>
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