export interface Credit {
    id: string
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