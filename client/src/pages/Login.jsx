import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast"

export default function Login() {
    
    const [data, setData] = useState({
        username: "",
        password: ""
    })

    const navigate = useNavigate();

const loginUser = async (e) =>{
    e.preventDefault()
    //first deconstruct your data
    const {username, password} = data
        try {
            const {data} = await axios.post("/login", {
                username, password
            })
            if (data.error){
                toast.error(data.error)
            }
            else{
                setData({})
                toast.success("Login successful. Welcome to your Opportunities!!")
                navigate('/')
            }
        } catch (error) {
            console.log(error)
            toast.error("An error occurred. Please try again.");
        }

}

  return (
    <div className="auth-container">
        <form onSubmit = {loginUser}>
        <h2>Login</h2>
        <div>
            <label>Username</label>
            <input type = 'email' placeholder='Enter Email as Username' value={data.username}  id = "username" onChange={(e) => setData({...data, username : e.target.value})}/>
        </div>
        <div>
        <label>Password</label>
        <input type = 'password' placeholder='Password' value={data.password} id = "password" onChange={(e) => setData({...data, password : e.target.value})}/>
        </div>
            
            <button type = 'submit'>Login</button>
        </form>
    </div>
  )
}
