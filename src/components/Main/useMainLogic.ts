import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useErrorBoundary } from "../../Providers/errorBoundary"

interface InputForm {
    amountFrom: number
    currencyFrom: string
    amountTo: number
    currencyTo: string
}

interface ExchangeRate {
    currencyCodeA: number
    currencyCodeB: number
    rateBuy: number
    rateSell: number
}

export const useMain = () => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<InputForm>()
    const { componentDidCatch } = useErrorBoundary()
    const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({})
    const currencies = ["UAH", "USD", "EUR", "PLN", "GBP"]
    const currenceCodes: Record<string, number> = {
        UAH: 980,
        USD: 840,
        EUR: 978,
        PLN: 985,
        GBP: 826,
    }

    useEffect(() => {
        const fetchRates = async () => {
            const LOCAL_STORAGE_KEY = "exchangeRates"
            const CACHE_TIMEOUT = 30 * 60 * 1000

            try {
                const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY)
                if (cachedData) {
                    const { rates: cachedRates, timestamp } = JSON.parse(cachedData)
                    if (Date.now() - timestamp < CACHE_TIMEOUT) {
                        setExchangeRates(cachedRates)
                        return
                    }
                }

                const response = await fetch("https://api.monobank.ua/bank/currency")
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }

                const data: ExchangeRate[] = await response.json()
                if (!Array.isArray(data)) {
                    throw new Error("Unexpected API response format")
                }

                const rates: Record<string, number> = {}
                data.forEach((rate) => {
                    const currency = Object.keys(currenceCodes).find(
                        (key) => currenceCodes[key] === rate.currencyCodeA
                    )
                    if (currency && rate.currencyCodeB === currenceCodes.UAH) {
                        rates[currency] = rate.rateBuy
                    }
                })

                const finalRates = { UAH: 1, ...rates }
                setExchangeRates(finalRates)

                localStorage.setItem(
                    LOCAL_STORAGE_KEY,
                    JSON.stringify({ rates: finalRates, timestamp: Date.now() })
                )
            } catch (error) {
                console.error("Error fetching exchange rates:", error)
                componentDidCatch(error,{componentStack:'useMain'})
            }
        }

        fetchRates()
    }, [componentDidCatch])

    const amountFrom = watch("amountFrom")
    const currencyFrom = watch("currencyFrom", "UAH")
    const currencyTo = watch("currencyTo", "USD")

    useEffect(() => {
        if (
            amountFrom &&
            currencyFrom &&
            currencyTo &&
            exchangeRates[currencyFrom] &&
            exchangeRates[currencyTo]
        ) {
            const convertedAmount = (amountFrom / exchangeRates[currencyFrom]) * exchangeRates[currencyTo]
            setValue("amountTo", parseFloat(convertedAmount.toFixed(2)))
        }
    }, [amountFrom, currencyFrom, currencyTo, exchangeRates, setValue])

    const onSubmit = (data: InputForm) => {
        console.log("Converted data", data)
        setValue('amountFrom', 0)
        setValue('amountTo', 0)
        setValue('currencyFrom', 'UAH')
        setValue('currencyTo', 'USD')
    }

    return { register, handleSubmit, onSubmit, errors, currencies, exchangeRates }
}
