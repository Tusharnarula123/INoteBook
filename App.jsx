import Home from "./Components/Home";
import NavBar from './Components/NavBar';
import About from './Components/About';
import Alert from "./Components/Alert";
import NoteState from './Context/NoteState';
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import { useState } from "react";
const App=()=> {
  const [alert,setAlert]=useState(null);
  const showAlert=(message,type)=>{
    setAlert({
      msg:message,
      type:type
    })
    setTimeout(()=>{
      setAlert(null);
    },1500)
  }
  return (
    <>
    <NoteState>
    <Router>
      <NavBar/>
      <Alert alert={alert}/>
      <div className="container">
      <Routes>
          <Route exact path="/" element={<Home showAlert={showAlert}/>}/>
          <Route eaxct path="/about" element={<About/>}/>
          <Route eaxct path="/login" element={<Login showAlert={showAlert}/>}/>
          <Route eaxct path="/signup" element={<Signup showAlert={showAlert}/>}/>
        </Routes>
      </div>
    </Router>
    </NoteState>
    </>
  )
}

export default App;
