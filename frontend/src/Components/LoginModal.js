import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function LoginModal({onCancelButtonClick}) {

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

  return (
    <>
      <Modal show={showRegisterModal} onHide={handleCloseRegisterModal}>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="registerEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group controlId="registerPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <Form.Group controlId="registerRepeatPassword">
              <Form.Label>Repeat Password</Form.Label>
              <Form.Control type="password" placeholder="Repeat Password" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLoginModal}>
            Cancel
          </Button>
          <Button variant="primary">Register</Button>
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
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
          </Form>
          <Button type="button" className="btn btn-link float-right register-btn"
           onClick={handleRegisterClick}>Register</Button>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLoginModal}>
            Cancel
          </Button>
          <Button variant="primary">Login</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LoginModal;
