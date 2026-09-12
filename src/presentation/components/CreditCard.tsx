import { StyleSheet, View } from "react-native"
import { Card, Icon, Text } from "react-native-paper"
import { Credit } from "../../domain/Credit"

const formatBalance = (balance: number) =>
    `S/ ${balance.toLocaleString('es-PE')}`

const formatExpiration = (expiration: string | Date) => {
    const date = expiration instanceof Date ? expiration : new Date(expiration)
    return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })
}

const CreditCard = ({ title, identifier, balance, expiration }: Credit) => {
    return (
        <Card
            style={styles.card}
            mode="elevated">

            <View style={styles.container}>

                <Icon
                    source="cash-sync"
                    size={60}
                />
                <View style={styles.content}>
                    <Text style={styles.title}>
                        {title}
                    </Text>
                    <Text>
                        N° {identifier}
                    </Text>
                    <View style={styles.balance}>
                        <Text>
                            Saldo pendiente
                        </Text>
                        <Text style={styles.value}>
                            {formatBalance(balance)}
                        </Text>
                    </View>

                    <View style={styles.expiration}>
                        <Text>
                            Próximo vencimiento
                        </Text>
                        <Text style={styles.value}>
                            {formatExpiration(expiration)}
                        </Text>
                    </View>

                </View>
            </View>

        </Card>
    )
}

export default CreditCard

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginVertical: 8,
    },
    container: {
        flexDirection: 'row',
    },
    content: {
        flex: 1,
        margin: 8
    },
    balance: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    expiration: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    value: {
        fontWeight: 'bold'
    }
});