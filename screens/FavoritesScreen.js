import React from 'react';

// Barre de nav => bottomTabStyles
import { bottomTabStyles } from '../styles/bottomTabStyles';

import { LinearGradient } from 'expo-linear-gradient';

import {
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Text,
    Image,
    View,
} from 'react-native';


export default function FavoritesScreen({ navigation }) {

    const handleFavReading = () => {
        navigation.navigate('FavReading')
    }

    const handleFavEvent = () => {
        navigation.navigate('FavEvent')
    }


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={bottomTabStyles.container}>

            <Image
                source={require('../assets/LogoBc.png')}
                style={bottomTabStyles.logo}
            />

            <View>
                <Text style={bottomTabStyles.title}>Mes favoris ♥</Text>
            </View>

            <View style={bottomTabStyles.buttonContainer}>
                <LinearGradient
                    colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 0.7 }}
                    style={bottomTabStyles.gradientButton}
                    activeOpacity={0.8}
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleFavReading}
                        style={bottomTabStyles.button}
                    >
                        <Text style={bottomTabStyles.textButton}>Ma liste de lecture</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>

            <View style={bottomTabStyles.buttonContainer}>
                <LinearGradient
                    colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 0.7 }}
                    style={bottomTabStyles.gradientButton}
                    activeOpacity={0.8}
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleFavEvent}
                        style={bottomTabStyles.button}
                    >
                        <Text style={bottomTabStyles.textButton}>Mes events favoris</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>

        </KeyboardAvoidingView>
    );
};
