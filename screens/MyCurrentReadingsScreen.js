import { StyleSheet, KeyboardAvoidingView, Platform, Text, View } from 'react-native';

export default function MyCurrentReadingsScreen() {

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <Text>My Current Readings Screen</Text>
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