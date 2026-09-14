import { api } from "../../src/infrastructure/network/api";
import { creditsRequest } from "../../src/infrastructure/network/CreditsService";

jest.mock('../../src/infrastructure/network/api', () => ({
    api: {
        get: jest.fn(),
    },
}));

const mockedApi = api as jest.Mocked<typeof api>;

it('should get credits', async () => {
    mockedApi.get.mockResolvedValue({
        data: {
            credits: [
                {
                    id: 1,
                    title: "Crédito Vehicular",
                    identifier: "638474747847",
                    status: "Activo",
                    balance: 12300,
                    monthlyFee: 850,
                    expiration: "2025-04-20",
                    rate: 12.5,
                    initDate: "2023-04-20",
                    totalTerm: 48,
                },
            ],
        },
    });

    const result = await creditsRequest();

    expect(result).toEqual({
        credits: [
            {
                id: 1,
                title: "Crédito Vehicular",
                identifier: "638474747847",
                status: "Activo",
                balance: 12300,
                monthlyFee: 850,
                expiration: "2025-04-20",
                rate: 12.5,
                initDate: "2023-04-20",
                totalTerm: 48,
            },
        ],
    });

    expect(mockedApi.get).toHaveBeenCalledWith('/credits');
});