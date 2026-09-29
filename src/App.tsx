import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from '@/presentation/navigation/AppStack';
import { DefaultTheme, PaperProvider } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  colors: {
    ...DefaultTheme.colors,
    primary: '#D80051',
    surfaceVariant: "#FEF2F2",
    secondaryContainer: "#FEF2F2"
  },
};

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <AppStack />
      </PaperProvider>
    </NavigationContainer>
  );
}