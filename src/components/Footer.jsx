const Footer = () => {
    return (
        <footer className="bg-gray-300 dark:bg-gray-800 rounded-lg shadow-lg mx-4 mb-4 mt-8">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    © jinius. All rights reserved.
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <a href="https://www.x.com/0xjinius" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 me-4 md:me-6 transition-colors duration-300">Twitter</a>
                    </li>
                    <li>
                        <a href="https://www.github.com/FemiOje" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 me-4 md:me-6 transition-colors duration-300">Github</a>
                    </li>
                    <li>
                        <a href="mailto:0xjinius@gmail.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">0xjinius@gmail.com</a>
                    </li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer;