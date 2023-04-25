import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import Cookies from 'js-cookie';
import Header from './Header'
import Footer from './Footer'
import { UserContext } from './Contexts/UserContext';
import UserContextProvider from './Contexts/UserContextProvider';
import useBlocking from './Contexts/useBlocking';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import About from './Components/About'
import Auction from './Components/Auction'
import Browse from './Components/Browse'
import Contact from './Components/Contact'
import Home from './Components/Home'
import LoginModal from './Components/LoginModal'
import SubmitAdd from './Components/SubmitAdd'
import MyAuctions from './Components/MyAuctions'

export const BlockingContext = createContext();

function App() {
  const [blocking, handleBlocking] = useBlocking();

  return (
      <UserContextProvider>
       <BlockingContext.Provider value={handleBlocking}>
        <div className="App">
          <BlockUi tag="div" blocking={blocking}>
            <BrowserRouter>
              <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/browse" element={<Browse />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/auction/:id" element={<Auction />} />
                    <Route path="/submit-add/" element={<SubmitAdd />} />
                    <Route path="/my-auctions" element={<MyAuctions />} />
                </Routes>
              <Footer />
            </BrowserRouter>
          </BlockUi>
        </div>
       </BlockingContext.Provider>
      </UserContextProvider>
  );
}

export default App;
