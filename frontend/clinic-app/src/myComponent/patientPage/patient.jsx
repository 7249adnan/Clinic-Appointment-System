import Button from "react-bootstrap/Button";
import { useState, useRef } from "react";


import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import CreatePatient from "./patientCURD/createPatient";
import ShowPatient from "./patientCURD/showPatient";
import DeletePatient from "./patientCURD/deletePatient";
import UpdatePatient from "./patientCURD/updatePatient";

function Patient() {
  const [modalShow, setModalShow] = React.useState(false);
  const [updateModalShow, setUpdateModalShow] = React.useState(false);

  const [selectedID, setSelectedID] = useState(null);

  const childRef = useRef(null);
  const deleteRef = useRef(null);
  const updateRef = useRef(null);

  const callChildFunction = () => {
    if (childRef.current) {
      childRef.current.LoadData();
    }
  };

  function deletePatient() {
    if (deleteRef.current) {
      deleteRef.current.deletePatient(selectedID);
    }
  }

  function updatePatient() {
    if (updateRef.current) {
      updateRef.current.updatePatient(selectedID);
    }
  }

  const ReloadPatientData = () => {
    if (childRef.current) {
      childRef.current.LoadData();
    }
  };


  
  // const handleShowMessage = () => {
  //   setShowMessage(true);
  //   setTimeout(() => {
  //     setShowMessage(false);
  //   }, 2000); // Hide the message after 2 seconds
  // };

  function setId(id) {
    setSelectedID(id);
  }

  return (
    <>
      <CreatePatient
        show={modalShow}
        loadPatients={ReloadPatientData}
        onHide={() => setModalShow(false)}
      />
      <UpdatePatient
        show={updateModalShow}
        onShow={() => setUpdateModalShow(true)}
        ref={updateRef}
        loadPatients={ReloadPatientData}
        onHide={() => setUpdateModalShow(false)}
      />

      <Container>
        {/* Single row for desktop */}
        <Row
          className="d-none d-md-flex justify-content-center"
          style={{
            textAlign: "center",
            backgroundColor: "#edeef3",
            width: "40%",
            marginLeft: "30%",
            marginTop: "3%",
            paddingBottom: "2%",
            paddingTop: "1%",
            border: "3px solid black",
          }}
        >
          <Row  style={{
          textAlign: "center",
          fontSize:"130%",
          paddingBottom: "4%",
          marginLeft: "50%",
          fontWeight:"700",
          color:"blue",
          
        
        }} >PATIENT OPERATIONS </Row>
          <Col>
            <Button
              variant="primary"
              className="mx-2  "
              size="lg"
              onClick={() => setModalShow(true)}
            >
              {" "}
              Create{" "}
            </Button>
            {/* <Button variant="success" onClick={() => setUpdateModalShow(true)} className="mx-2"> */}
            <Button
              variant="success"
              size="lg"
              onClick={updatePatient}
              className="mx-2"
            >
              {" "}
              Update{" "}
            </Button>
            <Button
              variant="danger"
              size="lg"
              onClick={deletePatient}
              className="mx-2"
            >
              {" "}
              Delete{" "}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={callChildFunction}
              className="mx-2"
            >
              {" "}
              Reload{" "}
            </Button>
          </Col>
        </Row>

        {/* Two rows for mobile */}
        <Row
          className="d-flex d-md-none "
          style={{
            textAlign: "center",
            backgroundColor: "#edeef3",
            width: "100%",
            marginLeft: "1%",
            marginTop: "2%",
            paddingBottom: "2%",
            paddingTop: "2%",
            border: "3px solid black",
          }}
        >
          <Col xs={6}>
            <Button
              variant="primary"
              onClick={() => setModalShow(true)}
              className="w-75 mb-2  mx-4"
            >
              Create
            </Button>
            <Button
              variant="success"
              onClick={updatePatient}
              className="w-75 mx-4"
            >
              Update{" "}
            </Button>
          </Col>
          <Col xs={6}>
            <Button
              variant="danger"
              onClick={deletePatient}
              className="w-75 mb-2   "
            >
              Delete
            </Button>
            <Button
              variant="secondary"
              onClick={callChildFunction}
              className="w-75"
            >
              Reload
            </Button>
          </Col>
        </Row>
      </Container>

      <ShowPatient ref={childRef} setIdIndex={setId} />

      <DeletePatient ref={deleteRef} loadPatients={ReloadPatientData} />
  
      {/* <TestPage/> */}
    </>
  );
}

export default Patient;
