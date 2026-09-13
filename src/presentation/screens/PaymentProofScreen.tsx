import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native"
import { Button, Icon, Text, useTheme } from "react-native-paper"
import { RootStackParamList } from "../navigation/RootStackParamList";
import { formatBalance, formatDate } from "../../util/util";


type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

const PaymentProofScreen = ({ navigation, route }: Props) => {

    const theme = useTheme()
    const { payment } = route.params;

    const rows: { label: string; value: string }[] = [
        { label: 'Crédito', value: payment.title },
        { label: 'N° de crédito', value: payment.identifier },
        { label: 'Monto pagado', value: formatBalance(payment.monthlyFee) },
        { label: 'Fecha de Pago', value: formatDate(payment.paidDate) },
        { label: 'N° de operación', value: payment.operation },
    ];

    const handleGoHome = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.secondaryContainer }]}>
            <View style={styles.header}>
                <Icon
                    source="cash-sync"
                    size={90}
                />
                <View>
                    <Text style={styles.name}>
                        Banco
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

            <Button mode="contained" style={styles.button} onPress={handleGoHome}>
                Volver al inicio
            </Button>
        </View>
    )
}

export default PaymentProofScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 12,
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
    button: {
        marginTop: 'auto',
        marginVertical: 20,
        marginHorizontal: 8,
    },
})

