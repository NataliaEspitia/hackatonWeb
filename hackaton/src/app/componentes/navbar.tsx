import Link from "next/link";
export default function NavBar () {
    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="flex mx-auto items-center justify-between">
                <h1 className="text-2xl font-bold">Navbar</h1>
                <Link href="/" className="text-sm ">
                    Home
                </Link>
                <Link href="/features" className="text-sm ">
                    Features
                </Link>
                <Link href="/pricing" className="text-sm ">
                    Pricing
                </Link>
                <Link href="/about" className="text-sm ">
                    About
                </Link>
                <div>
                <input type="text" placeholder="Search..." className="bg-white text-white placeholder:text-gray-400 border border-gray-500 py-2 px-4  rounded" />
                <button className="bg-gray-800 text-blue border border-blue-700  py-2 px-4 rounded">
                    Search
                </button>
                </div>
            </div>
        </nav>
    );

}