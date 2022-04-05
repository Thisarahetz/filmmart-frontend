import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import "./app.scss";
import Home from "./pages/home/Home";
import Detail from "./pages/details/Details";
import Register from "./pages/register/Register";
//import Login from "./pages/login/Login";

const App = () => {
  const user = true;
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={  <Home />  }/>
        <Route path="/movies" element={<Home type="movie" />} />
        <Route path="/series" element={<Home type="series" />} />
        <Route path="/details" element = {user ? <Detail/> : <Navigate to="register"/> } />
        <Route path="/register" element = {<Register />} />
      </Routes>
    </BrowserRouter>
  )
};

export default App;

