import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import NuevoPost from "../screens/NuevoPost";


import Feather from '@expo/vector-icons/Feather';
import MenuComentarios from './MenuComentarios';

const Tab = createBottomTabNavigator();

function HomeMenu() {
  return (
    <Tab.Navigator screenOptions={{tabBarShowLabel: false}}>
             <Tab.Screen name="MenuComentarios" component={MenuComentarios} options={{
        tabBarIcon: () => (
          <Feather name="home" size={24} color="black" />
        ), headerShown: false }} />
        <Tab.Screen name="NuevoPost" component={NuevoPost} options={{
        tabBarIcon: () => (
          <Feather name="edit" size={24} color="black" />
        ), headerShown: false
      }} />
      <Tab.Screen name="Profile" component={Profile} options={{
        tabBarIcon: () => (
          <Feather name="user" size={24} color="black" />
        ), headerShown: false
      }} />



    </Tab.Navigator>

  );
}


export default HomeMenu;