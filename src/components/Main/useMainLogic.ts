import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useErrorBoundary } from "../../Providers/errorBoundary"
import { fetchExchangeRates } from "../api.monobank"

interface InputForm {
    amountFrom: number
    currencyFrom: string
    amountTo: number
    currencyTo: string
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

            try {
                const data = await fetchExchangeRates()
                const rates: Record<string, number> = {}
                
                data.forEach((rate) => {
                    const currencyA = Object.keys(currenceCodes).find(
                        (key) => currenceCodes[key] === rate.currencyCodeA
                    )

                    if (currencyA && rate.currencyCodeB === currenceCodes.UAH) {
                        rates[currencyA] = rate.rateBuy || rate.rateCross;
                    }
                })

                const finalRates = { UAH: 1, ...rates }
                setExchangeRates(finalRates)

            } catch (error) {
                console.error("Error fetching exchange rates:", error)
                componentDidCatch(error, { componentStack: 'useMain' })
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
            const convertedAmount = (amountFrom * exchangeRates[currencyFrom]) / exchangeRates[currencyTo]
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
