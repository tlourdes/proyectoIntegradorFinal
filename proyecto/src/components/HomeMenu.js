import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import NuevoPost from "../screens/NuevoPost";
import Comentarios from "../components/Comentarios";
import Feather from '@expo/vector-icons/Feather';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Comentarios" component={Comentarios} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function HomeMenu() {
  return (
    <Tab.Navigator screenOptions={{ tabBarShowLabel: false }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarIcon: () => <Feather name="home" size={24} color="black" />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="NuevoPost"
        component={NuevoPost}
        options={{
          tabBarIcon: () => <Feather name="edit" size={24} color="black" />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: () => <Feather name="user" size={24} color="black" />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default HomeMenu;
