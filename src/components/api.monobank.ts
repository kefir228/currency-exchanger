export interface ExchangeRate {
    currencyCodeA: number
    currencyCodeB: number
    rateBuy: number
    rateSell: number
    rateCross: number
}

const LOCAL_STORAGE_KEY = "exchangeRates"
const CACHE_TIMEOUT = 15 * 60 * 1000

let inMemoryCache: ExchangeRate[] | null = null
let isFetching = false
const pendingPromises: ((data: ExchangeRate[]) => void)[] = []

export const fetchExchangeRates = async (): Promise<ExchangeRate[]> => {

    if (inMemoryCache) {
        return inMemoryCache
    }

    const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (cachedData) {
        try {
            const { rates: cachedRates, timestamp }: { rates: ExchangeRate[]; timestamp: number } = JSON.parse(cachedData)
            if (Date.now() - timestamp < CACHE_TIMEOUT) {
                inMemoryCache = cachedRates
                return cachedRates
            }
        } catch {
            console.error("Некоректні дані у кеші, кеш очищено.")
            localStorage.removeItem(LOCAL_STORAGE_KEY)
        }
    }

    if (isFetching) {
        return new Promise((resolve) => {
            pendingPromises.push(resolve)
        })
    }

    isFetching = true
    try {
        const response = await fetch("https://api.monobank.ua/bank/currency")
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data: ExchangeRate[] = await response.json()

        inMemoryCache = data
        localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify({ rates: data, timestamp: Date.now() })
        )

        pendingPromises.forEach((resolve) => resolve(data))
        pendingPromises.length = 0

        return data
    } catch (error) {
        console.error("Помилка під час отримання даних:", error)
        pendingPromises.forEach((resolve) => resolve([]))
        pendingPromises.length = 0
        throw error
    } finally {
        isFetching = false
    }
}