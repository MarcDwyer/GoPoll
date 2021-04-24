import React from 'react'
import { Link } from 'react-router-dom'

import './navbar.scss'

interface Props {
    clearError: Function
}
const Navbar = (props: Props) => {
    return (
        <nav>
            <Link to="/" className="brand-logo"
            onClick={() => props.clearError()}
            >
                <h4>GoPoll.me</h4>
            </Link>
            <div className="links">
                <Link
                    to="/about"
                    className="about-link"
                >
                    Info
                    </Link>
            </div>
        </nav>
    )
}

export default Navbar