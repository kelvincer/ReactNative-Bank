export interface Credit {
    id: number
    title: string
    identifier: string
    status: 'Activo' | 'Inactivo'
    balance: number
    monthlyFee: number
    expiration: Date
    rate: number
    initDate: Date
    totalTerm: number
}

export interface CreditsResponse {
    credits: Array<Credit>
}