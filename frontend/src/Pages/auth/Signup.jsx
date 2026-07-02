import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../Services/api";
import "./auth.css";

function Signup(){
    const navigate = useNavigate();
    const [formData,setFormData]=useState({
        name:"",
        email:"",
        password:""
    });
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value});
    };
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const response = await api.post("/auth/register",formData);
            alert(response.data.message);
            navigate("/");
        }catch(err){
            console.log(err);
            alert(err.response?.data?.message || err.message || "An error occurred")
        }
    };
    return(
        <div className="container">
            <div className="card">
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        className="input"
                        type="text"
                        name="name"
                        placeholder="Name"
                        onChange={handleChange}
                    />
                    <input
                        className="input"
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                    />
                    <input
                        className="input"
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                    />
                    <button
                        className="button"
                        type="submit"
                    >
                        Register
                    </button>
                </form>
                <div className="link">
                    Already have an account? 
                    <Link to="/"> Login</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;