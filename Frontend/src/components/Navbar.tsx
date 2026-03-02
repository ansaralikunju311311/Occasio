import { Link } from "react-router-dom";



const Navbar = () => {
  return (
    <div>
        <header className="bg-white shadow">
            <div className="max max-w-7xl mx-auto px-6 py-4 flex justify-between">
                <h1 className="text-xl font-bold">
                    Occasio
                </h1>

                <nav className="space-x-6">
                    <Link to="/">Home</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>
                </nav>
            </div>
        </header>
    </div>
  )
}

export default Navbar
