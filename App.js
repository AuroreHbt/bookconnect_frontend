// Imports pour la nested navigation (stack + tab)
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import pour les icones
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Import des Screens pour la nav
import HomeScreen from './screens/HomeScreen';
import EventsScreen from './screens/EventsScreen';
import StoriesScreen from './screens/StoriesScreen';
import FavoritesScreen from './screens/FavoritesScreen'
import SignUpScreen from './screens/SignUpScreen'
import SignInScreen from './screens/SignInScreen'
import DashboardScreen from './screens/DashboardScreen'

// Imports pour configurer le store redux
import user from './reducers/user'
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit'


const store = configureStore({
  reducer: { user },
})


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = '';

        if (route.name === 'Evenement') {
          iconName = 'calendar';
        } else if (route.name === 'Histoire') {
          iconName = 'book';
        } else if (route.name === 'Favoris') {
          iconName = 'heart'
        } else if (route.name === 'Dashboard') {
          iconName = 'user-circle-o'
        }

        return <FontAwesome name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#ec6e5b',
      tabBarInactiveTintColor: '#335561',
      headerShown: false,
    })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Evenement" component={EventsScreen} />
      <Tab.Screen name="Histoire" component={StoriesScreen} />
      <Tab.Screen name="Favoris" component={FavoritesScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};
