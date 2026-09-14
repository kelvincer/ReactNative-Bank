import { api } from "../../src/infrastructure/network/api";
import { loginRequest } from "../../src/infrastructure/network/AuthService";

jest.mock('../../src/infrastructure/network/api', () => ({
    api: {
        post: jest.fn(),
    },
}));

const mockedApi = api as jest.Mocked<typeof api>;

it('should login', async () => {
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

    const request = { email: 'name', password: 'pass' }
    const result = await loginRequest(request);

    expect(result).toEqual({
        user: {
            id: "1",
            name: "name",
            email: "email"
        },
        token: "1000"
    });

    expect(mockedApi.post).toHaveBeenCalledWith('/login', request);
});

it('should reject when the request fails', async () => {
    const error = new Error('Network error');
    mockedApi.post.mockRejectedValue(error);

    const request = { email: 'name', password: 'wrong' }

    await expect(loginRequest(request)).rejects.toThrow('Network error');
});