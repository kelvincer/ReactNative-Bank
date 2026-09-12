import { api } from "./api"
import { PayRequest, PayResponse } from "../../domain/PayTypes"

export const paymentRequest = async (request: PayRequest): Promise<PayResponse> => {
    const response = await api.post<PayResponse>('/payment', request)
    console.log(response)
    return response.data
}