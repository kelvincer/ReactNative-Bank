import { StyleSheet, View } from "react-native"
import { Button, Card, Chip, Icon, Text } from "react-native-paper"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "../navigation/RootStackParamList"
import { Credit } from "../../domain/Credit"

export const formatBalance = (balance: number) =>
    `S/ ${balance.toLocaleString('es-PE')}`

const formatDate = (date: Date) =>
    date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })

const statusColors: Record<Credit['status'], { backgroundColor: string; color: string }> = {
    'Activo': { backgroundColor: '#4CAF50', color: '#FFFFFF' },
    'Inactivo': { backgroundColor: '#9E9E9E', color: '#FFFFFF' },
};

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function CreditDetail({ navigation, route }: Props) {
    const { credit } = route.params;

    const rows: { label: string; value: string }[] = [
        { label: 'Saldo pendiente', value: formatBalance(credit.balance) },
        { label: 'Identificador', value: `N° ${credit.identifier}` },
        { label: 'Cuota mensual', value: formatBalance(credit.monthlyFee) },
        { label: 'Próximo vencimiento', value: formatDate(credit.expiration) },
        { label: 'Tasa', value: `${credit.rate}%` },
        { label: 'Fecha de inicio', value: formatDate(credit.initDate) },
        { label: 'Plazo total', value: `${credit.totalTerm} meses` },
    ];

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <View style={styles.header}>
                    <Icon
                        source="cash-sync"
                        size={120}
                    />
                    <View>
                        <Text style={styles.title}>{credit.title}</Text>
                        <Chip
                            style={[styles.chip, { backgroundColor: statusColors[credit.status].backgroundColor }]}
                            textStyle={{ color: statusColors[credit.status].color }}
                        >
                            {credit.status}
                        </Chip>
                    </View>
                </View>
            </Card>

            <Card style={styles.card}>
                {rows.map((row) => (
                    <View key={row.label} style={styles.row}>
                        <Text>{row.label}</Text>
                        <Text style={styles.rowValue}>{row.value}</Text>
                    </View>
                ))}
            </Card>

            <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('Payment', { credit: credit })}>
                Realizar Pago
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    chip: {
        alignSelf: 'flex-start',
        marginTop: 6
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
    button: {
        marginTop: 'auto',
        marginVertical: 20
    },
})