import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./auth.css";
import { useNavigate } from "react-router-dom";

function Login(){
    const navigate = useNavigate();
    const [formData,setFormData]=useState({
        email:"",
        password:""
    });
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value});
    };
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const response=await axios.post("http://localhost:8080/api/auth/login",formData);
            localStorage.setItem("token",response.data.token);
            localStorage.setItem("user",JSON.stringify(response.data.user));
            alert(response.data.message);
            navigate("/dashboard");
        }catch(err){
            console.log(err);
            alert(err.response.data.message);
        }
    };
    return(
        <div className="container">
            <div className="card">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
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
                        Login
                    </button>
                </form>
                <div className="link">
                    New user? <Link to="/signup">Register</Link>
                </div>
            </div>
        </div>
    );
}
export default Login;