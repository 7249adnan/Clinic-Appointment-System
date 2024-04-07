import "./CreateAppointment.css";
import Modal from "react-bootstrap/Modal";
import React, { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import BookingSystem from "./AppointmentSlot";

import { Container, Row, Col, Form, Button, FormCheck } from "react-bootstrap";

function CreateAppointment() {
  let navigate = useNavigate();
  const [choosePatientModalShow, setChoosePatientModalShow] = useState(false);
  const [chooseDoctorModalShow, setChooseDoctorModalShow] = useState(false);
  const [chooseAppointmentModalShow, setChooseAppointmentModalShow] =
    useState(false);

  const [errorMessage, SetErrorMessage] = useState("");

  const [searchText, setSearchText] = useState("");
  const [selectedValue, setSelectedValue] = useState("number");

  const [patientSelectedID, setPatientSelectedID] = useState(null);
  const handleChoosePatientModalClose = () => setChoosePatientModalShow(false);
  const handleChoosePatientModalShow = () => {
    setSelectedValue("number");
    setChoosePatientModalShow(true);
  };

  const [doctorSelectedID, setDoctorSelectedID] = useState(null);
  const handleChooseDoctorModalClose = () => setChooseDoctorModalShow(false);
  const handleChooseDoctorModalShow = () => {
    setSelectedValue("number");
    setChooseDoctorModalShow(true);
  };

  const handleChooseAppointmentModalClose = () =>
    setChooseAppointmentModalShow(false);
  const handleChooseAppointmentModalShow = () =>
    setChooseAppointmentModalShow(true);

  const [showError, setShowError] = useState(false);
  const handleCloseError = () => setShowError(false);
  const handleShowError = () => setShowError(true);

  const [showZero, setShowZero] = useState(false);
  const handleCloseZero = () => setShowZero(false);
  const handleShowZero = () => setShowZero(true);

  const handleCloseCreated = () => setShowCreated(false);
  const handleShowCreated = () => setShowCreated(true);
  const [showCreated, setShowCreated] = useState(false);

  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    doctorName: "",
    doctorId: "",
    startTime: "",
    startDate: "",
    timeString: "",
    dateString: "",
    status: "Open",
    totalFees: "",
    remainingFees: "",
    paidFees: "",
  });

  function goToAppointment() {
    navigate("/appointment", {
      replace: true,
    });
  }

  const [patientFormData, setPatientFormData] = useState({});

  const [doctorFormData, setDoctorFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handlePatientIDChange = (event) => {
    setPatientSelectedID(event.target.value);
  };

  const handleDoctorIDChange = (event) => {
    setDoctorSelectedID(event.target.value);
  };

  const handleSelect = (eventKey) => {
    setSelectedValue(eventKey);
  };

  const handleBlur = () => {
    if (searchText.trim() === "") {
      // LoadData();
    }
  };

  function setPatientName() {
    var val = 0;
    // eslint-disable-next-line
    Object.keys(patientFormData).map((key) => {
      // eslint-disable-next-line
      if (patientSelectedID == patientFormData[key].id) {

        console.log(patientFormData[key].name);
        console.log(patientFormData[key].number);
        

        setFormData({
          ...formData,
          patientName: patientFormData[key].name,
          patientId: patientFormData[key].id,
        });
        val = 1;
        handleChoosePatientModalClose();
        setSearchText("");
      }
    });
    if (val === 0) {
      SetErrorMessage(" First Plzz Select Patient . . . !!!");
      handleShowError();
    }
  }

  function setDoctorName() {
    var val = 0;
    // eslint-disable-next-line
    Object.keys(doctorFormData).map((key) => {
      // eslint-disable-next-line
      if (doctorSelectedID == doctorFormData[key].id) {
        setFormData({
          ...formData,
          doctorName: doctorFormData[key].name,
          doctorId: doctorFormData[key].id,
        });
        val = 1;
        handleChooseDoctorModalClose();
        setSearchText("");
      }
    });
    if (val === 0) {
      SetErrorMessage(" First Plzz Select Doctor . . . !!!");
      handleShowError();
    }
  }

  function findSearchPatient() {
    if (searchText === "") {
      SetErrorMessage(" First Plzz Enter a Value for Searching . . . !!!");
      handleShowError();
    } else {
      fetch(
        process.env.REACT_APP_PROTOCOL +
          "://" +
          process.env.REACT_APP_BASE_URL +
          ":" +
          process.env.REACT_APP_PORT +
          "/findUserBy",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ string: searchText, coloumn: selectedValue }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setPatientFormData(data);

          if (isEmpty(data)) {
            handleShowZero();
          }
        })
        .catch((error) => console.error(error));
    }
  }

  function findSearchDoctor() {
    if (searchText === "") {
      handleShowError();
    } else {
      fetch(
        process.env.REACT_APP_PROTOCOL +
          "://" +
          process.env.REACT_APP_BASE_URL +
          ":" +
          process.env.REACT_APP_PORT +
          "/findDoctorBy",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ string: searchText, coloumn: selectedValue }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setDoctorFormData(data);

          if (isEmpty(data)) {
            handleShowZero();
          }
        })
        .catch((error) => console.error(error));
    }
  }

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  function slotBooking(data) {
    setFormData({
      ...formData,
      startTime: data.Time,
      startDate: data.Date,
      timeString: data.timeString,
      dateString: data.dateString,
    });
  }

  function handleError() {
    if (formData.patientId === "") return "Select Patient";
    else if (formData.doctorId === "") return "Select Doctor";
    else if (formData.startTime === "") return "Select Appointment Slot";
    else if (formData.totalFees === "") return "Enter TotalFees";
    else return 0;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    var err = handleError();

    if (0 === err) {
      fetch(
        process.env.REACT_APP_PROTOCOL +
          "://" +
          process.env.REACT_APP_BASE_URL +
          ":" +
          process.env.REACT_APP_PORT +
          "/createAppointment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      )
        .then((response) => response.text())
        .then((data) => {
          if (data === "createdOK") {
            handleShowCreated();            
            setTimeout(() => {
              handleCloseCreated();
              goToAppointment();             
            }, 2000);
          }
        })
        .catch((error) => console.error(error));
    } else {
      SetErrorMessage(" First Plzz " + err + " . . . !!!");
      handleShowError();
    }
  };

  function setRemainingFees() {
    var A = 0,
      B = 0;
     

    if (formData.totalFees !== "" || formData.totalFees!==NaN ) {
      A = parseInt(formData.totalFees);
    }
    if (formData.advancedFees !== "") {
      B = parseInt(formData.advancedFees);
    }   
    
    setFormData({
      ...formData,
      remainingFees: (A - B ),
    });
  }

  return (
    <>
      <div>
        <Modal show={showError} onHide={handleCloseError}>
          <Modal.Header closeButton>
            <Modal.Title>
              {" "}
              <b style={{ color: "red" }}> Error !!! </b>{" "}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ fontSize: "120%" }}>
            <b> {errorMessage} </b>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleCloseError}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <div>
        <Modal show={showZero} onHide={handleCloseZero}>
          <Modal.Header closeButton>
            <Modal.Title>
              {" "}
              <b style={{ color: "orange" }}> No Record Found !!! </b>{" "}
            </Modal.Title>
          </Modal.Header>

          <Modal.Footer>
            <Button variant="danger" onClick={handleCloseZero}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <Modal
        className="d-none d-md-block"
        show={choosePatientModalShow}
        onHide={handleChoosePatientModalClose}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="modaltitle">
            Search and Select Patient
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Container>
            <Form>
              <Row>
                <div className="searchBar">
                  <InputGroup className="mb-3 mt-3">
                    <InputGroup.Text
                      style={{ fontSize: "20px" }}
                      id="basic-addon1"
                    >
                      Find
                    </InputGroup.Text>
                    <Form.Control
                      style={{ fontSize: "20px" }}
                      placeholder="Search . . ."
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      onChange={handleSearchChange}
                      onBlur={handleBlur}
                    />

                    <Dropdown onSelect={handleSelect}>
                      <Dropdown.Toggle
                        style={{ fontSize: "18px" }}
                        className="mx-1"
                        variant="secondary"
                        id="dropdown-basic"
                      >
                        {selectedValue}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item eventKey="number">Number</Dropdown.Item>
                        <Dropdown.Item eventKey="email">email</Dropdown.Item>
                        <Dropdown.Item eventKey="name">name</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <Button
                      variant="primary"
                      onClick={findSearchPatient}
                      style={{ fontSize: "20px" }}
                      className="mx-2    "
                    >
                      {" "}
                      Search
                    </Button>
                  </InputGroup>
                </div>
              </Row>

              <Row>
                <div className="pc-content">
                  <table>
                    <thead>
                      <tr>
                        <th className="data">Select</th>
                        <th className="data">Name</th>
                        <th className="data"> Email </th>
                        <th className="data"> Number </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Using Object.keys() to get an array of keys */}
                      {Object.keys(patientFormData).map((key) => (
                        <tr key={key}>
                          <td className="data">
                            {" "}
                            <FormCheck
                              type="radio"
                              name="radioGroup"
                              value={patientFormData[key].id}
                              onChange={handlePatientIDChange}
                            />{" "}
                          </td>
                          <td className="data">{patientFormData[key].name}</td>
                          <td className="data">{patientFormData[key].email}</td>
                          <td className="data">
                            {patientFormData[key].number}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Row>

              <br />
              <hr />

              <Row>
                <Col className="controlBtn">
                  {" "}
                  <Button variant="primary" size="lg" onClick={setPatientName}>
                    Selected
                  </Button>{" "}
                  &nbsp;&nbsp;
                  <Button
                    size="lg"
                    variant="danger"
                    onClick={handleChoosePatientModalClose}
                  >
                    {" "}
                    Close{" "}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>
        </Modal.Body>
      </Modal>

      <Modal
        className="d-none d-md-block"
        show={chooseDoctorModalShow}
        onHide={handleChooseDoctorModalClose}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="modaltitle">
            Search and Select Doctor
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Container>
            <Form>
              <Row>
                <div className="searchBar">
                  <InputGroup className="mb-3 mt-3">
                    <InputGroup.Text
                      style={{ fontSize: "20px" }}
                      id="basic-addon1"
                    >
                      Find
                    </InputGroup.Text>
                    <Form.Control
                      style={{ fontSize: "20px" }}
                      placeholder="Search . . ."
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      onChange={handleSearchChange}
                      onBlur={handleBlur}
                    />

                    <Dropdown onSelect={handleSelect}>
                      <Dropdown.Toggle
                        style={{ fontSize: "18px" }}
                        className="mx-1"
                        variant="secondary"
                        id="dropdown-basic"
                      >
                        {selectedValue}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item eventKey="number">Number</Dropdown.Item>
                        <Dropdown.Item eventKey="email">email</Dropdown.Item>
                        <Dropdown.Item eventKey="name">name</Dropdown.Item>
                        <Dropdown.Item eventKey="specialist">
                          Specialist
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <Button
                      variant="primary"
                      onClick={findSearchDoctor}
                      style={{ fontSize: "20px" }}
                      className="mx-2    "
                    >
                      {" "}
                      Search
                    </Button>
                  </InputGroup>
                </div>
              </Row>

              <Row>
                <div className="pc-content">
                  <table>
                    <thead>
                      <tr>
                        <th className="data">Select</th>
                        <th className="data">Name</th>
                        <th className="data"> Email </th>
                        <th className="data"> Number </th>
                        <th className="data"> Specialist </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Using Object.keys() to get an array of keys */}
                      {Object.keys(doctorFormData).map((key) => (
                        <tr key={key}>
                          <td className="data">
                            {" "}
                            <FormCheck
                              type="radio"
                              name="radioGroup"
                              value={doctorFormData[key].id}
                              onChange={handleDoctorIDChange}
                            />{" "}
                          </td>
                          <td className="data">{doctorFormData[key].name}</td>
                          <td className="data">{doctorFormData[key].email}</td>
                          <td className="data">{doctorFormData[key].number}</td>
                          <td className="data">
                            {" "}
                            {doctorFormData[key].specialist}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Row>

              <br />
              <hr />

              <Row>
                <Col className="controlBtn">
                  {" "}
                  <Button variant="primary" size="lg" onClick={setDoctorName}>
                    Selected
                  </Button>{" "}
                  &nbsp;&nbsp;
                  <Button
                    size="lg"
                    variant="danger"
                    onClick={handleChooseDoctorModalClose}
                  >
                    {" "}
                    Close{" "}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>
        </Modal.Body>
      </Modal>

      <Modal
        className="d-none d-md-block"
        show={chooseAppointmentModalShow}
        onHide={handleChooseAppointmentModalClose}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="modaltitle">
            Select Appointment [ Date & Slot ]
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Container>
            <Form>
              <Row>
                <BookingSystem
                  onSlotBook={(data) => {
                    slotBooking(data);
                  }}
                  onError={(err) => {
                    SetErrorMessage(err);
                    handleShowError();
                  }}
                  onHide={() => handleChooseAppointmentModalClose()}
                  doctorId={doctorSelectedID}
                />
              </Row>
            </Form>
          </Container>
        </Modal.Body>
      </Modal>

      <Modal show={showCreated} onHide={handleCloseCreated}>
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            <b style={{ color: "green" }}>
              {" "}
              Appointment Created Succesfully !!!{" "}
            </b>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseCreated}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Container className="createForm">
        <Form onSubmit={handleSubmit}>
          <Row className="formHead">
            <label htmlFor=""> CREATE APPOINTMENT </label>
          </Row>
          <hr />
          <br />
          <Row>
            <Col>
              <Form.Group controlId="formName">
                <div className="formgroup">
                  <label htmlFor="" className="labelfont">
                    Select Patient :{" "}
                  </label>{" "}
                  &nbsp;
                  <input
                    type="text"
                    className="disableInput"
                    value={formData.patientName}
                    disabled
                    name="patientName"
                    id=""
                  />{" "}
                  &nbsp;
                  <Button
                    size="sm"
                    className="chooseBtn"
                    onClick={handleChoosePatientModalShow}
                    variant="primary"
                  >
                    {" "}
                    Choose{" "}
                  </Button>
                </div>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formName">
                <div className="formgroup">
                  <label htmlFor="" className="labelfont">
                    Select Doctor :{" "}
                  </label>{" "}
                  &nbsp;
                  <input
                    type="text"
                    className="disableInput"
                    value={" Dr. " + formData.doctorName}
                    disabled
                    name=""
                    id=""
                  />{" "}
                  &nbsp;
                  <Button
                    size="sm"
                    onClick={handleChooseDoctorModalShow}
                    className="chooseBtn"
                    variant="primary"
                  >
                    {" "}
                    Choose{" "}
                  </Button>
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="formName">
                <div className="formgroup">
                  <label htmlFor="" className="labelfont">
                    Select Appointment :{" "}
                  </label>{" "}
                  &nbsp;
                  <label htmlFor="" className="labelfont">
                    <b> Date :</b>{" "}
                  </label>{" "}
                  &nbsp; &nbsp;
                  <input
                    type="text"
                    className="disableInput"
                    value={"  " + formData.dateString}
                    disabled
                    name=""
                    id=""
                  />
                  <label htmlFor="" className="labelfont">
                    <b> Time : </b>{" "}
                  </label>{" "}
                  &nbsp; &nbsp;
                  <input
                    type="text"
                    className="disableInput"
                    value={"  " + formData.timeString}
                    disabled
                    name=""
                    id=""
                  />{" "}
                  &nbsp;
                  <Button
                    size="sm"
                    disabled={doctorSelectedID === null}
                    onClick={handleChooseAppointmentModalShow}
                    className="chooseBtn"
                    variant="primary"
                  >
                    {" "}
                    Choose{" "}
                  </Button>
                </div>
              </Form.Group>
            </Col>
           
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="Specialist">
                <div className="formgroup2">
                  <Form.Label className="labelfont">
                    {" "}
                    Appoinment Status :{" "}
                  </Form.Label>
                  <Form.Control
                    as="select"
                    value={formData.status}
                    name="status"
                    onChange={handleChange}
                    required
                  >
                    <option value="Open">Open</option>
                    <option value="Waiting">Waiting</option>
                    <option value="Closed">Closed</option>
                    <option value="Missed">Missed</option>
                  </Form.Control>
                </div>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="formMobile">
                <div className="formgroup2">
                  <Form.Label className="labelfont">Total Fees : </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="400 Rs"
                  
                    name="totalFees"
                    minLength={10}
                    value={formData.totalFees}
                    onKeyUp={setRemainingFees}
                    onChange={handleChange}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formMobile">
                <div className="formgroup2">
                  <Form.Label className="labelfont">
                    Advanced Fees :{" "}
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="200 Rs"
                    name="advancedFees"
                   
                    minLength={10}
                    value={formData.advancedFees}
                    onKeyUp={setRemainingFees}
                    onChange={handleChange}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formMobile">
                <div className="formgroup2">
                  <Form.Label className="labelfont">
                    Remaining Fees :{" "}
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="400 Rs"
                    name="remainingFees"
                    step={50}
                    disabled
                    minLength={10}
                    value={formData.remainingFees}
                    onChange={handleChange}
                  />
                </div>
              </Form.Group>
            </Col>
            
          </Row>
          
          <br />
          <hr />

          <Row>
            <Col className="controlBtn">
              {" "}
              <Button size="lg" variant="primary" type="submit">
                Create Appointment
              </Button>{" "}
              &nbsp;&nbsp;
              <Button size="lg" onClick={goToAppointment} variant="danger">
                {" "}
                Back to Page{" "}
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
}

export default CreateAppointment;
