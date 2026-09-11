import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import { RootStackParamList } from "./RootStackParamList";
import HomeScreen from "../screens/HomeScreen";
import CreditDetail from "../screens/CreditDetailScreen";
import Payment from "../screens/PaymentScreen";

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
        component={CreditDetail}
        options={{ title: 'Detalle del crédito' }} />
      <Stack.Screen name="Payment"
        component={Payment}
        options={{ title: 'Constancia de pago' }} />
    </Stack.Navigator>
  );
}

export default AppStack