import { StyleSheet, KeyboardAvoidingView, Platform, Text, View } from 'react-native';

export default function StoriesScreen() {

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <Image source={require('../assets/LogoBc.png')} style={styles.logo} />

            <View>
                <Text style={styles.title}>Création d'histoires</Text>
            </View>

            <View style={styles.buttonContainer}>

                <TouchableOpacity onPress={handleSubmitSignUp} style={styles.button}>
                    <Text style={styles.textButton}>Ajouter une nouvelle histoire</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSubmitSignIn} style={styles.button}>
                    <Text style={styles.textButton}>Mes histoires postées</Text>
                </TouchableOpacity>

            </View>


            <View>
                <Text style={styles.title}>Histoires à découvrir</Text>
            </View>

            <View>

                <TouchableOpacity onPress={handleSubmitSignUp} style={styles.button}>
                    <Text style={styles.textButton}>Mes lectures en cours</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSubmitSignUp} style={styles.button}>
                    <Text style={styles.textButton}>Trouver un</Text>
                </TouchableOpacity>

            </View>
        </KeyboardAvoidingView>
    );
};


// attention : le StyleSheet doit bien être en dehors de la fonction!
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'beige',
        alignItems: 'center',
        justifyContent: 'center',
    },

    logo: {
        flex: 0.5,
        width: '75%',
        height: '50%',
    },

    title: {
        fontSize: 36,
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
        marginBottom: 10,
    },

    text: {
        fontSize: 22,
        fontFamily: 'Poppins',
        marginBottom: 50,
    },

    buttonContainer: {
        marginBottom: 25,
    },

    button: {
        backgroundColor: '#D84815',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 35,
        margin: 15,
    },

    textButton: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
