import './../styles/submitadd.css';
import Web3 from 'web3';
import { useNavigate  } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import MessageModal from './MessageModal';
import { UserContext } from './../Contexts/UserContext';

function SubmitAdd(){

  const navigate = useNavigate();
  const { loggedIn } = useContext(UserContext);
  // DialogModal Variables
  const [dialogModalTitle, setDialogModalTitle] = useState('');
  const [dialogModalBody, setDialogModalBody] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [metamaskInstalled, setMetamaskInstalled] = useState(false);

  useEffect(() => {
    if(!loggedIn){
        navigate('/');
    }else if (!window.ethereum) {
        setDialogModalTitle("No Metamask Detected");
        setDialogModalBody("In order to proceed Metamask Extenetion need to be installed");
        setShowMessageModal(true);
        setMetamaskInstalled(false);
    }
  }, [])


  //
  const openMetamask = () => {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        window.ethereum.enable().then(() => {
          // Metamask is now enabled, you can use web3 to interact with the blockchain
        }).catch((error) => {
          console.error(error);
        });
      } else {
        console.error('Metamask is not installed');
      }
  }

  return(
    <div className="layout_padding promoted_sectipon">
      <div className="container" style={{width: "60%"}}>

      <MessageModal title={dialogModalTitle}
          body={dialogModalBody}
          show={showMessageModal}
          onHide={() => setShowMessageModal(false)}
      />

        <div className="form-group submit-ad-form">
        <h1>Add New Listing</h1>
          <div className="row">
            <label className="col-lg-3 col-sm-12" htmlFor="name">Name:</label>
            <input name="name" id="name" className="col-lg-9 col-sm-12 form-control" type="text" />
          </div>
          <div className="row">
            <label className="col-lg-3 col-sm-12" htmlFor="pictureUpload">Upload Picture:</label>
            <input type="file" className="col-lg-9 col-sm-12 form-control-file" id="pictureUpload" name="pictureUpload" accept=".jpg,.png" multiple/>
          </div>
          <div className="row">
            <label className="col-lg-3 col-sm-12" htmlFor="desc">Description:</label>
            <textarea className="col-lg-9 col-sm-12 form-control" id="desc" rows="3"></textarea>
          </div>
          <div className="row">
            <label className="col-lg-3 col-sm-12" htmlFor="price">Starting Price:</label>
            <input name="price" id="price" className="col-lg-3 col-sm-12 form-control" type="number"/>

            <label className="col-lg-3 col-sm-12" htmlFor="increment">Increment:</label>
            <input name="increment" id="increment" className="col-lg-3 col-sm-12 form-control" type="number"/>
          </div>

          <div className="row">
            <label className="col-lg-3 col-sm-12" htmlFor="ship">Shipping Details:</label>
            <textarea className="col-lg-9 col-sm-12 form-control" id="ship" rows="3"></textarea>
          </div>

          <div className="row">
            <label className="col-lg-3 col-sm-12" htmlFor="payment">Accepted Payments:</label>
            <select select multiple className="col-lg-9 col-sm-12 form-control" id="payment">
              <option>Bitcoin</option>
              <option>Ethereum</option>
              <option>Dogecoin</option>
              <option>Monero</option>
              <option>Cardano</option>
            </select>
          </div>
          <div className="row">
            <div className="col-md-12 text-center">
              <button id="add-submit-button" type="button"
                  className="btn btn-info" onClick={openMetamask} disabled={!metamaskInstalled}>SUBMIT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default SubmitAdd;
