import { useState, useEffect, useCallback } from "react"
import { useErrorBoundary } from "../../Providers/errorBoundary"
import { fetchExchangeRates } from "../api.monobank"

type CurrencyRate = {
    currency: string
    rateBuy: number
    rateSell: number
}

export const useHeader = () => {
    const [rates, setRates] = useState<CurrencyRate[]>([])
    const { componentDidCatch } = useErrorBoundary()

    const fetchRates = useCallback(async () => {
        try {
            const data = await fetchExchangeRates()

            const filteredRates = data
                .filter(
                    (item: any) =>
                        [840, 978].includes(item.currencyCodeA) && item.currencyCodeB === 980
                )
                .map((item: any) => ({
                    currency: item.currencyCodeA === 840 ? 'USD' : 'EUR',
                    rateBuy: item.rateBuy,
                    rateSell: item.rateSell
                }))

            setRates(filteredRates)
        } catch (error) {
            console.error("Помилка отримання курсу валют:", error);
            componentDidCatch(error, { componentStack: 'useHeader' })
        }
    }, [componentDidCatch])

    useEffect(() => {
        fetchRates()
    }, [fetchRates])

    const usd = rates.find((rate) => rate.currency === 'USD')
    const eur = rates.find((rate) => rate.currency === 'EUR')

    return { rates, usd, eur }
}