import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from '../screens/Home';
import Comentarios from '../components/Comentarios';



const Stack = createNativeStackNavigator();


export default function MenuComentarios() {
  return (

      <Stack.Navigator>
       <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Comentarios" component={Comentarios} options={{ headerShown: false }} />
      </Stack.Navigator>

  );
}
