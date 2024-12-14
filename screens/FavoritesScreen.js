import {
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Text,
    View
} from 'react-native';


export default function FavoritesScreen({ navigation }) {

    const handleFavReading = () => {
        navigation.navigate('FavReading')
    }

    const handleFavEvent = () => {
        navigation.navigate('FavEvent')
    }


    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <Text>Favorites Screen</Text>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleFavReading}
            >
                <Text>Ma liste de lecture</Text>
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleFavEvent}
            >
                <Text>Mes events favoris</Text>
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