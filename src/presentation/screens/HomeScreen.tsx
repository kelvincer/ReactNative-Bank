import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import CreditCard from "../components/CreditCard";
import { mockCredits } from "../data/mockCredits";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootStackParamList";

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text>Créditos Totales</Text>
                <Text style={styles.amount}>S/ 18,5000</Text>
                <Text>Saldo total de deuda</Text>
            </View>
            <FlatList
                data={mockCredits}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {

                    return (
                        <Pressable onPress={() => { navigation.navigate('Detail', { credit: item }) }}>
                            <CreditCard {...item} />
                        </Pressable>
                    )
                }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: 'white',
        margin: 16,
        padding: 8
    },
    amount: {
        fontSize: 23,
        fontWeight: 'bold',
    }

});