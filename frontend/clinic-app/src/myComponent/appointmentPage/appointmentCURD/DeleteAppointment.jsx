import { useState, forwardRef, useImperativeHandle } from "react";

import { Modal, Button, Alert } from "react-bootstrap";

import React from "react";

import "./DeleteAppointment.css";

const DeleteAppointment = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    deleteAppointment,
  }));

  const [show, setShow] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const [showError, setShowError] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseError = () => setShowError(false);
  const handleShowError = () => setShowError(true);

  const handleDelete = () => {
    confirmDelete(); // Call the onDelete function with the item
    handleClose(); // Close the modal
  };

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000); // Hide the message after 2 seconds
  };

  function confirmDelete() {
    fetch(
      process.env.REACT_APP_PROTOCOL +
        "://" +
        process.env.REACT_APP_BASE_URL +
        ":" +
        process.env.REACT_APP_PORT +
        "/deleteAppointment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleteID: selectedID }),
      }
    )
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        if (data === "yes") {
          props.loadAppointment();
          /// Data Deleted
          handleShowMessage();
        }
      })
      .catch((error) => console.error(error));
  }

  function deleteAppointment(id) {
    setSelectedID(id);

    if (id == null) {
      handleShowError();
    } else {
      handleShow();
    }
  }

  return (
    <div>
        <Alert className="fixed-top" show={showMessage} variant="success">
            Appointment Deleted Succesfully
          </Alert>
      <>
        <div>
          

          <Modal show={showError} onHide={handleCloseError}>
            <Modal.Header closeButton>
              <Modal.Title>
                {" "}
                <b style={{ color: "red" }}> Error !!! </b>{" "}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
             <b> Select Appointment Row First To Which Will Delete !!!{" "} </b> 
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleCloseError}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title> <b style={{color:"rgb(255, 94, 0)"}} > Confirm Deletion </b></Modal.Title>
          </Modal.Header>
          <Modal.Body>
           <b style={{fontSize:"110%"}}>   Are you sure you want to delete ID : "{selectedID}" ? </b>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </div>
  );
});

export default DeleteAppointment;
