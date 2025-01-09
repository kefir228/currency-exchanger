import Flag from 'react-world-flags'
import { useHeader } from './useHeader'
import { GiEarthAfricaEurope } from "react-icons/gi";
import { IoSunnyOutline } from "react-icons/io5";
import { FaMoon } from "react-icons/fa";
import { useThemeSwitcher } from './useThemeSwitcher';

export const Header = () => {

    const { eur, usd } = useHeader()
    const { toggleTheme, isDarkMode } = useThemeSwitcher()

    return (
        <div className='relative'>
            <div className={`flex justify-around ${isDarkMode ? 'bg-gray-800' : 'bg-blue-500'}`}>
                <div className='flex justify-center items-center'>
                    <h1 style={{ fontSize: 'clamp(1rem, 5vw, 2rem)' }} className="p-4 pr-0 text-3xl font-bold text-center ">
                        Currency exchanger
                    </h1>
                    <GiEarthAfricaEurope className='text-6xl text-center pl-2' />
                </div>
                <div className={`flex border-2 border-black ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
                    <ul className="flex flex-row items-center justify-center gap-5 flex-wrap">
                        <li className='flex gap-1 items-center'>
                            <p className='font-medium'>USD</p>
                            <Flag code='us' className='w-10 h-6' />:
                            <div>
                                <p className='font-medium pl-1'>{usd?.rateBuy}</p>
                                <p className='font-medium pl-1'>{usd?.rateSell}</p>
                            </div>
                        </li>
                        <li className='flex gap-1 items-center'>
                            <p className='font-medium'>EUR</p>
                            <img
                                src="https://flagcdn.com/w320/eu.png"
                                alt="European Union"
                                className="w-10 h-6"
                            />:
                            <div>
                                <p className='font-medium pl-1'>{eur?.rateBuy}</p>
                                <p className='font-medium pl-1'>{eur?.rateSell}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <button
                className='absolute top-0 right-0 text-3xl !bg-inherit'
                onClick={toggleTheme}
                aria-label='Toggle theme'
            >
                {isDarkMode ? <FaMoon /> : <IoSunnyOutline />}
            </button>
        </div>
    )
}