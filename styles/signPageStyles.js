//  import { signPageStyles } from '../styles/signPageStyles';
// SignUpScreen
// SignIn Screen

import { StyleSheet } from 'react-native';


export const signPageStyles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'space-evenly',
        marginTop: 100,
        marginBottom: 100,
    },

    logo: {
        flex: 0.5,
        width: "50%",
        height: "50%",
    },

    title: {
        fontFamily: 'Asul-Bold',
        fontWeight: '700',
        fontSize: 32,
        marginBottom: 5,
        color: 'rgba(55, 27, 12, 0.9)', // #371B0C
    },

    separator: {
        width: '25%',
        borderColor: 'rgba(55, 27, 12, 0.98)', // #371B0C
        borderTopWidth: 2.5,
        marginBottom: 35,
        marginTop: 10,
    },

    inputPwd: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
        width: '100%' // 100% de la largeur de inputContainer
    },

    iconContainer: {
        position: 'absolute', // position absolue pour superposer l'icone sur l'input
        justifyContent: 'center',
        top: 0,
        bottom: 0,
        right: 60,
    },

    inputContainer: {
        alignItems: 'center',
        width: '90%'
    },

    input: {
        backgroundColor: "#EEECE8",
        paddingVertical: 15,
        borderRadius: 5,
        borderBottomWidth: 0.7,
        borderBottomColor: "rgba(55, 27, 12, 0.50)",
        width: "75%",
        paddingLeft: 15,
        margin: 10,
    },

    buttonContainer: {
        marginTop: 15,
        marginBottom: 10,
        width: '75%',
        alignItems: 'center',
    },

    gradientButton: {
        borderRadius: 15,
        marginVertical: 10,
        width: '65%',
    },

    button: {
        padding: 5,
        margin: 10,
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
