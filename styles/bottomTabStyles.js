// TAB = Dashboard => style dans son fichier

//   Barre de nav => bottomTabStyles
//   import { bottomTabStyles } from '../styles/bottomTabStyles';
// TAB = Events
// TAB = Storis
// TAB = Favorites

import { StyleSheet } from 'react-native';


export const bottomTabStyles = StyleSheet.create({
    container: {
        flex: 0.95,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: 100,
        marginBottom: 100,
    },

    logo: {
        flex: 0.5,
        width: '50%',
        height: '50%',
    },

    title: {
        fontFamily: 'Poppins-Medium',
        fontWeight: '500',
        fontSize: 22,
        marginTop: 10,
        color: 'rgba(55, 27, 12, 0.9)', // #371B0C
    },

    inputContainer: {
        alignItems: 'center',
        width: '90%'
    },

    input: {
        backgroundColor: "#EEECE8",
        paddingVertical: 5,
        borderRadius: 5,
        borderBottomWidth: 0.7,
        borderBottomColor: "rgba(55, 27, 12, 0.50)",
        width: "75%",
        paddingLeft: 15,
        margin: 10,
    },

    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },

    gradientButton: {
        borderRadius: 15,
        width: '60%',
    },

    button: {
        padding: 15,
        margin: 5,
    },

    textButton: {
        textAlign: 'center',
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white', // 'rgba(55, 27, 12, 0.8)', // #371B0C
    },

    textReturn: {
        fontFamily: 'Poppins-Regular',
        fontWeight: '300',
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(55, 27, 12, 0.80)",
        color: "rgba(55, 27, 12, 0.80)",
    },

    errorText: {
        textAlign: 'left',
        fontFamily: 'sans-serif',
        fontSize: 16,
        color: 'red',
        width: '75%',
    },

});