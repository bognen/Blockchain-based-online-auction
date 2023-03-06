import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './Header'
import Footer from './Footer'
import Home from './Components/Home'
import Browse from './Components/Browse'
import About from './Components/About'
import Contact from './Components/Contact'
import LoginModal from './Components/LoginModal'

function App() {
  return (
    <div className="App">
      <Header />
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
