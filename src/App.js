import './App.css';
import Login from './components/Login.js';
import Home from './components/Home.js';
import { Routes, Route, BrowserRouter} from "react-router-dom";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route exact path="/" element={ <Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
