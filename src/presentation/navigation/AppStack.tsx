import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import { RootStackParamList } from "./RootStackParamList";
import HomeScreen from "../screens/HomeScreen";
import PaymentScreen from "../screens/PaymentScreen";
import PaymentProofScreen from "../screens/PaymentProofScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login"
        component={LoginScreen}
        options={{ headerShown: false }} />
      <Stack.Screen name="Home"
        component={HomeScreen}
        options={{ title: 'Mis créditos' }} />
      <Stack.Screen name="Detail"
        component={PaymentScreen}
        options={{ title: 'Detalle del crédito' }} />
      <Stack.Screen name="Payment"
        component={PaymentProofScreen}
        options={{ title: 'Constancia de pago', headerBackVisible: false, }} />
    </Stack.Navigator>
  );
}

export default AppStack