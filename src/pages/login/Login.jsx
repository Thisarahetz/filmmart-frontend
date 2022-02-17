import './login.scss'
import {useState,useRef} from 'react'

export default function Register() {
  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRef = useRef();
  const passwordRef = useRef();

  const handleStart = () =>{
      setEmail(emailRef.current.value);
  }
  const handleFinish = () => {
    setPassword(passwordRef.current.value);
  };
  
    return (
          <div className="login ">
            <div className="top">
            <div className="wrapper">
            <img className="logo"
            src="https://i.ibb.co/v1MXJ2B/images.jpg"
            alt="placeholder"
            />
            <button className="loginButton">Sign in</button>
            </div>
            </div>
            <div className="container">
            <form>
              <h1>Sign In</h1>
              <input type="email" placeholder="Email or phone number"/>
              <input type="password" placeholder="Password"/>
              <button className="loginButton">Sign in</button>
              <span>
                New to Site? <b>Sign up now.</b>
              </span>
              <small>
              This page is protected by Google reCAPTCHA to ensure you're not a
                bot. <b>Learn more</b>.
              k</small>
              </form>
            </div>
          </div>  
    )
}
