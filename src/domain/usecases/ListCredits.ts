import { Credit } from '@/domain/Credit'
import { CreditsRepository } from '@/domain/repositories/CreditsRepository'
import { Result, runUseCase } from '@/domain/Result'

export interface CreditsSummary {
    credits: Credit[]
    totalAmount: number
}

interface ListCreditsDependencies {
    creditsRepository: CreditsRepository
}

export interface ListCredits {
    (): Promise<Result<CreditsSummary>>
}

const FALLBACK_MESSAGE = 'Error en el servicio'

const sumBalances = (credits: Credit[]): number =>
    credits.reduce((total, credit) => total + credit.balance, 0)

/**
 * Lista de creditos: arma el resumen que consume la pantalla (creditos y saldo
 * total) para que el store no tenga que calcular nada.
 */
export const createListCredits = ({ creditsRepository }: ListCreditsDependencies): ListCredits =>
    () => runUseCase(async () => {
        const response = await creditsRepository.getCredits()

        return {
            credits: response.credits,
            totalAmount: sumBalances(response.credits),
        }
    }, FALLBACK_MESSAGE)
