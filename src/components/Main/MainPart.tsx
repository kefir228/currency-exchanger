import { useMain } from "./useMainLogic"

export const MainPart = () => {
    const { register, handleSubmit, onSubmit, errors, currencies } = useMain()
    
    return (
        <div className="w-100%">
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }} className="flex justify-center font-bold p-5">
                Current exchange rates
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-5">
                <div>
                    <label htmlFor="amountFrom" className="block font-bold mb-2">
                        You give
                    </label>
                    <div className="flex gap-2">
                        <input
                            style={{ color: 'black' }}
                            id="amountFrom"
                            type="number"
                            className="border p-2 rounded w-full"
                            {...register("amountFrom", { required: "This field is required" })}
                        />
                        <select
                            style={{ color: 'black' }}
                            className="border p-2 rounded"
                            {...register("currencyFrom", { required: true })}
                            defaultValue="UAH"
                        >
                            {currencies.map((currency) => (
                                <option key={currency} value={currency}>
                                    {currency}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.amountFrom && <p className="text-red-500">{errors.amountFrom.message}</p>}
                </div>

                <div>
                    <label htmlFor="amountTo" className="block font-bold mb-2">
                        You get
                    </label>
                    <div className="flex gap-2">
                        <input
                            style={{ color: 'black' }}
                            id="amountTo"
                            type="number"
                            className="border p-2 rounded w-full bg-gray-100"
                            {...register("amountTo")}
                            disabled
                        />
                        <select
                            style={{ color: 'black' }}
                            className="border p-2 rounded"
                            {...register("currencyTo", { required: true })}
                            defaultValue="USD"
                        >
                            {currencies.map((currency) => (
                                <option key={currency} value={currency}>
                                    {currency}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className='font-bold py-2 px-4 rounded'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    Convert
                </button>
            </form>
        </div>
    )
}