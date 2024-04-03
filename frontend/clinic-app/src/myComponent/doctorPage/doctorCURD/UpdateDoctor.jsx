import "./UpdateDoctor.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  FormCheck,
  Alert,
} from "react-bootstrap";
import React, { useState, forwardRef, useEffect } from "react";
import { Modal } from "react-bootstrap";

const UpdateDoctor = forwardRef((props, ref) => {
  let navigate = useNavigate();
  const location = useLocation();
  const [selectedID, setSelectedID] = useState(2);
  const [selectedDateID, setSelectedDateID] = useState();
  const [isMobile, setIsMobile] = useState(false);

  const [showTimeError, setShowTimeError] = useState(false);

  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertErrMessage, setAlertErrMessage] = useState("");

  const handleUpdateTimeCloseError = () => setShowTimeError(false);
  const handleUpdateTimeShowError = () => setShowTimeError(true);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    isActive: "yes",
    specialist: "Cardiologist",
    number: "",
    slotTime: 10,
  });

  const [formAvailability, setFormAvailability] = useState({
    id: "",
    doctorId: "",

    isMon: true,
    monStart: "",
    monEnd: "",

    isTue: true,
    tueStart: "",
    tueEnd: "",

    isWed: true,
    wedStart: "",
    wedEnd: "",

    isThu: true,
    thuStart: "",
    thuEnd: "",

    isFri: true,
    friStart: "",
    friEnd: "",

    isSat: true,
    satStart: "",
    satEnd: "",

    isSun: true,
    sunStart: "",
    sunEnd: "",
  });

  const [timeError, setTimeError] = useState({
    isMon: false,
    isTue: false,
    isWed: false,
    isThu: false,
    isFri: false,
    isSat: false,
    isSun: false,
  });

  const [holidayDate, setHolidayDate] = useState({
    ID: "",
    doctorID: "",
    startDate: "",
    endDate: "",
  });

  const [DateError, setDateError] = useState(false);

  const [formDateData, setFormDateData] = useState({});

  const [showDateDeleteError, setShowDateDeleteError] = useState(false);

  const [showDateDeleteConfirm, setShowDateDeleteConfirm] = useState(false);

  const [showUpdated, setShowUpdated] = useState(false);

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000); // Hide the message after 2 seconds
  };

  useEffect(() => {
    console.log(selectedID);
    setSelectedID(location.state.ID);
    loadBasicInfo(location.state.ID);
    loadAvailabitlityInfo(location.state.ID);
    setHolidayDate({ ...holidayDate, doctorID: location.state.ID });
    setIsMobile(window.innerWidth < 768);
    loadDateData(location.state.ID);
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target;
    setFormAvailability({ ...formAvailability, [name]: value });
  };

  const handleAvailabilityCheckBox = (e) => {
    const { name, checked } = e.target;
    setFormAvailability({ ...formAvailability, [name]: checked });
  };

  const handleHolidayChange = (e) => {
    const { name, value } = e.target;
    setHolidayDate({ ...holidayDate, [name]: value });
  };

  const handleDateIDChange = (event) => {
    setHolidayDate({ ...holidayDate, ID: event.target.value });
    setSelectedDateID(event.target.value);
  };

  const handleCloseDeleteDateError = () => setShowDateDeleteError(false);
  const handleShowDeleteDateError = () => setShowDateDeleteError(true);

  const handleCloseDeleteDateConfirm = () => setShowDateDeleteConfirm(false);
  const handleShowDeleteDateConfirm = () => setShowDateDeleteConfirm(true);

  const handleCloseUpdated = () => setShowUpdated(false);
  const handleShowUpdated = () => setShowUpdated(true);

  const handleHolidayDateDelete = () => {
    confirmHolidayDateDelete(); // Call the onDelete function with the item
    handleCloseDeleteDateConfirm(); // Close the modal
  };

  function checkError() {
    var err = 0;

    Object.keys(timeError).forEach((day) => {
      console.log(`${day}: ${timeError[day]}`);
      if (timeError[day] === true) {
        if (formAvailability[day] === true) {
          err = 1;
        }
      }
    });

    if (err === 1) {
      handleUpdateTimeShowError();
      return 1;
    } else {
      return 0;
    }
  }

  function loadBasicInfo(Id) {
    fetch(
      process.env.REACT_APP_PROTOCOL +
        "://" +
        process.env.REACT_APP_BASE_URL +
        ":" +
        process.env.REACT_APP_PORT +
        "/getOneDoctor",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorID: Id }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fillSection1(data);
      })
      .catch((error) => console.error(error));
  }

  function fillSection1(data) {
    formData.id = location.state.ID;
    formData.name = data.name;
    formData.email = data.email;
    formData.number = data.number;
    formData.slotTime = data.slotTime;
    formData.specialist = data.specialist;

    if (data.isActive) {
      formData.isActive = "yes";
    } else {
      formData.isActive = "no";
    }
    setFormData({ ...formData });
  }

  function loadAvailabitlityInfo(Id) {
    fetch(
      process.env.REACT_APP_PROTOCOL +
        "://" +
        process.env.REACT_APP_BASE_URL +
        ":" +
        process.env.REACT_APP_PORT +
        "/getOneAvailability",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorID: Id }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data != null) {
          setFormAvailability(data);
        }
      })
      .catch((error) => console.error(error));
  }

  function loadDateData(id) {
    fetch(
      process.env.REACT_APP_PROTOCOL +
        "://" +
        process.env.REACT_APP_BASE_URL +
        ":" +
        process.env.REACT_APP_PORT +
        "/getDoctorHolidayDates",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorID: id }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setFormDateData(data);
      })
      .catch((error) => console.error(error));
  }

  function updateBasicInfo() {
    console.log("updating Basic Info ");
    console.log(formData);

    fetch(
      process.env.REACT_APP_PROTOCOL +
        "://" +
        process.env.REACT_APP_BASE_URL +
        ":" +
        process.env.REACT_APP_PORT +
        "/updateDoctorBasicInfo",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    )
      .then((response) => response.text())
      .then((data) => {
        if (data === "updatedOK") {
          return 1;
        }
      })
      .catch((error) => console.error(error));
  }

  function updateAvailInfo() {
    console.log(formAvailability);
    console.log(formAvailability.doctorId);

    fetch(
      process.env.REACT_APP_PROTOCOL +
        "://" +
        process.env.REACT_APP_BASE_URL +
        ":" +
        process.env.REACT_APP_PORT +
        "/updateDoctorAvailInfo",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formAvailability),
      }
    )
      .then((response) => response.text())
      .then((data) => {
        if (data === "updatedOK") {
          return 1;
        }
      })
      .catch((error) => console.error(error));
  }

  function goToDoctor() {
    navigate("/doctor", {
      replace: true,
      state: { ID: selectedID },
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    var isError = checkError();

    if (isError === 0) {
      updateBasicInfo();
      updateAvailInfo();
      handleShowUpdated();

      setTimeout(() => {
        goToDoctor();
      }, 2000);
    }
  };

  function checkTime(start, end, day) {
    if (start < end) {
      setTimeError({ ...timeError, [day]: false });
    } else if (start >= end) {
      setTimeError({ ...timeError, [day]: true });
    }
  }

  function checkHolidayDate() {
    if (holidayDate.startDate > holidayDate.endDate) {
      setDateError(true);
    } else {
      setDateError(false);
    }
  }

  function createHoliday(e) {
    e.preventDefault();

    if (
      !DateError &&
      holidayDate.startDate !== "" &&
      holidayDate.endDate !== ""
    ) {
      console.log(holidayDate);

      fetch(
        process.env.REACT_APP_PROTOCOL +
          "://" +
          process.env.REACT_APP_BASE_URL +
          ":" +
          process.env.REACT_APP_PORT +
          "/createDoctorHoliday",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(holidayDate),
        }
      )
        .then((response) => response.text())
        .then((data) => {
          if (data === "createdOK") {
            loadDateData(selectedID);
            setAlertMessage("Created");
            handleShowMessage();
          }
        })
        .catch((error) => console.error(error));
    } else {
      setAlertErrMessage(" Select Holiday Date Properly ");
      handleShowDeleteDateError(true);
    }
  }

  function confirmHolidayDateDelete() {
    fetch(
      process.env.REACT_APP_PROTOCOL +
        "://" +
        process.env.REACT_APP_BASE_URL +
        ":" +
        process.env.REACT_APP_PORT +
        "/deleteDoctorHoliday",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleteID: selectedDateID }),
      }
    )
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        if (data === "yes") {
          loadDateData(selectedID);
          setAlertMessage("Deleted");
          setSelectedDateID();
          handleShowMessage();
        }
      })
      .catch((error) => console.error(error));
  }

  function deleteHoliday() {
    if (selectedDateID != null) {
      handleShowDeleteDateConfirm();
    } else {
      setAlertErrMessage(" Select Holiday Row to Which will Delete ");
      handleShowDeleteDateError(true);
    }
  }

  function updateHoliday() {
    if (
      !DateError &&
      holidayDate.startDate !== "" &&
      holidayDate.endDate !== ""
    ) {
      if (selectedDateID != null) {
        console.log(holidayDate);

        fetch(
          process.env.REACT_APP_PROTOCOL +
            "://" +
            process.env.REACT_APP_BASE_URL +
            ":" +
            process.env.REACT_APP_PORT +
            "/updateDoctorHoliday",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(holidayDate),
          }
        )
          .then((response) => response.text())
          .then((data) => {
            if (data === "updatedOK") {
              loadDateData(selectedID);
              setAlertMessage("Update");
              setSelectedDateID();
              handleShowMessage();
            }
          })
          .catch((error) => console.error(error));
      } else {
        setAlertErrMessage(" Select Holiday Row to Which will update ");
        handleShowDeleteDateError(true);
      }
    } else {
      setAlertErrMessage(" Select Holiday Date Properly ");
      handleShowDeleteDateError(true);
    }
  }

  return (
    <>

  {/* remaining to convert to mobile Format visual  */}

      <Modal show={showTimeError} onHide={handleUpdateTimeCloseError}>
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            <b style={{ color: "red" }}> Error !!! </b>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <b> Select Correct Availability Time !!! </b>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleUpdateTimeCloseError}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDateDeleteError} onHide={handleCloseDeleteDateError}>
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            <b style={{ color: "red" }}> Error !!! </b>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <b> {alertErrMessage} !!! </b>{" "}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleCloseDeleteDateError}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDateDeleteConfirm} onHide={handleCloseDeleteDateConfirm}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete ID : "{selectedDateID}" ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteDateConfirm}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleHolidayDateDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdated} onHide={handleCloseUpdated}>
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            <b style={{ color: "green" }}>
              {" "}
              Doctor Details Updated Succesfully !!!{" "}
            </b>{" "}
          </Modal.Title>
        </Modal.Header>

        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseUpdated}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Container className="updateForm">
        <Form onSubmit={handleSubmit}>
          <Row className="formHead">
            <label htmlFor=""> UPDATE DOCTOR RECORD</label>
          </Row>
          <hr />
          <br />
          <Row className="subformHead">
            <label htmlFor="">
              {" "}
              <b style={{ color: "red" }}>*</b> Basic Information{" "}
            </label>
          </Row>
          <Row className="pb-3">
            <Col>
              <Form.Group controlId="formName">
                <Form.Label className="labelfont">Name </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  minLength={4}
                  maxLength={50}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              {" "}
              <Form.Group controlId="formEmail">
                <Form.Label className="labelfont">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  maxLength={50}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              {" "}
              <Form.Group controlId="formMobile">
                <Form.Label className="labelfont">Mobile Number</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter your mobile number"
                  name="number"
                  minLength={10}
                  value={formData.number}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="pb-3">
            <Col className="pt-4 m-2">
              {" "}
              <Form.Group controlId="formGender">
                <Form.Label className="labelfont">
                  Active : &nbsp;&nbsp;{" "}
                </Form.Label>
                <Form.Check
                  type="radio"
                  label="Yes"
                  name="isActive"
                  value="yes"
                  checked={formData.isActive === "yes"}
                  onChange={handleChange}
                  required
                  inline
                />
                <Form.Check
                  type="radio"
                  label="no"
                  name="isActive"
                  value="no"
                  inline
                  checked={formData.isActive === "no"}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formZipCode">
                <Form.Label className="labelfont">Slot Time</Form.Label>
                <Form.Control
                  as="select"
                  value={formData.slotTime}
                  name="slotTime"
                  onChange={handleChange}
                  required
                >
                  <option value="5">5 Min </option>
                  <option value="10">10 Min </option>
                  <option value="15">15 Min </option>
                  <option value="20">20 Min </option>
                  <option value="30">30 Min </option>
                  <option value="45">45 Min </option>
                  <option value="60">1 Hr </option>
                  <option value="120">2 Hr </option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="Specialist">
                <Form.Label className="labelfont"> Specialist </Form.Label>
                <Form.Control
                  as="select"
                  value={formData.specialist}
                  name="specialist"
                  onChange={handleChange}
                  required
                >
                  <option value="Otolaryngologist/ENT">
                    Otolaryngologist/ENT
                  </option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Ophthalmologist">Ophthalmologist</option>
                  <option value="Gastroenterologist">Gastroenterologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <br />
          <hr />
          <br />
          <Row className="subformHead">
            <label htmlFor="">
              {" "}
              <b style={{ color: "red" }}>*</b> Availability Information{" "}
            </label>
          </Row>
          <Row className="pb-5 pt-2">
            <Col>
              <Form.Group controlId="formName">
                <Form.Label className="labelfont">Monday </Form.Label>
                <Form.Check
                  type="checkbox"
                  label="Present"
                  id="exampleCheckbox"
                  name="isMon"
                  onChange={handleAvailabilityCheckBox}
                  checked={formAvailability.isMon}
                />
                <div className="startTime">
                  <label
                    style={{
                      color: formAvailability.isMon
                        ? "black"
                        : "rgb(170, 168, 168)",
                    }}
                    htmlFor=""
                    className="startTimeLabel"
                  >
                    Start Time : &nbsp;{" "}
                  </label>
                  <input
                    disabled={!formAvailability.isMon}
                    name="monStart"
                    type="time"
                    value={formAvailability.monStart}
                    onChange={handleAvailabilityChange}
                    onBlur={() =>
                      checkTime(
                        formAvailability.monStart,
                        formAvailability.monEnd,
                        "isMon"
                      )
                    }
                  />
                </div>
                <div className="startTime" style={{ paddingTop: "2%" }}>
                  <label
                    style={{
                      color: formAvailability.isMon
                        ? "black"
                        : "rgb(170, 168, 168)",
                    }}
                    htmlFor=""
                    className="startTimeLabel"
                  >
                    End Time : &nbsp;&nbsp;&nbsp;{" "}
                  </label>
                  <input
                    disabled={!formAvailability.isMon}
                    name="monEnd"
                    type="time"
                    value={formAvailability.monEnd}
                    onChange={handleAvailabilityChange}
                    onBlur={() =>
                      checkTime(
                        formAvailability.monStart,
                        formAvailability.monEnd,
                        "isMon"
                      )
                    }
                  />
                </div>
                {timeError.isMon && (
                  <p hidden={!formAvailability.isMon} className="timeError">
                    * End time must be after start time
                  </p>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formName">
                <Form.Label className="labelfont">Tuesday </Form.Label>
                <Form.Check
                  type="checkbox"
                  label="Present"
                  id="exampleCheckbox"
                  name="isTue"
                  onChange={handleAvailabilityCheckBox}
                  checked={formAvailability.isTue}
                />
                <div className="startTime">
                  <label
                    style={{
                      color: formAvailability.isTue
                        ? "black"
                        : "rgb(170, 168, 168)",
                    }}
                    htmlFor=""
                    className="startTimeLabel"
                  >
                    Start Time : &nbsp;{" "}
                  </label>
                  <input
                    name="tueStart"
                    type="time"
                    disabled={!formAvailability.isTue}
                    value={formAvailability.tueStart}
                    onChange={handleAvailabilityChange}
                    onBlur={() =>
                      checkTime(
                        formAvailability.tueStart,
                        formAvailability.tueEnd,
                        "isTue"
                      )
                    }
                  />
                </div>
                <div className="startTime" style={{ paddingTop: "2%" }}>
                  <label
                    style={{
                      color: formAvailability.isTue
                        ? "black"
                        : "rgb(170, 168, 168)",
                    }}
                    htmlFor=""
                    className="startTimeLabel"
                  >
                    End Time : &nbsp;&nbsp;&nbsp;{" "}
                  </label>
                  <input
                    name="tueEnd"
                    type="time"
                    disabled={!formAvailability.isTue}
                    value={formAvailability.tueEnd}
                    onChange={handleAvailabilityChange}
                    onBlur={() =>
                      checkTime(
                        formAvailability.tueStart,
                        formAvailability.tueEnd,
                        "isTue"
                      )
                    }
                  />
                </div>
                {timeError.isTue && (
                  <p hidden={!formAvailability.isTue} className="timeError">
                    * End time must be after start time
                  </p>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formName">
                <Form.Label className="labelfont">Wednesday </Form.Label>
                <Form.Check
                  type="checkbox"
                  label="Present"
                  id="exampleCheckbox"
                  name="isWed"
                  onChange={handleAvailabilityCheckBox}
                  checked={formAvailability.isWed}
                />
                <div className="startTime">
                  <label
                    style={{
                      color: formAvailability.isWed
                        ? "black"
                        : "rgb(170, 168, 168)",
                    }}
                    htmlFor=""
                    className="startTimeLabel"
                  >
                    Start Time : &nbsp;{" "}
                  </label>
                  <input
                    name="wedStart"
                    type="time"
                    disabled={!formAvailability.isWed}
                    value={formAvailability.wedStart}
                    onChange={handleAvailabilityChange}
                    onBlur={() =>
                      checkTime(
                        formAvailability.wedStart,
                        formAvailability.wedEnd,
                        "isWed"
                      )
                    }
                  />
                </div>
                <div className="startTime" style={{ paddingTop: "2%" }}>
                  <label
                    style={{
                      color: formAvailability.isWed
                        ? "black"
                        : "rgb(170, 168, 168)",
                    }}
                    htmlFor=""
                    className="startTimeLabel"
                  >
                    End Time : &nbsp;&nbsp;&nbsp;{" "}
                  </label>
                  <input
                    name="wedEnd"
                    type="time"
                    disabled={!formAvailability.isWed}
                    value={formAvailability.wedEnd}
                    onChange={handleAvailabilityChange}
                    onBlur={() =>
                      checkTime(
                        formAvailability.wedStart,
                        formAvailability.wedEnd,
                        "isWed"
                      )
                    }
                  />
                </div>
                {timeError.isWed && (
                  <p hidden={!formAvailability.isWed} className="timeError">
                    * End time must be after start time
                  </p>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formName">
                <Form.Label className="labelfont"> Thursday </Form.Label>
                <Form.Check
                  type="checkbox"
                  label="Present"
                  id="exampleCheckbox"
                  name="isThu"
                  onChange={handleAvailabilityCheckBox}
                  checked={formAvailability.isThu}
                />
                <div className="startTime">
                  <label
                    style={{
                      color: formAvailability.isThu
                        ? "black"
                        : "rgb(170, 168, 168)",
                    }}
                    htmlFor=""
                    className="startTimeLabel"
                  >
                    Start Time : &nbsp;{" "}
                  </label>
                  <input
                    name="thuStart"
                    type="time"
                    disabled={!formAvailability.isThu}
                    value={formAvailability.thuStart}
                    onChange={handleAvailabilityChange}
                    onBlur={() =>
                      checkTime(
                        formAvailability.thuStart,
                        formAvailability.thuEnd,
                        "isThu"
                      )
                    }
                  />
                </div>
                <div className="startTime" style={{ paddingTop: "2%" }}>
                  <label
                    style={{
                      color: formAvailability.isThu
                        ? "black"
                        : "rgb(170, 168, 168)",
                    }}
                    htmlFor=""
                    className="startTimeLabel"
                  >
                    End Time : &nbsp;&nbsp;&nbsp;{" "}
                  </label>
                  <input
                    name="thuEnd"
                    type="time"
                    disabled={!formAvailability.isThu}
                    value={formAvailability.thuEnd}
                    onChange={handleAvailabilityChange}
                    onBlur={() =>
                      checkTime(
                        formAvailability.thuStart,
                        formAvailability.thuEnd,
                        "isThu"
                      )
                    }
                  />
                </div>
                {timeError.isThu && (
                  <p hidden={!formAvailability.isThu} className="timeError">
                    * End time must be after start time
                  </p>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className="pb-3">
            <Col>
              <Form.Group controlId="formName">
                <Form.Label className="labelfont"> Friday </Form.Label>
                <Form.Check
                  type="checkbox"
                  label="Present"
                  id="exampleCheckbox"
                  name="isFri"
                  onChange={handleAvailabilityCheckBox}
                  checked={formAvailability.isFri}
                />
                <div className="startTime">
                  <label
                    style={{
                      color: formAvailability.isFri
                        ? "black"
                        : "rgb(170, 168, 168)",
                    }}
                    htmlFor=""
                    className="startTimeLabel"
                  >
                    Start Time : &nbsp;{" "}
                  </label>
                  <input
                    name="friStart"
                    type="time"
                    disabled={!formAvailability.isFri}
                    value={formAvailability.friStart}
                    onChange={handleAvailabilityChange}
                    onBlur={() =>
                      checkTime(
                        formAvailability.friStart,
                        formAvailability.friEnd,
                        "isFri"
                      )
                    }
                  />
                </div>
                <div className="startTime" style={{ paddingTop: "2%" }}>
                  <label
                    style={{
                      color: formAvailability.isFri
                        ? "black"
                        : "rgb(170, 168, 168)",
                    }}
                    htmlFor=""
                    className="startTimeLabel"
                  >
                    End Time : &nbsp;&nbsp;&nbsp;{" "}
                  </label>
                  <input
                    name="friEnd"
                    type="time"
                    disabled={!formAvailability.isFri}
                    value={formAvailability.friEnd}
                    onChange={handleAvailabilityChange}
                    onBlur={() =>
                      checkTime(
                        formAvailability.friStart,
                        formAvailability.friEnd,
                        "isFri"
                      )
                    }
                  />
                </div>
                {timeError.isFri && (
                  <p hidden={!formAvailability.isFri} className="timeError">
                    * End time must be after start time
                  </p>
                )}
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="formName">
                <Form.Label className="labelfont"> Saturday </Form.Label>
                <Form.Check
                  type="checkbox"
                  label="Present"
                  id="exampleCheckbox"
                  name="isSat"
                  onChange={handleAvailabilityCheckBox}
                  checked={formAvailability.isSat}
                />
                <div className="startTime">
                  <label
                    style={{
                      color: formAvailability.isSat
                        ? "black"
                        : "rgb(170, 168, 168)",
                    }}
                    htmlFor=""
                    className="startTimeLabel"
                  >
                    Start Time : &nbsp;{" "}
                  </label>
                  <input
                    name="satStart"
                    type="time"
                    disabled={!formAvailability.isSat}
                    value={formAvailability.satStart}
                    onChange={handleAvailabilityChange}
                    onBlur={() =>
                      checkTime(
                        formAvailability.satStart,
                        formAvailability.satEnd,
                        "isSat"
                      )
                    }
                  />
                </div>
                <div className="startTime" style={{ paddingTop: "2%" }}>
                  <label
                    style={{
                      color: formAvailability.isSat
                        ? "black"
                        : "rgb(170, 168, 168)",
                    }}
                    htmlFor=""
                    className="startTimeLabel"
                  >
                    End Time : &nbsp;&nbsp;&nbsp;{" "}
                  </label>
                  <input
                    name="satEnd"
                    type="time"
                    disabled={!formAvailability.isSat}
                    value={formAvailability.satEnd}
                    onChange={handleAvailabilityChange}
                    onBlur={() =>
                      checkTime(
                        formAvailability.satStart,
                        formAvailability.satEnd,
                        "isSat"
                      )
                    }
                  />
                </div>
                {timeError.isSat && (
                  <p hidden={!formAvailability.isSat} className="timeError">
                    * End time must be after start time
                  </p>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formName">
                <Form.Label className="labelfont"> Sunday </Form.Label>
                <Form.Check
                  type="checkbox"
                  label="Present"
                  id="exampleCheckbox"
                  name="isSun"
                  onChange={handleAvailabilityCheckBox}
                  checked={formAvailability.isSun}
                />
                <div className="startTime">
                  <label
                    style={{
                      color: formAvailability.isSun
                        ? "black"
                        : "rgb(170, 168, 168)",
                    }}
                    htmlFor=""
                    className="startTimeLabel"
                  >
                    Start Time : &nbsp;{" "}
                  </label>
                  <input
                    name="sunStart"
                    type="time"
                    disabled={!formAvailability.isSun}
                    value={formAvailability.sunStart}
                    onChange={handleAvailabilityChange}
                    onBlur={() =>
                      checkTime(
                        formAvailability.sunStart,
                        formAvailability.sunEnd,
                        "isSun"
                      )
                    }
                  />
                </div>
                <div className="startTime" style={{ paddingTop: "2%" }}>
                  <label
                    style={{
                      color: formAvailability.isSun
                        ? "black"
                        : "rgb(170, 168, 168)",
                    }}
                    htmlFor=""
                    className="startTimeLabel"
                  >
                    End Time : &nbsp;&nbsp;&nbsp;{" "}
                  </label>
                  <input
                    name="sunEnd"
                    type="time"
                    disabled={!formAvailability.isSun}
                    value={formAvailability.sunEnd}
                    onChange={handleAvailabilityChange}
                    onBlur={() =>
                      checkTime(
                        formAvailability.sunStart,
                        formAvailability.sunEnd,
                        "isSun"
                      )
                    }
                  />
                </div>
                {timeError.isSun && (
                  <p hidden={!formAvailability.isSun} className="timeError">
                    * End time must be after start time
                  </p>
                )}
              </Form.Group>
            </Col>
            <Col></Col>
          </Row>
          <br />
          <hr />
          <br />
          <Row className="subformHead">
            <label htmlFor="">
              {" "}
              <b style={{ color: "red" }}>*</b> Holidays Information{" "}
            </label>
          </Row>
          <Row className="pb-1 pt-3">
            <Alert show={showMessage} variant="success">
              DR. {formData.name} , Holiday {alertMessage} Succesfully !!
            </Alert>
            <Col>
              <Form.Group controlId="formName">
                <Form.Label className="labelfont">
                  {" "}
                  Holiday Start At : &nbsp;{" "}
                </Form.Label>
                <input
                  name="startDate"
                  value={holidayDate.startDate}
                  onBlur={checkHolidayDate}
                  onChange={handleHolidayChange}
                  type="date"
                />
              </Form.Group>
              <Row>
                <p hidden={!DateError} className="timeError">
                  * Start Date should be Previous to End Date
                </p>
              </Row>
            </Col>
            <Col>
              <Form.Group controlId="formName">
                <Form.Label className="labelfont">
                  {" "}
                  Holiday End At : &nbsp;{" "}
                </Form.Label>
                <input
                  name="endDate"
                  value={holidayDate.endDate}
                  onBlur={checkHolidayDate}
                  onChange={handleHolidayChange}
                  type="date"
                />
              </Form.Group>
            </Col>
            <Col>
              <Button variant="primary" onClick={createHoliday} type="button">
                <b>Create </b>
              </Button>{" "}
              <Button variant="success" onClick={updateHoliday} type="button">
                <b>Update </b>
              </Button>{" "}
              <Button variant="danger" onClick={deleteHoliday} type="button">
                <b>Delete </b>
              </Button>{" "}
            </Col>
          </Row>

          <Row>
            <div className="app">
              {isMobile ? (
                <div className="mobile-content">
                  <table>
                    <thead>
                      <tr>
                        <th className="data">Select</th>
                        <th className="data">StartDate</th>
                        <th className="data"> EndDate </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Using Object.keys() to get an array of keys */}
                      {Object.keys(formDateData).map((key) => (
                        <tr key={key}>
                          <td className="data">
                            {" "}
                            <FormCheck
                              type="radio"
                              name="radioGroup"
                              value={formDateData[key].id}
                              checked={selectedID === formDateData[key].id}
                              onChange={handleDateIDChange}
                            />{" "}
                          </td>
                          <td className="data">
                            {formDateData[key].holidayStart}
                          </td>
                          <td className="data">
                            {" "}
                            {formDateData[key].holidayEnd}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="pc-content">
                  <table>
                    <thead>
                      <tr>
                        <th className="data">Select</th>
                        <th className="data">StartDate</th>
                        <th className="data"> EndDate </th>
                        <th className="data"> Created [ Date / Time ] </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Using Object.keys() to get an array of keys */}
                      {Object.keys(formDateData).map((key) => (
                        <tr key={key}>
                          <td className="data">
                            {" "}
                            <FormCheck
                              type="radio"
                              name="radioGroup"
                              value={formDateData[key].id}
                              checked={selectedDateID === formDateData[key].id}
                              onChange={handleDateIDChange}
                            />{" "}
                          </td>
                          <td className="data">
                            {formDateData[key].holidayStart}
                          </td>
                          <td className="data">
                            {" "}
                            {formDateData[key].holidayEnd}
                          </td>
                          <td className="data">
                            {" "}
                            {formDateData[key].createdAt}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Row>
          <br />
          <br />
          <hr />

          <Row>
            <Col className="controlBtn">
              {" "}
              <Button size="lg" variant="primary" type="submit">
                Update Doctor
              </Button>{" "}
              &nbsp;&nbsp;
              <Button size="lg" variant="danger" onClick={goToDoctor}>
                {" "}
                Back to Page{" "}
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
      <br />
      <br />
      <br />
    </>
  );
});

export default UpdateDoctor;
