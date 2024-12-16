import {
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Text,
    View
} from 'react-native';


export default function FavEventScreen() {

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <Text>Mes Events : créés et enregistrés</Text>
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