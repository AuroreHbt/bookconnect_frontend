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
    Modal
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
              <View style={styles.identityApp}>
                <Text style={styles.logo}>Logo</Text>
                <Text style={styles.title}>BookConnect</Text>
              </View>
                <TouchableOpacity onPress={toggleModal} style={styles.iconButton}>
                <FontAwesome name="gear" size={50} color="#a2845e" />
                </TouchableOpacity>
            </View>
              <View style={styles.identityUser}>
                <Image 
                source={require('../assets/avatar.png')} 
                style={styles.avatar} 
                />
              <Text style={styles.welcome}>Hello {user.username}</Text>
            </View>
            <View style={styles.reading}>
              <View style={styles.titleReading}>
                <Text style={styles.textSection}>Mes lectures en cours</Text>
                <FontAwesome name="arrow-right" size={50} color="#a2845e" />
              </View>
                <Text style={styles.carrousel}>Carrousel</Text>
            </View>
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

    identityUser: {

    },

    avatar: {

    },

    welcome: {

    },

    reading: {

    },


});
