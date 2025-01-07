import { useState, useEffect } from "react"

export const useThemeSwitcher = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme')
        return savedTheme === 'dark'
    })

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode
            localStorage.setItem('theme', newMode ? 'dark' : 'light')
            return newMode
        })
    }

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark')
            document.body.classList.remove('light')
        } else {
            document.body.classList.add('light')
            document.body.classList.remove('dark')
        }
    }, [isDarkMode])

    return { toggleTheme, isDarkMode }

}