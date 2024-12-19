import React from 'react';

import { StyleSheet, View } from 'react-native';

// Imports pour la nested navigation (stack + tab)
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import pour les icones
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Import des Screens pour la nav
import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen';
import DashboardScreen from './screens/DashboardScreen';

import EventsScreen from './screens/EventsScreen'; // accueil Events
import MapScreen from './screens/MapScreen'; // Events > resultat de la recherche d'events par ville
import MyEventsScreen from './screens/MyEventsScreen' // Events > Mes evenements
import NewEventScreen from './screens/NewEventScreen'; // MyEvents ? > ajout d'un newEvent

import StoriesScreen from './screens/StoriesScreen'; // accueil Stories
import NewStoryScreen from './screens/NewStoryScreen'; // Stories > ajout d'une story
import MyPublishedStoriesScreen from './screens/MyPublishedStoriesScreen'; // Stories > voir mes stories postées
import MyCurrentReadingsScreen from './screens/MyCurrentReadingsScreen'; // Stories > mes lectures en cours

import FindStoriesScreen from './screens/FindStoriesScreen'; // Stories > Découvrir des histoires
import ResultResearchStoriesScreen from './screens/ResultResearchStoriesScreen'; // FindStoriesScreen > Results
import ReadStoryScreen from './screens/ReadStoryScreen'; // Lecture d'une story depuis n'importe quel Screen

import FavoritesScreen from './screens/FavoritesScreen'; // accueil Favoris
import FavReadingScreen from './screens/FavReadingScreen'; // Favoris > Ma liste de lecture
import FavEventScreen from './screens/FavEventScreen'; // Favoris > Mes events favoris

// Imports pour configurer le store redux
import user from './reducers/user';
import story from './reducers/story';
import event from './reducers/event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// https://docs.expo.dev/versions/latest/sdk/font/
// https://docs.expo.dev/develop/user-interface/fonts/
// import pour utliser le hook useFonts pour charger la police
import { useFonts } from 'expo-font';
// import pour empecher le rendu de l'appli tant que la font n'est pas chargée et prête
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';


SplashScreen.preventAutoHideAsync();

const store = configureStore({
  reducer: { user, story, event },
})

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const DashboardStack = createNativeStackNavigator();
const EventsStack = createNativeStackNavigator();
const StoriesStack = createNativeStackNavigator();
const FavoritesStack = createNativeStackNavigator();


function DashboardStackNavigator() {
  return (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
      <DashboardStack.Screen name="Profile" component={DashboardScreen} />
      <DashboardStack.Screen
        name="MyCurrentReadings"
        component={MyCurrentReadingsScreen}
      />
      <DashboardStack.Screen
        name="MyEvents"
        component={MyEventsScreen}
      />
    </DashboardStack.Navigator>
  )
}

function EventsStackNavigator() {
  return (
    <EventsStack.Navigator screenOptions={{ headerShown: false }}>
      <EventsStack.Screen name="Events" component={EventsScreen} />

      <EventsStack.Screen
        name="Map"
        component={MapScreen}
      />
      <EventsStack.Screen
        name="MyEvents"
        component={MyEventsScreen}
      />
      <EventsStack.Screen
        name="NewEvent"
        component={NewEventScreen}
      />
    </EventsStack.Navigator>
  )
}

function StoriesStackNavigator() {
  return (
    <StoriesStack.Navigator screenOptions={{ headerShown: false }}>
      <StoriesStack.Screen name="Stories" component={StoriesScreen} />
      <StoriesStack.Screen
        name="NewStory"
        component={NewStoryScreen}
      />
      <StoriesStack.Screen
        name="MyPublishedStories"
        component={MyPublishedStoriesScreen}
      />
      <StoriesStack.Screen
        name="MyCurrentReadings"
        component={MyCurrentReadingsScreen}
      />
      <StoriesStack.Screen
        name="FindStories"
        component={FindStoriesScreen}
      />
      <StoriesStack.Screen
        name="ResultResearchStories"
        component={ResultResearchStoriesScreen}
      />
      <StoriesStack.Screen
        name="ReadStory"
        component={ReadStoryScreen}
      />
    </StoriesStack.Navigator>
  );
}

function FavoritesStackNavigator() {
  return (
    <FavoritesStack.Navigator screenOptions={{ headerShown: false }}>
      <FavoritesStack.Screen name="Favs" component={FavoritesScreen} />
      <FavoritesStack.Screen
        name="FavReading"
        component={FavReadingScreen}
      />
      <FavoritesStack.Screen
        name="FavEvent"
        component={FavEventScreen}
      />
    </FavoritesStack.Navigator>
  )
}

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({

      tabBarIcon: ({ color, size }) => {
        let iconName = '';

        if (route.name === 'Evenements') {
          iconName = 'calendar';
        } else if (route.name === 'Histoires') {
          iconName = 'book';
        } else if (route.name === 'Favoris') {
          iconName = 'heart'
        } else if (route.name === 'Dashboard') {
          iconName = 'user-circle-o'
        }

        return <FontAwesome name={iconName} size={size} color={color} />;
      },

      headerShown: false,
      tabBarActiveTintColor: 'rgba(216, 72, 21, 0.8)',
      tabBarInactiveTintColor: 'rgba(55, 27, 12, 0.7)',
      tabBarStyle: { position: 'absolute' },

      tabBarBackground: () => (
        <View style={styles.container} />
      ),

    })}

    >
      <Tab.Screen name="Dashboard" component={DashboardStackNavigator} />
      <Tab.Screen name="Evenements" component={EventsStackNavigator} />
      <Tab.Screen name="Histoires" component={StoriesStackNavigator} />
      <Tab.Screen name="Favoris" component={FavoritesStackNavigator} />
    </Tab.Navigator>
  );
};


export default function App() {

  // utilisation google fonts
  const [fontsLoaded, error] = useFonts({
    'Girassol-Regular': require('./assets/fonts/Girassol-Regular.ttf'), // fontWeight: '400',
    'Asul-Regular': require('./assets/fonts/Asul-Regular.ttf'), // fontWeight: '400',
    'Asul-Bold': require('./assets/fonts/Asul-Bold.ttf'), // fontWeight: '700',
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'), // fontWeight: '500',
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'), // fontWeight: '400',
    'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'), // fontWeight: '300',
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]); // useEffect se lancera à l’initialisation et à chaque changement de l’état fontsLoaded.

  // vérification du chargement de la font
  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="MyEvents" component={MyEventsScreen} />
          <Stack.Screen name="NewEvent" component={NewEventScreen} />
          <Stack.Screen name="NewStory" component={NewStoryScreen} />
          <Stack.Screen name="MyPublishedStories" component={MyPublishedStoriesScreen} />
          <Stack.Screen name="MyCurrentReadings" component={MyCurrentReadingsScreen} />
          <Stack.Screen name="FindStories" component={FindStoriesScreen} />
          <Stack.Screen name="ResultResearchStories" component={ResultResearchStoriesScreen} />
          <Stack.Screen name="ReadStory" component={ReadStoryScreen} />
          <Stack.Screen name="FavReading" component={FavReadingScreen} />
          <Stack.Screen name="FavEvent" component={FavEventScreen} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 0.95,
    backgroundColor: 'rgba(238, 236, 232, 1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
