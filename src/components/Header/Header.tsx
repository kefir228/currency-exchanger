import Flag from 'react-world-flags'

export const Header = () => {
    return (
        <div className="bg-blue-500 flex justify-around">
            <h1 className="p-4 text-3xl font-bold">Currency exchanger</h1>
            <div className="flex">
                <ul className="flex flex-row items-center justify-center gap-5 flex-wrap">
                    <li className='flex gap-1'>
                        <p className='font-medium'>USD</p>
                        <Flag code='us' className='w-10 h-6' />
                        <p>:</p>
                    </li>
                    <li className='flex gap-1'>
                        <p className='font-medium'>EUR</p>
                        <img
                            src="https://flagcdn.com/w320/eu.png"
                            alt="European Union"
                            className="w-10 h-6"
                        />
                        <p>:</p>
                    </li>
                </ul>
            </div>
        </div>
    )
}