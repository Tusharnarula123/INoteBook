import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
const Signup = (props) => {
  const [crediantials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" })
  const validatePassword=(password,cpassword)=>{
    if(password===cpassword) return true;
    return false;
  }
  let navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password,cpassword } = crediantials;
    if(!validatePassword(password,cpassword)){
      props.showAlert(" Passwords dosn't match  ","danger")
      return;
    }
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    const json = await response.json();
    if(json.success){
    localStorage.setItem("token", json.authToken);
    navigate("/");
    props.showAlert("Account Created Successfully","success")
    }
    else{
      props.showAlert("Invalid Credentials","danger")
    }
  }
  const onChange = (e) => {
    setCredentials({ ...crediantials, [e.target.name]: e.target.value })

  }
  return (
    <div className='container mt-2'>
            <h2>Create a account to use iNoteBook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" name="name" id="name" onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" name="email" id="email" aria-describedby="emailHelp" onChange={onChange} />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" name="password" id="password" onChange={onChange} minLength={5} required/>
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="cpassword" className="form-control" name="cpassword" id="cpassword" onChange={onChange} minLength={5} required/>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Signup
