import { Link } from "react-router-dom"
export default function Navbar() {
    return (
    <nav className="home-links">
        <Link to="/"> Opportunities </Link>
        <Link to="/register"> Register </Link>
        <Link to="/login"> Login </Link>
    </nav>
  )
}
