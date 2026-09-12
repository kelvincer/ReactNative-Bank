export const formatBalance = (balance: number) =>
    `S/ ${balance.toLocaleString('es-PE')}`

export const formatDate = (date: string | Date) => {
    const parsed = date instanceof Date ? date : new Date(date)
    return parsed.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })
}