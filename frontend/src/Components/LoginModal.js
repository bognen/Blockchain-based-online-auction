import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { API_BASE_URL } from './../config';
import './../styles/login-modal.css'
import { UserContext } from './../Contexts/UserContext';
import MessageModal from './MessageModal';

function LoginModal({onCancelButtonClick}) {

  // State variables
  const [dialogModalTitle, setDialogModalTitle] = useState('');
  const [dialogModalBody, setDialogModalBody] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Login variables
  const { loggedIn, email, token, tokenExpiresAt, account,
          setLoggedIn, setEmail, setToken, setTokenExpiresAt, setAccount } = useContext(UserContext);

  //******************************************
  //**********   MODAL BEHAVIOR  *************
  //******************************************
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);

  const handleCloseLoginModal = () => {
    onCancelButtonClick(); // Emmits event back to parent component
  };

  const handleRegisterClick = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };

  const handleShowRegisterModal = () => {
    setShowRegisterModal(true);
  };

  const handleCloseRegisterModal = () => {
    setShowRegisterModal(false);
  };

  //******************************************
  //********  MODAL ACTION EVENTS *************
  //******************************************
  // >>> REGISTER MODAL <<<///
  const [registerFormData, setRegisterFormData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerResponse, setRegisterResponse] = useState(null);

  const registerFormChange = (event) => {
    setRegisterFormData({
      ...registerFormData,
      [event.target.name]: event.target.value,
    });
  };

  const registerUserSubmit = async (event) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(process.env.REACT_APP_REST_API_URL+'/auth/signup', registerFormData);
      if(response.status == 200) setRegisterResponse("Success");
      setDialogModalTitle("Account Needed");
      setDialogModalBody("You have successfully register. Now please proceed to the provided email confirm registration."+
                         "Login and then create an account within our blockchain network. Use link in upper right corner."+
                         "As the result you will recieve a private key. You will need to store it and use"+
                         "to sign trasactions later")
      setShowMessageModal(true);
    } catch (error) {
      setRegisterResponse("Error");
      console.error(error);
    }
    setIsSubmitting(false);
  };

  // >>> LOGIN MODAL <<<///
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: '',
  });
  const [loginErrorResponse, setLoginErrorResponse] = useState(null);

  const loginFormChange = (event) => {
    setLoginFormData({
      ...loginFormData,
      [event.target.name]: event.target.value,
    });
  };

  //  Submit event
  const loginUserSubmit = async (event) => {
    setIsSubmitting(true);
    try {
        const response = await axios.post(process.env.REACT_APP_REST_API_URL+'/auth/login', loginFormData);
         if(response.status == 200){
            setLoggedIn(true);
            setEmail(loginFormData.email);
            setToken(response.data.token);
            setTokenExpiresAt(Date.now()+18000000);
            // TODO check account
            axios.get(process.env.REACT_APP_REST_API_URL+'/api/account-details', {}, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${response.data.token}`
              }
            }).then(resp => {
                  if(resp.data.account!=='' && resp.data.account!=undefined){
                    setAccount(resp.data.account);
                  }
              }).catch(err => {
                  console.log("An error occurred while retrieveing account details")
                  console.log(err)
              })
        }
        setShowLoginModal(false);
        setIsSubmitting(false);
    } catch (error) {
      console.log(error)
        if(error.response.data.errorMessage) setLoginErrorResponse(error.response.data.errorMessage);
        else setLoginErrorResponse("Internal Server Error")
        setIsSubmitting(false);
        console.error(error);
    }
  };

  return (
    <>
      <Modal show={showRegisterModal} onHide={handleCloseRegisterModal}>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <MessageModal title={dialogModalTitle}
            body={dialogModalBody}
            show={showMessageModal}
            onHide={() => setShowMessageModal(false)}
        />
          <Form >
            <Form.Group controlId="registerEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" name="email"
                  className="login-form-control"
                  value={registerFormData.email}
                  onChange={registerFormChange}
                  readOnly={registerResponse}/>
            </Form.Group>

            <Form.Group controlId="registerPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password"
                  className="login-form-control"
                  name="password"
                  value={registerFormData.password}
                  onChange={registerFormChange}
                  readOnly={registerResponse}/>
            </Form.Group>

            <Form.Group controlId="registerRepeatPassword">
              <Form.Label>Repeat Password</Form.Label>
              <Form.Control type="password" placeholder="Repeat Password"
                  className="login-form-control"
                  name="password_confirmation"
                  value={registerFormData.password_confirmation}
                  onChange={registerFormChange}
                  readOnly={registerResponse}/>
            </Form.Group>
          </Form>
          {registerResponse=="Success" &&
              <div className="small_success">
                <small></small>
                <small >Please, check email you provided and confirm registration</small>
              </div>
          }
          {registerResponse=="Error" &&
              <div className="small_error">
                <small></small>
                <small >An error occurred during registration. Please, try again later</small>
              </div>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLoginModal}>
            Cancel
          </Button>
          <Button variant="primary" disabled={isSubmitting || registerResponse} onClick={registerUserSubmit}>Register</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showLoginModal} onHide={handleCloseLoginModal}>
        <Modal.Header>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="loginEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" name="email"
                  className="login-form-control"
                  value={loginFormData.email}
                  onChange={loginFormChange}/>
            </Form.Group>

            <Form.Group controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" name="password"
                  className="login-form-control"
                  value={loginFormData.password}
                  onChange={loginFormChange}/>
            </Form.Group>
          </Form>
          <Button type="button" className="btn btn-link float-right register-btn"
            onClick={handleRegisterClick}>Register</Button>
            {loginErrorResponse &&
                <div className="small_error">
                  <small></small>
                  <small >{loginErrorResponse}</small>
                </div>
            }
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLoginModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={loginUserSubmit} disabled={isSubmitting}>Login</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LoginModal;
