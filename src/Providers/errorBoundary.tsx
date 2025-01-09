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
            <div className="error-boundary">
                <h1>Something went wrong.</h1>
                <p>{error.message}</p>
                <button onClick={resetError}>Try Again</button>
            </div>
        )
    }

    return (
        <ErrorBoundaryContext.Provider value={{componentDidCatch}}>
            {children}
        </ErrorBoundaryContext.Provider>
    )

}