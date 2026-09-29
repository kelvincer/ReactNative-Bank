import { useEffect } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import CreditCard from "@/presentation/components/CreditCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/presentation/navigation/RootStackParamList";
import { useCreditsStore } from "@/stores/creditsStore";
import { formatBalance } from "@/util/util";

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    const credits = useCreditsStore(state => state.credits)
    const totalAmount = useCreditsStore(state => state.totalAmount)
    const isLoading = useCreditsStore(state => state.isLoading)
    const error = useCreditsStore(state => state.error)
    const getCredits = useCreditsStore(state => state.getCredits)


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