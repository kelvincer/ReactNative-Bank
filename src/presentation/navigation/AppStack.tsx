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
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Detail" component={CreditDetail} />
      <Stack.Screen name="Payment" component={Payment} />
    </Stack.Navigator>
  );
}

export default AppStack;