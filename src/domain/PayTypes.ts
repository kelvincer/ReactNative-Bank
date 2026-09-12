export interface PayRequest {
    title: string
    identifier: string
}

export interface PayResponse {
    success: boolean,
    payment: Payment

}

export interface Payment {
    title: string
    identifier: string,
    monthlyFee: number,
    paidDate: Date,
    operation: string
}