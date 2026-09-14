import { api } from "../../src/infrastructure/network/api";
import { paymentRequest } from "../../src/infrastructure/network/PaymentService";

jest.mock('../../src/infrastructure/network/api', () => ({
    api: {
        post: jest.fn(),
    },
}));

const mockedApi = api as jest.Mocked<typeof api>;

it('should register paid', async () => {
    const payment = {
        title: "Crédito Vehicular",
        identifier: "638474747847",
        monthlyFee: 850,
        paidDate: new Date('2025-04-20'),
        operation: "OP-1000",
    };

    mockedApi.post.mockResolvedValue({
        data: {
            success: true,
            payment,
        },
    });

    const request = { title: "Crédito Vehicular", identifier: "CR-01" }
    const result = await paymentRequest(request);

    expect(result).toEqual({
        success: true,
        payment,
    });

    expect(mockedApi.post).toHaveBeenCalledWith('/payments', request);
});