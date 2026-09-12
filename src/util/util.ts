export const formatBalance = (balance: number | string | null | undefined) => {
    if (balance == null) return 'S/ 0'

    const numeric = typeof balance === 'string' ? parseInt(balance, 10) : balance

    if (Number.isNaN(numeric)) return 'S/ 0'

    return `S/ ${numeric.toLocaleString('es-PE')}`
}

export const formatDate = (date: string | Date | null | undefined) => {
    if (date == null) return ''

    const parsed = date instanceof Date ? date : new Date(date)
    if (Number.isNaN(parsed.getTime())) return ''

    return parsed.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })
}