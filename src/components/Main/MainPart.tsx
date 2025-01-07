import { useMain } from "./useMainLogic"

export const MainPart = () => {
    const { } = useMain()
    
    return (
        <div className="w-100%">
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }} className="flex justify-center font-bold p-5">
                Current exchange rates
            </h1>
        </div>
    )
}