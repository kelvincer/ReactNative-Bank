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

El código está organizado en capas dentro de `src/`, siguiendo una arquitectura **inspirada en Clean Architecture**: los contratos viven en `domain`, las implementaciones en `infrastructure`, y la inyección es manual (factories + composition root), sin casos de uso ni librería de IoC.

```
src/
├── App.tsx                     # Raíz: theming + NavigationContainer
├── config/
│   └── env.ts                  # baseURL por entorno (inyectado desde .env en build)
├── domain/                     # Tipos puros y contratos — no importa nada
│   ├── AuthTypes.ts            # User, LoginRequest, LoginResponse
│   ├── Credit.ts               # Credit, CreditsResponse
│   ├── PayTypes.ts             # PayRequest, PayResponse, Payment
│   ├── AppError.ts             # ApiErrorBody + resolveErrorMessage(error → mensaje)
│   └── repositories/           # Puertos: qué necesita la app del exterior
│       ├── AuthRepository.ts
│       ├── CreditsRepository.ts
│       └── PaymentRepository.ts
├── infrastructure/
│   ├── di/
│   │   └── container.ts        # Composition root: une contratos e implementaciones
│   ├── network/
│   │   └── api.ts              # createApiClient(baseURL) + interceptor de auth (Bearer)
│   └── repositories/           # Adaptadores: implementan los puertos con axios
│       ├── AuthRepositoryImpl.ts    # POST /login
│       ├── CreditsRepositoryImpl.ts # GET /credits
│       └── PaymentRepositoryImpl.ts # POST /payments
├── stores/                     # Zustand: orquestación + persistencia
│   ├── authStore.ts            # createAuthStore(deps) + useAuthStore (sesión, token)
│   ├── creditsStore.ts         # createCreditsStore(deps) + useCreditsStore (lista + total)
│   └── paymentStore.ts         # createPaymentStore(deps) + usePaymentStore (pago)
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

### Alias de imports

Todo import interno usa el alias `@/` en lugar de rutas relativas:

```ts
import { useCreditsStore } from "@/stores/creditsStore";
import { Credit } from "@/domain/Credit";
import { formatBalance } from "@/util/util";
```

`@/` apunta a `src/` y **el path conserva la capa** (`@/stores/...`, `@/domain/...`), de modo que la dependencia entre capas queda explícita en el import en vez de codificarse en los saltos `../../`.

Como Metro empaqueta con Babel y Babel no lee `tsconfig.json`, el alias está declarado en los tres puntos de la cadena:

| Archivo |Ajuste | Para qué sirve |
| --- | --- | --- |
| `tsconfig.json` | `compilerOptions.paths` | Resolución de tipos en el IDE y en `tsc` |
| `babel.config.js` | `babel-plugin-module-resolver` | Resolución real en el bundle de Metro |
| `jest.config.js` | `moduleNameMapper` | Resolución en los tests |

> Ojo: los `paths` de TypeScript se borran al compilar. Si solo se configura `tsconfig.json`, el IDE lo resuelve pero la app revienta en runtime. Las tres piezas van juntas.

### Configuración por entorno

`src/config/env.ts` no tiene URLs escritas a mano: importa de `@env`, un **módulo virtual** que crea `react-native-dotenv` (plugin de Babel) y reemplaza por el valor leído de los archivos `.env` **antes de compilar**. En runtime no existe `process.env`, por eso el import tiene que pasar por el plugin:

```ts
// src/config/env.ts
import { API_BASE_URL } from '@env'

export const env = {
  apiBaseUrl: API_BASE_URL,
}
```

| Archivo | Entorno | Valor |
| --- | --- | --- |
| `.env` | desarrollo: Metro, builds debug y Jest | `http://10.0.2.2:8080` |
| `.env.staging` | homologación | `https://api.staging.cb.pe` |
| `.env.production` | producción: build release | `https://api.cb.pe` |

Cómo se elige el archivo:

- **Desarrollo**: sin `APP_ENV`, el plugin carga solo `.env`. `10.0.2.2` es el loopback hacia el host visto desde el emulador de Android.
- **Staging**: con `APP_ENV=staging` el plugin carga además `.env.staging`, que pisa el valor de `.env`. Los scripts `start:staging`, `android:staging` e `ios:staging` ya lo setean con `cross-env`, necesario en Windows, donde `APP_ENV=staging ...` no funciona en `cmd`.
- **Producción**: se selecciona sola. El CLI de React Native fija `NODE_ENV=production` en los builds release, y el plugin carga el archivo de ese modo, `.env.production`.

Precedencia de menor a mayor: `.env` → `.env.local` → `.env.<modo>` → `.env.<modo>.local` → variables del shell o del CI. Si tenés `API_BASE_URL` exportada en tu máquina, esa gana sobre los archivos.

Dos guardas en el plugin (`babel.config.js`): `allowlist: ['API_BASE_URL']` rechaza cualquier otra clave, y `allowUndefined: false` hace fallar el build si la clave no existe en el `.env` del entorno, en vez de dejar `undefined` en la app. Los tipos de `@env` están declarados a mano en `types/env.d.ts`.

Los `.env` van versionados a propósito: sus valores quedan inline en el bundle, así que son públicos. **Nunca** pongas secretos ahí; para eso, backend.

> Igual que tras tocar `babel.config.js`, cambiar de entorno con el dev server ya corriendo no se ve: Metro no invalida su caché por variables de entorno. Detené el server y usá `npm run start:staging:clean` (o `android:staging:clean`, que borra el caché y levanta el server de staging). Borrar el caché no alcanza si hay un Metro viejo ocupando el 8081: ese proceso sigue sirviendo su bundle desde memoria, así que hay que cerrarlo. En build debug el JS lo sirve Metro, no el build, así que el que decide el entorno es el server.

## Arquitectura y flujo de dependencias

La clave del diseño es un **flujo unidireccional** entre capas, con `domain` en el centro. `stores` e `infrastructure` dependen de los contratos de `domain`, nunca al revés:

```
presentation  →  stores  →  domain (contratos)  ←  infrastructure
      │              │                              │
      │              └──────── container ───────────┘
      │                       │
      └───────────────────────┴──►  AXIOS (red / backend)
```

| Capa | Responsabilidad | Importa desde |
| --- | --- | --- |
| `domain/` | Contratos: entidades, request/response y **puertos** (`interface AuthRepository`) | *(nada)* — capa más interna |
| `infrastructure/` | Adaptadores: implementan los puertos sobre axios + el cliente HTTP | `domain/` |
| `config/` | Constantes de entorno (`baseURL` de dev y prod) | *(nada)* |
| `stores/` | Estado global + orquestación (llama al puerto inyectado, mapea errores, persiste en AsyncStorage) | `domain/`, `infrastructure/di/container` |
| `presentation/` | Pantallas, componentes y navegación (UI reactiva a los stores) | `stores/`, `domain/`, `util/` |
| `util/` | Funciones puras de formato | *(nada)* |

### Reglas que se cumplen

- **`presentation` nunca importa `infrastructure` directamente**: la UI siempre pasa por los stores. Esto mantiene a la capa de red como un detalle intercambiable.
- **`domain` es 100% puro**: solo tipos e interfaces TypeScript, cero dependencias. Es la frontera de inversión de dependencias.
- **Los stores dependen del contrato, no de axios**: cada uno declara qué puerto necesita (`AuthRepository`, `CreditsRepository`, `PaymentRepository`) y lo recibe por parámetro.
- **Único punto de Cableado**: `infrastructure/di/container.ts` es el único módulo que conoce a la vez las interfaces y sus implementaciones de axios. Los stores tienen una única línea que lo consumen para exportar la instancia por defecto; todo lo demás es inyectable.
- **Flujo:** la pantalla ejecuta una acción del store → el store llama al puerto inyectado → el adaptador usa axios → el resultado tipado vuelve y se guarda en el estado.
- **Imports por alias `@/`** con la capa explícita en el path. Gracias a esto, las reglas de este diagrama se pueden verificar por patrón de import (y no solo con grep manual).

## Patrones utilizados

### 1. Arquitectura por capas con puertos y adaptadores

Separación `domain / infrastructure / stores / presentation`, donde `domain` declara **qué** necesita la app y `infrastructure` decide **cómo** se lo da:

- `domain/repositories/AuthRepository.ts` define el puerto:

  ```ts
  export interface AuthRepository {
      login: (credentials: LoginRequest) => Promise<LoginResponse>
  }
  ```

- `infrastructure/repositories/AuthRepositoryImpl.ts` lo implementa contra axios, y cumple el contrato de forma explícita en la firma de retorno:

  ```ts
  export const createAuthRepositoryImpl = (client: AxiosInstance): AuthRepository => ({ ... })
  ```

- `infrastructure/di/container.ts` es el **composition root**: el único lugar donde se juntan ambos lados.

A diferencia de una implementación estricta, aquí:

- **No hay casos de uso** (use cases) por dominio; la orquestación vive en las acciones de los stores.
- **No hay inyección automática**: no se usa `tsyringe`/`inversify`. La DI es explícita por constructor, con factories.
- El resultado es pragmático: se obtiene legibilidad, inversión de dependencias real y tests sin mocks de transporte, sin agregar dependencias.

### 2. Estado global con Zustand (Bridge / Orchestrator)

Los stores de Zustand son el **puente entre la UI y la red**, y siguen todos la misma forma:

- Estado: `isLoading`, `error`, datos del dominio.
- Acciones asíncronas que llaman al puerto inyectado y actualizan el estado con `set()`.
- **Persistencia**: el token y el usuario se guardan en AsyncStorage (tanto al iniciar sesión como en el interceptor de la request).

Zustand no requiere `Provider` en la raíz; las pantallas consumen estado con selectores, ej. `useAuthStore(state => state.user)`, lo que permite re-renderizados granulares.

**Convención de nombres**: todo store vive en `<dominio>Store.ts`, exporta su hook por defecto como `use<Dominio>Store` y su forma de estado como `interface <Dominio>State`. Así el prefijo `use` se cumple siempre y las llamadas tipo hook quedan cubiertas por la regla *rules-of-hooks* de ESLint.

| Archivo | Factory (inyectable) | Hook por defecto | Interface |
| --- | --- | --- | --- |
| `authStore.ts` | `createAuthStore({ authRepository })` | `useAuthStore` | `AuthState` |
| `creditsStore.ts` | `createCreditsStore({ creditsRepository })` | `useCreditsStore` | `CreditsState` |
| `paymentStore.ts` | `createPaymentStore({ paymentRepository })` | `usePaymentStore` | `PaymentState` |

El patrón de cada store es: **la factory recibe las dependencias, el hook por defecto es la factory ya cableada con el container**. Las pantallas solo conocen el hook, así que la firma `useAuthStore(state => ...)` no cambia respecto a la versión sin DI.

```ts
export const createAuthStore = ({ authRepository }: AuthStoreDependencies) =>
  create<AuthState>((set) => ({ /* ... acciones ... */ }))

export const useAuthStore = createAuthStore({ authRepository: container.auth })
```

### 3. Cliente HTTP por factory + interceptor de auth

`src/infrastructure/network/api.ts` exporta `createApiClient(baseURL)`, que devuelve una instancia de axios con el interceptor ya montado. No hay instancia global: el `baseURL` llega como argumento y sale de `src/config/env.ts` (ver [Configuración por entorno](#configuración-por-entorno)).

- **Interceptor de request**: lee el token de AsyncStorage y, si existe, añade `Authorization: Bearer <token>` en cada petición. Los adaptadores no se preocupan por la autenticación.

```ts
// Adaptador tipado contra el contrato de dominio
export const createCreditsRepositoryImpl = (client: AxiosInstance): CreditsRepository => ({
  getCredits: async (): Promise<CreditsResponse> => {
    const response = await client.get<CreditsResponse>('/credits')
    return response.data
  },
})
```

### 4. Convención de manejo de errores

- Los **adaptadores** lanzan el error de axios sin mapear.
- Los **stores** lo capturan como `unknown` y lo pasan por `resolveErrorMessage(error, fallback)` de `domain/AppError`. Esa función es la única que conoce la forma del fallo: lee el mensaje del backend (`{ "message": "Correo o contraseña incorrecto" }`, que el cliente HTTP expone en `response.data`) y, si no hay mensaje usable, devuelve el texto en español por defecto del store (`'No se pudo iniciar sesión'`, `'Error en el servicio'`).
- El estado sigue exponiendo `error: string | null`, porque la UI solo necesita el texto ya listo para pintar; el error crudo nunca sale del store.

```ts
// src/domain/AppError.ts
export const resolveErrorMessage = (error: unknown, fallback: string): string =>
    readApiErrorMessage(error) ?? fallback
```

```ts
// src/stores/authStore.ts
} catch (error: unknown) {
    set({
        isLoading: false,
        error: resolveErrorMessage(error, 'No se pudo iniciar sesión'),
    })

    return false
}
```

Ventajas frente a leer `error.response?.data?.message` en cada store: desaparece el `any` (el `catch` es `unknown` y se valida con type guards), la forma del error se declara una vez como contrato (`ApiErrorBody`) y el fallback queda explícito en la llamada. Un rechazo que no sea un objeto (un string, `null`, un timeout) también cae al texto por defecto en vez de romper.

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

1. **Login** → `LoginScreen` llama `useAuthStore.login()` → `authRepository.login()` (`POST /login`) → token + usuario guardados en AsyncStorage → `navigation.replace('Home')`.
2. **Home / Créditos** → `HomeScreen` llama `useCreditsStore.getCredits()` → `creditsRepository.getCredits()` (`GET /credits`) → lista renderizada con `CreditCard`; encabezado con el saldo total (`totalAmount`) calculado en el store.
3. **Detalle / Pago** → `PaymentScreen` recibe el `credit` por parámetro de ruta → `usePaymentStore.makePay({ title, identifier })` → `paymentRepository.makePay()` (`POST /payments`) → navega a `Payment` con el objeto `payment`.
4. **Constancia** → `PaymentProofScreen` muestra el recibo formateado; "Volver al inicio" resetea el stack a `Home`.

## Endpoints del backend

| Método | Ruta | Puerto (`domain/`) | Adaptador (`infrastructure/`) |
| --- | --- | --- | --- |
| `POST` | `/login` | `AuthRepository` | `AuthRepositoryImpl.ts` |
| `GET` | `/credits` | `CreditsRepository` | `CreditsRepositoryImpl.ts` |
| `POST` | `/payments` | `PaymentRepository` | `PaymentRepositoryImpl.ts` |

## Testing

Configuración: Jest con `@react-native/jest-preset`; `transformIgnorePatterns` asegura que se transformen los paquetes ESM de RN/paper/navigation. `testMatch` está acotado a `**/__tests__/**/*.test.[jt]s?(x)` para que los helpers compartidos no se interpreten como suites.

- **`jest.setup.js`** define mocks globales (AsyncStorage en memoria y los iconos Material Design como `<Text>`).
- **Los tests de store inyectan fakes, no mockean módulos.** Gracias a las factories, cada test construye su propio store con un repositorio falso, así que quedan aislados del transporte y no dependen de que un `jest.mock` aplique:

  ```ts
  const authRepository = createFakeAuthRepository()
  const useTestAuthStore = createAuthStore({ authRepository })

  authRepository.login.mockResolvedValue({ user, token: '1000' })
  await useTestAuthStore.getState().login({ email: 'test@test.com', password: '123456' })

  expect(useTestAuthStore.getState().token).toBe('1000')
  ```

  Cada test crea su store en el `beforeEach`, así que no hace falta resetear estado con `setState`.
- **Los tests de los adaptadores inyectan un cliente axios falso** (`createFakeAxiosClient()`) en `createXRepositoryImpl(client)`, en vez de mockear el módulo `api`. Antes esto era un `jest.mock('@/infrastructure/network/api', ...)`; si el string del mock y el `import` no coincidían, el mock dejaba de aplicarse en silencio y el test ejercitaba la instancia real. Con la factory ese riesgo desaparece.
- **Los tests de `domain/` cubren `resolveErrorMessage`** con el cuerpo que manda el backend, con cuerpos incompletos o con otra forma y con rechazos que no son objetos (`string`, `null`, `undefined`). Los stores agregan un caso por encima: que caigan al texto por defecto en vez de lanzar.
- **El test de `config/env`** comprueba que `@env` llegó inline desde el `.env`. Si el plugin de Babel dejara de aplicarse, el import virtual no resolvería y el test falla, en vez de dejar la app sin `baseURL`.
- Los tests se organizan igual que `src/`:

```
__tests__/
├── App.test.tsx               # Smoke test de la app completa
├── helpers/                   # Fakes compartidos (cliente axios, repositorios)
├── config/                    # env inyectado desde .env
├── domain/                    # Traducción de errores a mensaje
├── infrastructure/            # Adaptadores + cliente HTTP
├── store/                     # Stores de Zustand (vía getState/setState)
└── utils/                     # Formateadores puros
```

## Scripts

```sh
npm start                # Inicia Metro (dev)
npm run start:clean      # Inicia Metro descartando el cache de transformacion
npm run start:staging    # Inicia Metro con APP_ENV=staging
npm run start:staging:clean  # Igual, con el cache de transformacion limpio
npm run metro:clean      # Borra el cache de Metro (%TEMP%/metro-cache)
npm run android          # Build + run en Android (dev)
npm run android:staging  # Build + run en Android (staging)
npm run android:staging:clean  # Borra el cache y corre en Android con staging
npm run ios              # Build + run en iOS (dev)
npm run ios:staging      # Build + run en iOS (staging)
npm run lint             # ESLint
npm run typecheck        # tsc --noEmit
npm test                 # Jest
```

Requiere Node >= 22.11.0.

> **Despues de tocar `babel.config.js`**, use `npm run start:clean`. Metro cachea el resultado de la transformacion por archivo, asi que un dev server ya iniciado sigue sirviendo la version anterior de los imports y falla con `Unable to resolve module @/...` aunque la configuracion sea correcta.

## Notas / deudas técnicas

- No hay casos de uso (use cases) por dominio: la lógica de orquestación vive dentro de las acciones de los stores, mezclada con el acceso al puerto.
- El `baseURL` de `.env.production` (`https://api.cb.pe`) y el de `.env.staging` (`https://api.staging.cb.pe`) son valores de ejemplo pendientes de confirmar con el equipo de backend.
- `api.test.ts` accede a `client.interceptors.request.handlers`, que es interno de axios; si axios cambia su implementación, ese test hay que ajustarlo.