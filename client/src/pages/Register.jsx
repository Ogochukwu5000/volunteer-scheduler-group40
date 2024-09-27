import React from 'react';
import { useState } from 'react';
import axios from "axios";
import {toast} from "react-hot-toast"
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const [data, setData] = useState({
        username: "",
        password: ""
    })

    const registerUser = async (e) =>{
        e.preventDefault()
        const {username, password} = data
        try {
            const {data} = await axios.post("/register", {
                username, password
            })
            if (data.error){
                toast.error(data.error)
            }
            else{
                setData({})
                toast.success("Registration successful. welcome!!")
                navigate('/login')
            }
        } catch (error) {
            // console.log(error)
        }
    }


  return (
    <div className="auth-container">
        <form onSubmit = {registerUser}>
            <h2>Register</h2>

            <div >
                    
                    <label htmlFor = "username"> Username: </label>
                    <input type= "text" placeholder= 'Enter email as username' value={data.username}  id = "username" onChange={(e) => setData({...data, username : e.target.value})}/>
                </div>
                <div >
                    <label htmlFor = "password"> Password: </label>
                    <input type= "password" placeholder="Password, at least 6 characters" value={data.password} id = "password" onChange={(e) => setData({...data, password : e.target.value})}/>
                </div>
                    <button type = "submit">Register</button>
         
        </form>
    </div>
  )
}
