//    pas importé dans :
// MapScreen
// NewEventScreen
// MyEventsScreen


//   BottomTab visible sur les Screens => globalStyles
//   import { globalStyles } from '../styles/globalStyles';
// NewStoryScreen
// MyPublishedStoriesScreen
// MyCurrentReadingsScreen
// FindStoriesScreen
// ResultResearchStoriesScreen
// ReadStoryScreen
// FavReadingScreen
// FavEventScreen

import { StyleSheet } from 'react-native';


export const globalStyles = StyleSheet.create({

    container: {
        flexDirection: 'column',
        flex: 0.95, // l'écran prend 95% + 5% de barre de nav
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 10,
        // overflow: 'hidden'
    },

    // CSS du titre du Screen
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 40,
        marginTop: 10,
        marginBottom: 15,
    },

    title: {
        fontFamily: 'Poppins-Medium',
        fontWeight: '500',
        fontSize: 28,
        padding: 5,
        color: 'rgba(55, 27, 12, 0.9)', // #371B0C
        flexWrap: 'wrap',
        width: '90%',
    },

    // CSS du chevron pour le goBack
    returnContainer: {
        position: 'absolute',
        top: 10,
        right: 0,
    },


    // // styles à tester

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
        alignItems: 'center',
        width: '100%',
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

})