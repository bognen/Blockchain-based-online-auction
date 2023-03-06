import React, { useState } from 'react';

import plus_icon from './images/doctor-icon.png';
import auction_logo from './images/auction-logo.png';
import LoginModal from './Components/LoginModal';

function Header(){

  //+++ Login Modal Events
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  return(
    <div className="header_section">
      { isLogModalOpen ? <LoginModal onCancelButtonClick={() => setIsLogModalOpen(false)} /> : null }
  		<div className="container">
  			<div className="row">
  				<div className="col-sm-12 col-lg-3">
  					<div className="logo"><a href="/"><img src={auction_logo}/></a></div>
  				</div>
  				<div className="col-sm-6">
  					<nav className="navbar navbar-expand-lg navbar-light bg-light">
                          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                          <span className="navbar-toggler-icon"></span>
                          </button>
                      <div className="collapse navbar-collapse" id="navbarNavAltMarkup" style={{ justifyContent: "center" }}>
                          <div className="navbar-nav">
                             <a className="nav-item nav-link" href="/">Home</a>
                             <a className="nav-item nav-link" href="/browse">Browse</a>
                             <a className="nav-item nav-link" href="/about">About</a>
                             <a className="nav-item nav-link" href="/contact">Contact</a>
                          </div>
                      </div>
                      </nav>
  				</div>
  				<div className="col-sm-6 col-lg-3">
  					<div className="search_main">
                      <button className="submit_bt"><a href="#"><span className="doctor"><img src={plus_icon} /></span>Submit ads</a></button>
                      <button className="btn" onClick={() => setIsLogModalOpen(true)}>Login</button>
  				    </div>
  				</div>
  			</div>
  		</div>
  	</div>
  )
}

export default Header;
