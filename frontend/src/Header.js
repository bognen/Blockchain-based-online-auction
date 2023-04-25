import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import plus_icon from './images/doctor-icon.png';
import auction_logo from './images/auction-logo.png';
import LoginModal from './Components/LoginModal';
import SignModal from './Components/SignModal';
import MessageModal from './Components/MessageModal';
import { UserContext } from './Contexts/UserContext';
import { BlockingContext } from './App';

function Header(){

  const navigate = useNavigate();
  const { loggedIn, token, email, account, setAccount } = useContext(UserContext);
  const setBlocking = useContext(BlockingContext);
  const [ethBalance, setEthBalance] = useState(0);


  // ------ STATE VARIABLES -------//
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [dialogModalTitle, setDialogModalTitle] = useState('');
  const [dialogModalBody, setDialogModalBody] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);

  // ------ ENTRY POINT OF THE COMPONENT -------//
  useEffect(() => {
    if(loggedIn && (account==='null' || account===null)){
      setDialogModalTitle("Account Needed");
      setDialogModalBody("Please, add your account in our network in order to preceed")
      setShowMessageModal(true);
    }else if(loggedIn && account && account!=='null'){
        axios.post(process.env.REACT_APP_REST_API_URL+'/api/account-details', {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
          .then(resp => {
              console.log("Resp", resp);
              setAccount(resp.data.account);
              setEthBalance(resp.data.balance);
          }).catch(err => {
              console.log("An error occurred while retrieveing account details")
              console.log(err)
          })
    }
  }, [loggedIn, account])

  // ---- ACTIONS ------//
  const submitAdClick = () => {
      if (typeof window.ethereum !== 'undefined') {
          navigate('/submit-add');
      } else {
          setDialogModalTitle("No metamask installed");
          setDialogModalBody("Install metamask")
          setShowMessageModal(true);
      }
  };

  const goToMyAuctions = () => {
      navigate('/my-auctions');
  }

  const addAccount = (value) => {
    setBlocking(true);
    axios.post(process.env.REACT_APP_REST_API_URL+'/api/create-account', {
      account: value
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(resp => {
        setBlocking(false);
        setShowSignModal(false);
        setDialogModalTitle("Account Added");
        setDialogModalBody("Your Account Was Successfully Added")
        setShowMessageModal(true);
        setAccount(resp.data.address);
    }).catch(error =>{
        setBlocking(false);
        setShowSignModal(false);
        console.error('Failed to create account: ', error);
    })
  }

  return(
    <div className="header_section">
      { isLogModalOpen ? <LoginModal onCancelButtonClick={() => setIsLogModalOpen(false)} /> : null }
      <MessageModal title={dialogModalTitle} body={dialogModalBody}
        show={showMessageModal} onHide={() => setShowMessageModal(false)} />

      <SignModal signModalTitle="Provide Account" signModalInput="Account"
        onShow={showSignModal} onHide={() => setShowSignModal(false)}
        onConfirm={addAccount}/>

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
                { loggedIn ? (
                       account!=='null' ? (
                            <div style={{ display: "flex", alignItems: "center" }}>
                              <button className="submit_bt" style={{ minWidth: "185px" }} onClick={submitAdClick}>
                                  <span className="doctor">
                                        <img src={plus_icon} />
                                    </span>Submit ads
                              </button>
                              <div style={{ display: "block", marginLeft: "40px" }}>
                                <div className="username">{email}</div>
                                <div className="username">Current balance: {ethBalance} ETH</div>
                                <button className="btn btn-link" onClick={() => goToMyAuctions()}>My Auctions</button>
                              </div>
                            </div>
                          ) : (
                            <button className="submit_bt" onClick={() => setShowSignModal(true)}>Add Account</button>
                        )): (
                        <button className="submit_bt" onClick={() => setIsLogModalOpen(true)}>Login</button>
                    )}
  				    </div>
  				</div>
  			</div>
  		</div>
  	</div>
  )
}

export default Header;
