import './register.scss'
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
          <div className="register">
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
            <h1>Register</h1>
            <h2>If you want To know the upcoming movies</h2>
            <p>Get register</p>
            {!email ? (
              <div className="input">
                <input type="email" placeholder="email address" ref={emailRef} />
                <button className="registerButton" onClick={handleStart}>
                  Register
                </button>
              </div>
            ) : (
              <form className="input">
                <input type="password" placeholder="password" ref={passwordRef} />
                <button className="registerButton" onClick={handleFinish}>
                  Start
                </button>
              </form>
            )}
            
            </div>
          </div>  
    )
}
