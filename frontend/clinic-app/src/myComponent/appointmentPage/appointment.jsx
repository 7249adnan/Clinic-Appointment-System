import Button from "react-bootstrap/Button";
import { useState, useRef } from "react";

import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { Modal } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import ShowAppointment from "./appointmentCURD/ShowAppointment";

function Appointment() {
  const [createModalShow, setCreateModalShow] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const [showError, setShowError] = useState(false);

  const handleUpdateCloseError = () => setShowError(false);
  const handleUpdateShowError = () => setShowError(true);

  const createRef = useRef(null);
  const showRef = useRef(null);
  const deleteRef = useRef(null);

  if (createRef.current) {
    createRef.current.createDoctor();
  }

  const ReloadDoctorData = () => {
    if (showRef.current) {
      showRef.current.LoadData();
    }
  };

  function deleteDoctor() {
    if (deleteRef.current) {
      deleteRef.current.deleteDoctor(selectedID);
    }
  }

  let navigate = useNavigate();

  function gotoCreateAppointment() {
    navigate("/appointment/createappointment", {
      replace: true,
      state: { ID: "null" },
    });
  }

  function gotoUpdateDoctor() {
    if (selectedID == null) {
      handleUpdateShowError();
    } else {
      navigate("/doctor/updateDoctor", {
        replace: true,
        state: { ID: selectedID },
      });
    }
  }

  function setId(id) {
    setSelectedID(id);
  }

  return (
    <>
      <Modal show={showError} onHide={handleUpdateCloseError}>
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            <b style={{ color: "red" }}> Error !!! </b>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Select Doctor Row First To Which Will Update !!!{" "}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleUpdateCloseError}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* <CreateDoctor
        show={createModalShow}
        onShow={() => setCreateModalShow(true)}
        ref={createRef}
        onHide={() => setCreateModalShow(false)}
        loadDoctors={ReloadDoctorData}
      /> */}
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
          <Row
            style={{
              textAlign: "center",
              fontSize: "130%",
              paddingBottom: "4%",
              marginLeft: "40%",
              fontWeight: "700",
              color: "blue",
            }}
          >
            APPOINTMENT OPERATIONS{" "}
          </Row>
          <Col>
            <Button
              variant="primary"
              className="mx-2  "
              size="lg"
              onClick={gotoCreateAppointment}
              //   onClick={createDoctor}
            >
              {" "}
              Create{" "}
            </Button>
            {/* <Button variant="success" onClick={() => setUpdateModalShow(true)} className="mx-2"> */}
            <Button
              variant="success"
              size="lg"
              className="mx-2"
              onClick={gotoUpdateDoctor}
            >
              {" "}
              Update{" "}
            </Button>
            <Button
              variant="danger"
              size="lg"
              className="mx-2"
              onClick={deleteDoctor}
            >
              {" "}
              Delete{" "}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="mx-2"
              onClick={ReloadDoctorData}
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
              //   onClick={createDoctor}
              className="w-75 mb-2  mx-4"
            >
              Create
            </Button>
            <Button
              variant="success"
              className="w-75 mx-4"
              onClick={gotoUpdateDoctor}
            >
              Update{" "}
            </Button>
          </Col>
          <Col xs={6}>
            <Button
              variant="danger"
              className="w-75 mb-2"
              onClick={deleteDoctor}
            >
              Delete
            </Button>
            <Button
              variant="secondary"
              className="w-75"
              onClick={ReloadDoctorData}
            >
              Reload
            </Button>
          </Col>
        </Row>
      </Container>

      <Container >
        <ShowAppointment />
      </Container>

      {/* <ShowDoctor ref={showRef} setIdIndex={setId} /> */}
      {/* <DeleteDoctor ref={deleteRef} loadDoctors={ReloadDoctorData} /> */}
    </>
  );
}

export default Appointment;
