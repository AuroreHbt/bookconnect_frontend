import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Modal,
    SafeAreaProvider
  } from 'react-native';



export default function DashboardScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [isParameterVisible, setIsParameterVisible] = useState(false);

  const toggleParameter = () => {
    setIsParameterVisible(!isParameterVisible);
  };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} >
            <View style={styles.header}>

                {/* Logo et Nom de l'app */}
              <View style={styles.identityApp}>
                <Text style={styles.logo}>Logo</Text>
                <Text style={styles.title}>BookConnect</Text>

                {/* Icône Paramètre */}
              </View>
                <TouchableOpacity onPress={toggleModal} style={styles.ParameterButton}>
                <FontAwesome name="gear" size={50} color="#a2845e" />
                </TouchableOpacity>
            </View>

            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isParameterVisible}
                onRequestClose={toggleParameter}
      >
                 <View style={styles.ParameterOverlay}>
                    <View style={styles.ParameterContent}>
                    <Text style={styles.ParameterTitle}>Paramètres</Text>

            {/* Options de paramètres */}
            <TouchableOpacity style={styles.optionButton}>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>Modifier ma photo de profil</Text>
            </TouchableOpacity>
              <Text style={styles.optionText}>Modifier mon username</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>Modifier mon email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>Modifier mon mot de passe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>Déconnexion</Text>
            </TouchableOpacity>

            {/* Bouton Fermer */}
            <TouchableOpacity onPress={toggleParameter} style={styles.closeButton}>
              <FontAwesome name="cross" size={30} color="#a2845e" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

              {/* Photo de profil et Message de bienvenue */}
              <View style={styles.identityUser}>
                <Image 
                source={require('../assets/avatar.png')} 
                style={styles.avatar} 
                />
              <Text style={styles.welcome}>Hello {user.username}</Text>
            </View>

            {/* Section carrousel mes lectures en cours */}
            <View style={styles.reading}>
              <View style={styles.titleReading}>
                <Text style={styles.textSection}>Mes lectures en cours</Text>
                <FontAwesome name="arrow-right" size={50} color="#a2845e" />
              </View>
                <Text style={styles.carrousel}>Carrousel</Text>
            </View>

            {/* Section carrousel mes évenements plannifiés*/}
            <View style={styles.event}>
              <View style={styles.titleEvent}>
                <Text style={styles.textSection}>Mes évènements</Text>
                <FontAwesome name="arrow-right" size={50} color="black" />
              </View>
                <Text style={styles.calendrier}>Calendrier</Text>
            </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
};


// attention : le StyleSheet doit bien être en dehors de la fonction!
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },

    header: {

    },

    identityApp: {

    },

    logo: {

    },

    title: {
        fontSize: 24,
    },

    ParameterButton: {
        padding: 10,
      },

    identityUser: {

    },

    avatar: {

    },

    welcome: {

    },

    reading: {

    },

    titleReading: {

    },

    textSection: {

    },

    event: {

    },

    titleEvent: {

    },

    ParameterOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      ParameterContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        elevation: 10,
      },
      ParameterTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      optionButton: {
        padding: 10,
        marginVertical: 5,
        width: '100%',
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
        alignItems: 'center',
      },
      optionText: {
        fontSize: 16,
        color: 'black',
      },
      closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
      },
      closeButtonText: {
        color: 'black',
        fontSize: 16,
      },
});