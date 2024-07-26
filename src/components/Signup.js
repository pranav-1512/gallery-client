import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

function Signup() {
    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [alert, setAlert] = useState({ show: false, message: "", type: "primary" })
    let navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('https://gallery-backend-u0i7.onrender.com/auth/signup', {
                name,
                email,
                password
            })
            console.log("resp", response)

            if (response.status === 200) {
                setAlert({ show: true, message: 'Registration successful! Redirecting to login...', type: 'success' })
                setTimeout(() => {
                    navigate('/')
                }, 1000)
            }

            else {
                setAlert({ show: true, message: 'Emails Exists.', type: 'danger' })
            }
        } catch (error) {
            setAlert({ show: true, message: 'Email Exists', type: 'danger' })
            console.log("error", error)
        }
    }

    const handleNameChange = (e) => {
        setname(e.target.value)
    }
    const handleEmailChange = (e) => {
        setemail(e.target.value)
    }
    const handlePasswordChange = (e) => {
        setpassword(e.target.value)
    }
    return (
        <>
            {alert.show && (
                <div className={`alert alert-${alert.type}`} role="alert">
                    {alert.message}
                </div>
            )}
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-6">
                        <form className="shadow p-3 rounded" style={{ background: '#f8f9fa' }} onSubmit={handleSubmit}>
                            <h2 className="text-center mb-4">Signup</h2>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="name" className="form-control" id="name" aria-describedby="nameHelp" onChange={handleNameChange} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" onChange={handleEmailChange} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password" className="form-control" id="password" onChange={handlePasswordChange} required />
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary mx-3">Submit</button>
                                <p className='my-2'>Already have an account? <Link to='/'>Login</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup
