import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native"
import { Card, Icon, Text } from "react-native-paper"
import { RootStackParamList } from "../navigation/RootStackParamList";
import { formatBalance } from "./CreditDetailScreen";


type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

const Payment = ({ route }: Props) => {

    const { credit } = route.params;

    const rows: { label: string; value: string }[] = [
        { label: 'Crédito', value: credit.title },
        { label: 'N° de crédito', value: credit.identifier },
        { label: 'Monto pagado', value: formatBalance(credit.monthlyFee) },
        { label: 'Fecha de Pago', value: '10 Abr 2025 - 09:41' },
        { label: 'N° de operación', value: '643724234' },
    ];

    return (
        <Card style={styles.container}>
            <View style={styles.header}>
                <Icon
                    source="cash-sync"
                    size={90}
                />
                <View>
                    <Text style={styles.name}>
                        Compartamos Banco
                    </Text>
                    <Text>
                        Banca Digital
                    </Text>
                </View>

            </View>
            <Text style={styles.title}>Constancia de Pago</Text>
            {rows.map((row) => (
                <View key={row.label} style={styles.row}>
                    <Text>{row.label}</Text>
                    <Text style={styles.rowValue}>{row.value}</Text>
                </View>
            ))}

        </Card>
    )
}

export default Payment

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 12
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16
    },
    name: {
        fontSize: 20
    },
    title: {
        fontWeight: 'semibold',
        fontSize: 24,
        marginTop: 12,
        textAlign: 'center',
        marginBottom: 12
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    rowValue: {
        fontWeight: 'bold',
    },
})

