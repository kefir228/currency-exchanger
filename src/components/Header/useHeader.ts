import { useState, useEffect } from "react"

type CurrencyRate = {
    currency: string
    rateBuy: number
    rateSell: number
}

export const useHeader = () => {
    const [rates, setRates] = useState<CurrencyRate[]>([])

    useEffect(() => {
        const LOCAL_STORAGE_KEY = 'currencyRates'
        const CACHE_TIMEOUT = 5 * 60 * 1000

        const fetchRates = async () => {
            try {
                const response = await fetch("https://api.monobank.ua/bank/currency")
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
                const data = await response.json()

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

                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ rates: filteredRates, timestamp: Date.now() }))

                setRates(filteredRates)
            } catch (error) {
                console.error("Помилка отримання курсу валют:", error);
            }
        }

        const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (cachedData) {
            const { rates: cachedRates, timestamp } = JSON.parse(cachedData)

            if (Date.now() - timestamp < CACHE_TIMEOUT) {
                setRates(cachedRates)
                return
            }                              
        }

        fetchRates()
    }, [])

    const usd = rates.find((rate) => rate.currency === 'USD')
    const eur = rates.find((rate) => rate.currency === 'EUR')

    return { rates, usd, eur }
}