import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    let navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogout = () => {
        setIsLoggedIn(false); // Update state
        localStorage.removeItem('authtoken');
        navigate('/');
    };

    useEffect(() => {
        const checkLogin = () => {
            if (localStorage.getItem("authtoken")) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        };

        checkLogin();

    }, [navigate]);

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand text-light" to="/home">
                        PhotoNest
                    </Link>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link text-light" to="/about">
                                    About
                                </Link>
                            </li>
                        </ul>
                    </div>
                    {isLoggedIn ? (
                        <button className="btn btn-primary mx-2" onClick={handleLogout}>
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/" className="btn btn-primary mx-2">
                                Login
                            </Link>
                            <Link to="/signup" className="btn btn-primary">
                                Signup
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </>
    );
}

export default Navbar;
