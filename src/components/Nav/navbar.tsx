import React from 'react'
import { Link } from 'react-router-dom'

import './navbar.scss'


const Navbar = () => {
    return (
        <nav>
            <Link to="/" className="brand-logo">
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