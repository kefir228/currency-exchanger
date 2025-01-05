import Flag from 'react-world-flags'
import { useState, useEffect } from 'react'

type CurrencyRate = {
    currency: string
    rateBuy: number
}

export const Header = () => {

    const [rates, setRates] = useState<CurrencyRate[]>([])

    useEffect(() => {
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
                        rateBuy: item.rateBuy
                    }))
                setRates(filteredRates)
            } catch (error) {
                console.error("Помилка отримання курсу валют:", error);
            }
        }
        fetchRates()
    }, [])

    const usdRate = rates.find((rate) => rate.currency === 'USD')?.rateBuy || '-'
    const eurRate = rates.find((rate) => rate.currency === 'EUR')?.rateBuy || '-'

    return (
        <div className="bg-blue-500 flex justify-around">
            <h1 className="p-4 text-3xl font-bold">Currency exchanger</h1>
            <div className="flex">
                <ul className="flex flex-row items-center justify-center gap-5 flex-wrap">
                    <li className='flex gap-1'>
                        <p className='font-medium'>USD</p>
                        <Flag code='us' className='w-10 h-6' />:
                        <p className='font-medium pl-1'>{usdRate}</p>
                    </li>
                    <li className='flex gap-1'>
                        <p className='font-medium'>EUR</p>
                        <img
                            src="https://flagcdn.com/w320/eu.png"
                            alt="European Union"
                            className="w-10 h-6"
                        />:
                        <p className='font-medium pl-1'>{eurRate}</p>
                    </li>
                </ul>
            </div>
        </div>
    )
}