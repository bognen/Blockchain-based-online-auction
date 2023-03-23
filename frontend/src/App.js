import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './Header'
import Footer from './Footer'

import About from './Components/About'
import Auction from './Components/Auction'
import Browse from './Components/Browse'
import Contact from './Components/Contact'
import Home from './Components/Home'
import LoginModal from './Components/LoginModal'
import SubmitAdd from './Components/SubmitAdd'

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
            <Route path="/auction/:id" element={<Auction />} />
            <Route path="/submit-add/" element={<SubmitAdd />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
