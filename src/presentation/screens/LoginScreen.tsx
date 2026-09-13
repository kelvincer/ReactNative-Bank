import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { RootStackParamList } from "../navigation/RootStackParamList";
import { useAuthStore } from "../../stores/authStore";

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const login = useAuthStore(state => state.login)
    const isLoading = useAuthStore(state => state.isLoading)
    const error = useAuthStore(state => state.error)

    const handleLogin = async () => {
        const success = await login({
            email,
            password,
        });

        if (success) {
            navigation.replace('Home');
        }
    };

    return (
        <View style={styles.container}>

            <View style={styles.innerContainer}>
                <Text style={styles.title}>Banco</Text>

                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />

                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    right={<TextInput.Icon
                        icon={showPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowPassword(!showPassword)}
                    />}
                />

                <Button mode="contained"
                    onPress={handleLogin}
                    loading={isLoading}
                    disabled={isLoading}>
                    Iniciar Sesión
                </Button>

                {error && (
                    <Text>
                        {error}
                    </Text>
                )}
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerContainer: {
        width: '80%',
        alignItems: 'center',
        gap: 16,
    },
    title: {
        fontSize: 24,
    },
    input: {
        width: '80%',
    }
});