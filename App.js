import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './screens/HomeScreen';
import EventsScreen from './screens/EventsScreen';
import StoriesScreen from './screens/StoriesScreen';
import FavoritesScreen from './screens/FavoritesScreen'



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = '';

        if (route.name === 'Evènement') {
          iconName = 'location-arrow';
        } else if (route.name === 'Histoire') {
          iconName = 'map-pin';
        } else if (route.name === 'Favoris') {
          iconName = 'map-pin'
        }

        return <FontAwesome name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#ec6e5b',
      tabBarInactiveTintColor: '#335561',
      headerShown: false,
    })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Evènement" component={EventsScreen} />
      <Tab.Screen name="Histoire" component={StoriesScreen} />
      <Tab.Screen name="Favoris" component={FavoritesScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    
  )
};
