import { StyleSheet, View } from "react-native"
import { Button, Card, Chip, Icon, Text, useTheme } from "react-native-paper"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "@/presentation/navigation/RootStackParamList"
import { Credit } from "@/domain/Credit"
import { formatBalance, formatDate } from "@/util/util"
import { usePaymentStore } from "@/stores/paymentStore"

const statusColors: Record<Credit['status'], { backgroundColor: string; color: string }> = {
    'Activo': { backgroundColor: '#4CAF50', color: '#FFFFFF' },
    'Inactivo': { backgroundColor: '#9E9E9E', color: '#FFFFFF' },
};

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function PaymentScreen({ navigation, route }: Props) {
    const theme = useTheme()
    const { credit } = route.params

    const pay = usePaymentStore(state => state.makePay)
    const isLoading = usePaymentStore(state => state.isLoading)
    const error = usePaymentStore(state => state.error)

    const handleSave = async () => {
        const { success, payment } = await pay({
            title: credit.title,
            identifier: credit.identifier
        })

        if (success && payment) {
            navigation.navigate('Payment', { payment })
        }
    }

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
            <Card style={[styles.card, { backgroundColor: theme.colors.secondaryContainer }]}>
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

            <Card style={[styles.card, { backgroundColor: theme.colors.secondaryContainer }]}>
                {rows.map((row) => (
                    <View key={row.label} style={styles.row}>
                        <Text>{row.label}</Text>
                        <Text style={styles.rowValue}>{row.value}</Text>
                    </View>
                ))}
            </Card>

            <Button mode="contained"
                style={styles.button}
                onPress={handleSave}
                loading={isLoading}
                disabled={isLoading}>
                Realizar Pago
            </Button>

            {error && (
                <Text>
                    {error}
                </Text>
            )}
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