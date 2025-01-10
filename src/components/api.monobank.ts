export interface ExchangeRate {
    currencyCodeA: number
    currencyCodeB: number
    rateBuy: number
    rateSell: number
    rateCross: number
}

const LOCAL_STORAGE_KEY = "exchangeRates"
const CACHE_TIMEOUT = 15 * 60 * 1000

export const fetchExchangeRates = async (): Promise<ExchangeRate[]> => {
    const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (cachedData) {
        const { rates: cachedRates, timestamp } = JSON.parse(cachedData)
        if (Date.now() - timestamp < CACHE_TIMEOUT) {
            return cachedRates
        }
    }

    const response = await fetch("https://api.monobank.ua/bank/currency")
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data: ExchangeRate[] = await response.json()
    localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ rates: data, timestamp: Date.now() })
    )
    return data
}