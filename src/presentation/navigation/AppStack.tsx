import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "@/presentation/screens/LoginScreen";
import { RootStackParamList } from "@/presentation/navigation/RootStackParamList";
import HomeScreen from "@/presentation/screens/HomeScreen";
import PaymentScreen from "@/presentation/screens/PaymentScreen";
import PaymentProofScreen from "@/presentation/screens/PaymentProofScreen";

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