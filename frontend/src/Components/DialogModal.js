import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const DialogModal = (props) => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleConfirm = () => {
      props.onConfirm();
      setShow(false);
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        Open Dialog Modal
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DialogModal;
