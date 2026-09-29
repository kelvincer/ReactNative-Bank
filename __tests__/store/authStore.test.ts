import { api } from "@/infrastructure/network/api";
import { useAuthStore } from "@/stores/authStore";

it('should have initial state', () => {
	const state = useAuthStore.getState();

	expect(state.token).toBeNull();
	expect(state.isLoading).toBe(false);
	expect(state.error).toBeNull();
});

jest.mock('@/infrastructure/network/api', () => ({
	api: {
		post: jest.fn(),
	},
}));

const mockedApi = api as jest.Mocked<typeof api>;

beforeEach(() => {
	useAuthStore.setState({
		user: null,
		token: null,
		isLoading: false,
		error: null
	});
});

it('should login successfully', async () => {
	mockedApi.post.mockResolvedValue({
		data: {
			user: {
				id: "1",
				name: "name",
				email: "email"
			},
			token: "1000"
		},
	});

	await useAuthStore.getState().login({
		email: 'test@test.com',
		password: '123456'
	});

	const finalState = useAuthStore.getState();
	
	expect(finalState.token).toBe('1000');
	expect(finalState.error).toBeNull();
	expect(finalState.isLoading).toBe(false);
});

it('should set isLoading true and error null while logging in', async () => {
	let resolveLogin!: (value: unknown) => void;
	mockedApi.post.mockReturnValue(
		new Promise((resolve) => {
			resolveLogin = resolve;
		})
	);

	const loginPromise = useAuthStore.getState().login({
		email: 'test@test.com',
		password: '123456'
	});

	const state = useAuthStore.getState();

	expect(state.token).toBeNull();
	expect(state.isLoading).toBe(true);
	expect(state.error).toBeNull();

	resolveLogin({
		data: {
			user: {
				id: "1",
				name: "name",
				email: "email"
			},
			token: "1000"
		},
	});

	await loginPromise;

	const finalState = useAuthStore.getState();

	expect(finalState.isLoading).toBe(false);
	expect(finalState.error).toBeNull();
});