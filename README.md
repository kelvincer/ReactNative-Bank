# CBFrontendRN

Aplicación móvil de **banca digital** construida con React Native. El usuario inicia sesión, consulta su lista de créditos, ve el detalle de cada uno, realiza un pago y obtiene una constancia de pago.

## Stack tecnológico

| Capa | Tecnología |
| --- | --- |
| Framework | React Native 0.87.1 + React 19 |
| Lenguaje | TypeScript |
| Navegación | React Navigation v7 (`@react-navigation/native-stack`) |
| UI / Theyming | react-native-paper v5 (Material Design) |
| Estado global | Zustand v5 |
| HTTP | axios v1 |
| Persistencia | `@react-native-async-storage/async-storage` |
| Testing | Jest + `@testing-library/react-native` |

## Estructura del proyecto

El código está organizado en capas dentro de `src/`, siguiendo una arquitectura **inspirada en Clean Architecture** (aunque de forma liviana, sin casos de uso ni interfaces de repositorio formales):

```
src/
├── App.tsx                     # Raíz: theming + NavigationContainer
├── domain/                     # Tipos puros (entidades y DTOs) — no importa nada
│   ├── AuthTypes.ts            # User, LoginRequest, LoginResponse
│   ├── Credit.ts               # Credit, CreditsResponse
│   └── PayTypes.ts             # PayRequest, PayResponse, Payment
├── infrastructure/
│   └── network/
│       ├── api.ts              # Instancia axios + interceptor de auth (Bearer)
│       ├── AuthService.ts      # POST /login
│       ├── CreditsService.ts   # GET /credits
│       └── PaymentService.ts   # POST /payments
├── stores/                     # Zustand: orquestación + persistencia
│   ├── authStore.ts            # useAuthStore (sesión, token)
│   ├── creditsStore.ts         # useCreditState (lista + total)
│   └── paymentStore.ts         # userPaymentState (pago)
├── presentation/
│   ├── navigation/
│   │   ├── RootStackParamList.ts  # Tipos de parámetros de navegación
│   │   └── AppStack.tsx           # Stack de 4 pantallas
│   ├── components/
│   │   └── CreditCard.tsx         # Tarjeta presentacional de crédito
│   └── screens/
│       ├── LoginScreen.tsx
│       ├── HomeScreen.tsx
│       ├── PaymentScreen.tsx      # Detalle del crédito + confirmar pago
│       └── PaymentProofScreen.tsx # Constancia de pago
└── util/
    └── util.ts                 # Formateadores puros (es-PE)
```

## Arquitectura y flujo de dependencias

La clave del diseño es un **flujo unidireccional** entre capas, con `domain` en el centro:

```
presentation  →  stores  →  infrastructure  →  domain (tipos)
     │              │               │
     └──────────────┴───────────────┴──►  AXIOS (red / backend :8080)
```

| Capa | Responsabilidad | Importa desde |
| --- | --- | --- |
| `domain/` | Contratos de datos (`interface` para entidades y request/response) | *(nada)* — capa más interna |
| `infrastructure/` | Transporte HTTP: servicios que encapsulan los endpoints con axios | `domain/` |
| `stores/` | Estado global + orquestación (llama servicios, mapea errores, persiste en AsyncStorage) | `domain/`, `infrastructure/` |
| `presentation/` | Pantallas, componentes y navegación (UI reactiva a los stores) | `stores/`, `domain/`, `util/` |
| `util/` | Funciones puras de formato | *(nada)* |

### Reglas que se cumplen

- **`presentation` nunca importa `infrastructure` directamente**: la UI siempre pasa por los stores. Esto mantiene a la capa de red como un detalle intercambiable.
- **`domain` es 100% puro**: solo tipos TypeScript, cero dependencias. Es la frontera de inversión de dependencias.
- **Flujo:** la pantalla ejecuta una acción del store → el store llama al servicio → el servicio usa axios → el resultado tipado vuelve y se guarda en el estado.

## Patrones utilizados

### 1. Arquitectura por capas (Clean Architecture liviana)

Separación `domain / infrastructure / stores / presentation`. A diferencia de una implementación estricta, aquí:

- **No hay interfaces de repositorio** formales (ej. `interface AuthRepository`); los servicios son funciones concretas tipadas contra las interfaces de `domain`.
- **No hay casos de uso** ni inyección de dependencias (IoC); todo se importa estáticamente.
- El resultado es pragmático: se obtiene legibilidad y desacoplamiento sin fricción de framework.

### 2. Estado global con Zustand (Bridge / Orchestrator)

Los stores de Zustand son el **puente entre la UI y la red**, y siguen todos la misma forma:

- Estado: `isLoading`, `error`, datos del dominio.
- Acciones asíncronas que llaman al servicio y actualizan el estado con `set()`.
- **Persistencia**: el token y el usuario se guardan en AsyncStorage (tanto al iniciar sesión como en el interceptor de la request).

Zustand no requiere `Provider` en la raíz; las pantallas consumen estado con selectores, ej. `useAuthStore(state => state.user)`, lo que permite re-renderizados granulares.

### 3. Cliente HTTP único + interceptor de auth

`src/infrastructure/network/api.ts` crea una única instancia de axios:

- `baseURL: 'http://10.0.2.2:8080'` (`10.0.2.2` es el loopback hacia el backend en el emulador Android; el backend corre en el puerto 8080).
- **Interceptor de request**: lee el token de AsyncStorage y, si existe, añade `Authorization: Bearer <token>` en cada petición. Los servicios no se preocupan por la autenticación.

```ts
// Ejemplo de servicio tipado
const creditsRequest = async (): Promise<CreditsResponse> => {
  const response = await api.get<CreditsResponse>('/credits');
  return response.data;
};
```

### 4. Convención de manejo de errores

- Los **servicios** lanzan el error de axios sin mapear.
- Los **stores** lo capturan, intentan leer `error.response?.data?.message` y caen en un mensaje en español por defecto (`'No se pudo iniciar sesión'`, `'Error en el servicio'`).

### 5. Navegación tipada con parámetros de dominio

`RootStackParamList` define las 4 rutas (`Login`, `Home`, `Detail`, `Payment`) y usa **objetos de dominio como parámetros** de navegación, de forma type-safe:

- `Detail: { credit: Credit }` — se pasa el crédito completo.
- `Payment: { payment: Payment }` — se pasa el pago realizado.

`PaymentProofScreen` bloquea el botón "atrás" (`headerBackVisible: false`) y al "Volver al inicio" hace `navigation.reset(...)` para impedir volver a la constancia.

### 6. Theming centralizado

El tema de react-native-paper se define una sola vez en `src/App.tsx` sobre `DefaultTheme`: color primario de marca `#D80051` y superficies rosa claro (`secondaryContainer`, `surfaceVariant`). Los componentes leen colores con `useTheme()` en lugar de hardcodearlos.

### 7. Utilidades puras

`src/util/util.ts` expone formateadores sin dependencias (formato peruano `es-PE`):

- `formatBalance(value)` → `S/ 12,300`
- `formatDate(value)` → fecha corta localizada

## Flujo de funcionalidad (end-to-end)

1. **Login** → `LoginScreen` llama `useAuthStore.login()` → `AuthService.loginRequest()` (`POST /login`) → token + usuario guardados en AsyncStorage → `navigation.replace('Home')`.
2. **Home / Créditos** → `HomeScreen` llama `useCreditState.getCredits()` → `CreditsService.creditsRequest()` (`GET /credits`) → lista renderizada con `CreditCard`; encabezado con el saldo total (`totalAmount`) calculado en el store.
3. **Detalle / Pago** → `PaymentScreen` recibe el `credit` por parámetro de ruta → `userPaymentState.makePay({ title, identifier })` → `PaymentService.paymentRequest()` (`POST /payments`) → navega a `Payment` con el objeto `payment`.
4. **Constancia** → `PaymentProofScreen` muestra el recibo formateado; "Volver al inicio" resetea el stack a `Home`.

## Endpoints del backend

| Método | Ruta | Servicio |
| --- | --- | --- |
| `POST` | `/login` | `AuthService.ts` |
| `GET` | `/credits` | `CreditsService.ts` |
| `POST` | `/payments` | `PaymentService.ts` |

## Testing

Configuración: Jest con `@react-native/jest-preset`; `transformIgnorePatterns` asegura que se transformen los paquetes ESM de RN/paper/navigation.

- **`jest.setup.js`** define mocks globales (AsyncStorage en memoria y los iconos Material Design como `<Text>`).
- **Mocks por archivo**: los tests de red mockean el módulo `api` (la instancia axios) en lugar de axios global o un servidor real.
- Los tests se organizan igual que `src/`:

```
__tests__/
├── App.test.tsx               # Smoke test de la app completa
├── api/                       # Servicios (auth, credits, payment)
├── store/                     # Stores de Zustand (vía getState/setState)
└── utils/                     # Formateadores puros
```

## Scripts

```sh
npm start            # Inicia Metro
npm run android      # Build + run en Android
npm run ios          # Build + run en iOS
npm run lint         # ESLint
npm test             # Jest
```

Requiere Node >= 22.11.0.

## Notas / deudas técnicas

- Nombres de stores inconsistentes: `useAuthStore`, `useCreditState`, `userPaymentState`.
- Duplicación menor de utilidades de formato en `CreditCard.tsx` (definidas inline) frente a `src/util/util.ts`.
- No hay path aliases en `tsconfig.json`; todos los imports son relativos.
- No existe capa de interfaces de repositorio ni inyección de dependencias (por diseño, ver "Arquitectura").