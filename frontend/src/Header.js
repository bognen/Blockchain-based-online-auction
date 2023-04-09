import React, { useState, useContext } from 'react';
import Cookies from 'js-cookie';
import { useNavigate  } from 'react-router-dom';
import plus_icon from './images/doctor-icon.png';
import auction_logo from './images/auction-logo.png';
import LoginModal from './Components/LoginModal';
import MessageModal from './Components/MessageModal';
import { UserContext } from './Contexts/UserContext';

import { API_BASE_URL } from './config';

function Header(){

  const navigate = useNavigate();
  const { loggedIn } = useContext(UserContext);

  // ------ STATE -------//
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [showMetamaskModal, setShowMetamaskModal] = useState(false);

  // ---- ACTIONS ------//
  const submitAdClick = () => {
      if (typeof window.ethereum !== 'undefined') {
          navigate('/submit-add');
      } else {
          setShowMetamaskModal(true);
      }
  };

  return(
    <div className="header_section">
      { isLogModalOpen ? <LoginModal onCancelButtonClick={() => setIsLogModalOpen(false)} /> : null }
      <MessageModal title="Metamask Extention Not Installed"
        body="Please install Metamask and connect to network"
        show={showMetamaskModal} onHide={() => setShowMetamaskModal(false)} />

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
                      { loggedIn ?
                        <div>
                          <button className="submit_bt" onClick={submitAdClick}>
                              <span className="doctor">
                                    <img src={plus_icon} />
                                </span>Submit ads
                          </button>
                          <div className="username">{Cookies.get('username')}</div>
                        </div>
                        : <button className="submit_bt" onClick={() => setIsLogModalOpen(true)}>Login</button>
                    }
  				    </div>
  				</div>
  			</div>
  		</div>
  	</div>
  )
}

export default Header;
