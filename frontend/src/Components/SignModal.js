import React, { useState, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { UserContext } from './../Contexts/UserContext';

function SignModal(props) {

  const { loggedIn, token, email, account, setAccount } = useContext(UserContext);
  const [providedValue, setProvidedValue] = useState('');

  const handleProvidedValueChange = (event) => {
      const newValue = event.target.value;
      setProvidedValue(newValue);
  }

  const handleConfirm = () => {
    let returnValue = providedValue;
    // if (returnValue.startsWith("0x")) {
    //     returnValue = returnValue.substring(2);
    //   }
    props.onConfirm(returnValue);
  }

  return (
    <>
      <Modal show={props.onShow} onHide={props.onHide}>
        <Modal.Header>
          <Modal.Title>{props.signModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form >
            <Form.Group controlId="registerEmail">
              <Form.Label>{props.signModalInput}:</Form.Label>
              <Form.Control type="text" className="login-form-control"
                  value={providedValue} onChange={handleProvidedValueChange}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>Cancel</Button>
          <Button variant="primary" onClick={handleConfirm}>Add</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SignModal;
