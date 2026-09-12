import { useEffect } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import CreditCard from "../components/CreditCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootStackParamList";
import { useCreditState } from "../../stores/creditsStore";
import { formatBalance } from "../../util/util";

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    const credits = useCreditState(state => state.credits)
    const totalAmount = useCreditState(state => state.totalAmount)
    const isLoading = useCreditState(state => state.isLoading)
    const error = useCreditState(state => state.error)
    const getCredits = useCreditState(state => state.getCredits)

    useEffect(() => {
        getCredits()
    }, [getCredits])

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text>Créditos Totales</Text>
                <Text style={styles.amount}>{formatBalance(totalAmount)}</Text>
                <Text>Saldo total de deuda</Text>
            </View>

            {isLoading ? (
                <ActivityIndicator style={styles.loading} />
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : (
                <FlatList
                    data={credits}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {

                        return (
                            <Pressable onPress={() => { navigation.navigate('Detail', { credit: item }) }}>
                                <CreditCard {...item} />
                            </Pressable>
                        )
                    }} />
            )}
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
    },
    loading: {
        marginTop: 32,
    },
    error: {
        textAlign: 'center',
        marginTop: 32,
        color: 'red',
    }

});