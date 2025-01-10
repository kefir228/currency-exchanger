import React, { useState, useEffect } from "react";

const ErrorBoundaryContext = React.createContext<any>(null)

export const useErrorBoundary = () => {
    return React.useContext(ErrorBoundaryContext)
}

export const ErrorBoundaryProvider = ({ children }: { children: React.ReactNode }) => {
    const [error, setError] = useState<Error | null>(null)
    const [info, setInfo] = useState<any>(null)

    const resetError = () => {
        setError(null)
        setInfo(null)
    }

    const componentDidCatch = (error: Error, info: any) => {
        setError(error)
        setInfo(info)
    }

    useEffect(() => {
        if (error) {
            console.error("Caught error:", error, info)
        }
    }, [error, info])

    if (error) {
        return (
            <div className="flex flex-col w-full h-screen items-center justify-center gap-10">
                <h1 className="w-full text-6xl font-medium text-center">Something went wrong.</h1>
                <p className="text-center">{error.message}</p>
                <button
                    className="bg-blue-500 hover:bg-blue-800 rounded w-1/2 flex justify-center "
                    onClick={resetError}
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <ErrorBoundaryContext.Provider value={{ componentDidCatch }}>
            {children}
        </ErrorBoundaryContext.Provider>
    )

}