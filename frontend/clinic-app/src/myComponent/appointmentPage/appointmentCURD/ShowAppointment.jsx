import "./ShowAppointment.css";
import React, { useState, useEffect ,forwardRef,useImperativeHandle} from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  FormCheck,
  Alert,
} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import { Dropdown } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

const ShowAppointment  = forwardRef((props, ref) => {
  const [DateText, setDateText] = useState("");

  const [selectedValue, setSelectedValue] = useState("number");
  const [errorMessage, SetErrorMessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [doctorNameText, setDoctorNameText] = useState("");

  const [isMobile, setIsMobile] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const [doctorSelectedID, setDoctorSelectedID] = useState(null);
  const [chooseDoctorModalShow, setChooseDoctorModalShow] = useState(false);
  const handleChooseDoctorModalClose = () => setChooseDoctorModalShow(false);
  const handleChooseDoctorModalShow = () => {
    setSelectedValue("number");
    setChooseDoctorModalShow(true);
  };

  const [chooseUpdateApptModalShow, setChooseUpdateApptModalShow] =
    useState(false);
  const handleChooseUpdateApptModalClose = () =>
    setChooseUpdateApptModalShow(false);
  const handleChooseUpdateApptModalShow = () => {
    setChooseUpdateApptModalShow(true);
  };

  const [doctorFormData, setDoctorFormData] = useState({});

  const [apptUpdateFees, setApptUpdateFees] = useState({
    id: "",
    status: "",
    totalFees: "",
    advancedFees: "",
    remainingFees: "",
    paidFees: "",
  });

  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setApptUpdateFees({
      ...apptUpdateFees,
      [name]: value,
    });
  };

  function setRemainingFees() {
    var A = 0,
      B = 0;

    if (apptUpdateFees.totalFees !== "") {
      A = parseInt(apptUpdateFees.totalFees);
    }
    if (apptUpdateFees.advancedFees !== "") {
      B = parseInt(apptUpdateFees.advancedFees);
    }
    setApptUpdateFees({
      ...apptUpdateFees,
      remainingFees: A - B,
    });
  }

  const [showError, setShowError] = useState(false);
  const handleCloseError = () => setShowError(false);
  const handleShowError = () => setShowError(true);

  const [showZero, setShowZero] = useState(false);
  const handleCloseZero = () => setShowZero(false);
  const handleShowZero = () => setShowZero(true);

  const [selectedID, setSelectedID] = useState(null);
  const handleIDChange = (event) => {
    setSelectedID(event.target.value);
    props.setIdIndex(event.target.value);
  };

  const handleApptCheckBox = (e) => {
    const { name, checked } = e.target;
    setApptUpdateFees({ ...apptUpdateFees, [name]: checked });
  };

  useImperativeHandle(ref, () => ({
    getAppointment
  }));


  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setPreviousDoctor();

    if (DateText) {
      getAppointment();
    } else {
      setTodayDate();
    }

    return () => {};
    // eslint-disable-next-line
  }, [DateText]);

  function setPreviousDoctor() {
    const doctorName = localStorage.getItem("doctorName");
    const doctorId = localStorage.getItem("doctorId");

    if (doctorId && doctorName) {
      setDoctorNameText(doctorName);
      setDoctorSelectedID(doctorId);
    }
  }

  function setTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); 
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setDateText(formattedDate);
    return formattedDate;
  }

  // Function to convert time to time slots
  function convertToTimeSlots(startTime, endTime, mySlotTime, bookedSlot) {
    const slots = [];
    const start = startTime.split(":").map(Number);
    const end = endTime.split(":").map(Number);
    let currentTime = [...start];

    if (mySlotTime != null) {
      var num = 0;
      while (compareTimes(currentTime, end) < 0) {
        var val = 0;
        var datedSlots = bookedSlot;

        for (let i = 0; i < datedSlots.length; i++) {
          var timePart = datedSlots[i].startTime;
          var [hours, minutes] = timePart.split(":");

          if (
            parseInt(currentTime[0]) === parseInt(hours) &&
            parseInt(currentTime[1]) === parseInt(minutes)
          ) {
            val = 1;
            break;
          } else {
            val = 0;
          }
        }

        if (val === 1) {
          slots.push({
            id: num,
            hour: currentTime[0],
            minute: currentTime[1],
            booked: true,
            isNewSlot: false,
          });
        } else {
          slots.push({
            id: num,
            hour: currentTime[0],
            minute: currentTime[1],
            booked: false,
            isNewSlot: null,
          });
        }

        num = num + 1;
        currentTime = addMinutes(currentTime, mySlotTime);
      }
    }
  }

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const compareTimes = (time1, time2) => {
    if (time1[0] !== time2[0]) return time1[0] - time2[0];
    return time1[1] - time2[1];
  };

  const handleDateChange = (event) => {
    setDateText(event.target.value);
  };
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };
  
  const handleDoctorIDChange = (event) => {
    setDoctorSelectedID(event.target.value);
    localStorage.setItem("doctorId", event.target.value);
  };

  const handleSelect = (eventKey) => {
    setSelectedValue(eventKey);
  };

  function setDoctorName() {
    var val = 0;
    // eslint-disable-next-line
    Object.keys(doctorFormData).map((key) => {
      // eslint-disable-next-line
      if (doctorSelectedID == doctorFormData[key].id) {
        setDoctorNameText(doctorFormData[key].name);
        localStorage.setItem("doctorName", doctorFormData[key].name);

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

  function getAppointment() {
    if (DateText === "") {
      SetErrorMessage("Select DATE First");
      handleShowError();
    } else {
      fetch(
        process.env.REACT_APP_PROTOCOL +
          "://" +
          process.env.REACT_APP_BASE_URL +
          ":" +
          process.env.REACT_APP_PORT +
          "/getAppointment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appointmentDate: DateText,
            doctorId: doctorSelectedID,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setSelectedID(null);
          props.setIdIndex(null);
          setFormData(data);
          setDataLoaded(true);
          checkDoctorHoliday(DateText, data);
        })
        .catch((error) => console.error(error));
    }
  }

  function checkDoctorHoliday(myDate, bookedSlot) {
    fetch(
      process.env.REACT_APP_PROTOCOL +
        "://" +
        process.env.REACT_APP_BASE_URL +
        ":" +
        process.env.REACT_APP_PORT +
        "/checkDoctorHoliday",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: myDate, doctorId: doctorSelectedID }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data === 1) {
          getDoctorAvailability(myDate, bookedSlot);
        } else {
          SetErrorMessage(" Doctor is Not Available , he is on Holiday");
          handleShowError();
        }
      })
      .catch((error) => console.error(error));
  }

  function getDoctorAvailability(myDate, bookedSlot) {
    fetch(
      process.env.REACT_APP_PROTOCOL +
        "://" +
        process.env.REACT_APP_BASE_URL +
        ":" +
        process.env.REACT_APP_PORT +
        "/checkDoctorAvailabilityTime",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: myDate, doctorId: doctorSelectedID }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.doctorPresent === true) {
          convertToTimeSlots(
            data.startTime,
            data.endTime,
            data.slotTime,
            bookedSlot
          );
        } else {
          SetErrorMessage(
            "  Doctor is Not Available , he is Absent on This Day "
          );
          handleShowError();
        }
      })
      .catch((error) => console.error(error));
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
          setDoctorFormData(data);

          if (isEmpty(data)) {
            handleShowZero();
          }
        })
        .catch((error) => console.error(error));
    }
  }

  // Function to add minutes to a time array
  const addMinutes = (time, minutes) => {
    const [hour, minute] = time;
    const totalMinutes = hour * 60 + minute + minutes;
    return [Math.floor(totalMinutes / 60), totalMinutes % 60];
  };

  // Function to format time array to AM/PM format
  const formatTime = (time) => {
    const [hourString, minuteString] = time.split(":");
    const hour = parseInt(hourString);
    const minute = parseInt(minuteString);

    const meridiem = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")} ${meridiem}`;
  };

  function setFormatDate(date) {
    const today = new Date(date);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }
  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000); // Hide the message after 2 seconds
  };

  const handlePreviousClick = () => {
    const previousDate = new Date(DateText);
    previousDate.setDate(previousDate.getDate() - 1);
    setDateText(setFormatDate(previousDate));
  };

  const handleNextClick = () => {
    const previousDate = new Date(DateText); // Create a copy of the current date
    previousDate.setDate(previousDate.getDate() + 1); // Subtract one day
    setDateText(setFormatDate(previousDate)); // Update the current date state
  };

  function updateApptFees(event) {
    const key = event.target.value;

    setApptUpdateFees({
      ...apptUpdateFees,
      id: formData[key].id,
      status: formData[key].status,
      advancedFees: formData[key].advancedFees,
      totalFees: formData[key].totalFees,
      remainingFees: formData[key].totalFees - formData[key].advancedFees,
      paidFees: formData[key].paidFees,
    });
    handleChooseUpdateApptModalShow();
  }

  function handleApptUpdateSubmit(e) {
    e.preventDefault();

    if (
      apptUpdateFees.paidFees === false &&
      apptUpdateFees.status === "Closed"
    ) {
      SetErrorMessage(
        " Status Only can Closed if Patient has Paid All remaining Fees"
      );
      handleShowError();
    } else {
      fetch(
        process.env.REACT_APP_PROTOCOL +
          "://" +
          process.env.REACT_APP_BASE_URL +
          ":" +
          process.env.REACT_APP_PORT +
          "/updateApptFees",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apptUpdateFees),
        }
      )
        .then((response) => response.text())
        .then((data) => {
          if (data === "updatedOK") {
            getAppointment();
            setAlertMessage(" Appointment Updated SuccessFully");
            handleShowMessage();
            handleChooseUpdateApptModalClose();
          }
        })
        .catch((error) => console.error(error));
    }
  }

  return (
    <div className="showForm">
      <Alert className="fixed-top" show={showMessage} variant="success">
        {alertMessage}
      </Alert>

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
        show={chooseUpdateApptModalShow}
        onHide={handleChooseUpdateApptModalClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="modaltitle">
            Update Appointment Fees
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Container>
            <Form onSubmit={handleApptUpdateSubmit}>
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
                        value={apptUpdateFees.status}
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
                      <Form.Label className="labelfont">
                        Total Fees :{" "}
                      </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="400 Rs"
                        step={50}
                        name="totalFees"
                        minLength={10}
                        required
                        value={apptUpdateFees.totalFees}
                        onChange={handleChange}
                        onKeyUp={setRemainingFees}
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
                        step={50}
                        minLength={10}
                        value={apptUpdateFees.advancedFees}
                        onChange={handleChange}
                        onKeyUp={setRemainingFees}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
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
                        disabled
                        step={50}
                        minLength={10}
                        value={apptUpdateFees.remainingFees}
                        onChange={handleChange}
                        onKeyUp={setRemainingFees}
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group
                    style={{ paddingTop: "12%" }}
                    controlId="formMobile"
                  >
                    <div className="formgroup2">
                      <Form.Check
                        type="checkbox"
                        label=" Paid Remaining Fees"
                        id="exampleCheckbox"
                        name="paidFees"
                        className="labelfont"
                        onChange={handleApptCheckBox}
                        checked={apptUpdateFees.paidFees}
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
                  <Button variant="primary" size="lg" type="submit">
                    Update Fees
                  </Button>{" "}
                  &nbsp;&nbsp;
                  <Button
                    size="lg"
                    variant="danger"
                    onClick={handleChooseUpdateApptModalClose}
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

      <Container style={{ width: "95%" }}>
        <Row>
          <Col>
            {" "}
            <InputGroup className="mb-5 mt-3">
              <InputGroup.Text
                style={{ fontSize: "18px", fontWeight: 600 }}
                id="basic-addon1"
              >
                Select Appointment
              </InputGroup.Text>
              <Form.Control
                style={{ fontSize: "18px", fontWeight: 500 }}
                placeholder="Date . . ."
                aria-label="Username"
                defaultValue={DateText}
                disabled={doctorSelectedID === null}
                type="date"
                aria-describedby="basic-addon1"
                onChange={handleDateChange}
              />

              <Button
                variant="primary"
                disabled={doctorSelectedID === null}
                onClick={getAppointment}
                style={{ fontSize: "18px" }}
                className="mx-2    "
              >
                {" "}
                Search
              </Button>
            </InputGroup>
          </Col>
          <Col>
            {" "}
            <InputGroup className="mb-5 mt-3">
              <InputGroup.Text
                style={{ fontSize: "18px", fontWeight: 600 }}
                id="basic-addon1"
              >
                Select Doctor
              </InputGroup.Text>
              <Form.Control
                style={{ fontSize: "18px", fontWeight: 500 }}
                type="text"
                className="disableInput"
                value={" Dr. " + doctorNameText}
                disabled
              />

              <Button
                size="sm"
                onClick={handleChooseDoctorModalShow}
                className="mx-2    "
                style={{ fontSize: "18px" }}
                variant="primary"
              >
                {" "}
                Choose{" "}
              </Button>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col className="paggingButton">
            <Button
              onClick={handlePreviousClick}
              disabled={doctorSelectedID === null}
              variant="secondary"
            >
              {" "}
              <b>
                {" "}
                <i
                  style={{
                    fontSize: "20px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                  }}
                  class="fa fa-chevron-left"
                ></i>{" "}
              </b>{" "}
            </Button>

            <Button
              variant="warning"
              onClick={setTodayDate}
              disabled={doctorSelectedID === null}
              style={{ margin: "0px 10px 0px 10px" }}
            >
              {" "}
              <b>Today </b>
            </Button>
            <Button
              onClick={handleNextClick}
              disabled={doctorSelectedID === null}
              variant="secondary"
            >
              {" "}
              <b>
                {" "}
                <i
                  style={{
                    fontSize: "20px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                  }}
                  class="fa fa-chevron-right"
                ></i>{" "}
              </b>{" "}
            </Button>
          </Col>
        </Row>
        <br />
      </Container>

      <div className="app">
        {isMobile ? (
          <div className="mobile-content">
            <table>
              <thead>
                <tr>
                  <th className="data">Select</th>
                  <th className="data">Name</th>
                  <th className="data"> Specialist </th>
                </tr>
              </thead>
              <tbody>
                {/* Using Object.keys() to get an array of keys */}
                {Object.keys(formData).map((key) => (
                  <tr key={key}>
                    <td className="data">
                      {" "}
                      <FormCheck
                        type="radio"
                        name="radioGroup"
                        value={formData[key].id}
                        checked={selectedID === formData[key].id}
                        onChange={handleIDChange}
                      />{" "}
                    </td>
                    <td className="data">{formData[key].name}</td>
                    <td className="data"> {formData[key].specialist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{ height: "350px", overflow: "auto" }}
            className="pc-content"
          >
            <table className="tableA" hidden={!dataLoaded}>
              <thead>
                <tr>
                  <th className="data">Select</th>
                  <th className="data">Time</th>
                  <th className="data">Status</th>
                  <th className="data"> Name </th>
                  <th className="data"> Number </th>
                  <th className="data"> Total Fees </th>
                  <th className="data"> Advanced Fees </th>
                  <th className="data"> Remaning Fees </th>
                  <th className="data"> Paid Fees </th>
                  <th className="data"> Update</th>
                </tr>
              </thead>

              <tbody>
                {/* Using Object.keys() to get an array of keys */}
                {Object.keys(formData).map((key) => (
                  <tr key={key}>
                    <td className="data">
                      {" "}
                      <FormCheck
                        type="radio"
                        name="radioGroup"
                        value={formData[key].id}
                        checked={selectedID === formData[key].id}
                        onChange={handleIDChange}
                      />{" "}
                    </td>
                    <td className="data">
                      {formatTime(formData[key].startTime)}
                    </td>
                    {/* <td className="data">{ formData[key].startTime}</td> */}

                    <td className="data">{formData[key].status}</td>

                    <td className="data">{formData[key].User.name}</td>
                    <td className="data">{formData[key].User.number}</td>
                    <td className="data"> {formData[key].totalFees} </td>
                    <td className="data"> {formData[key].advancedFees}</td>
                    <td className="data">
                      {" "}
                      {formData[key].totalFees - formData[key].advancedFees}
                    </td>
                    <td className="data">
                      {" "}
                      {formData[key].paidFees ? "YES" : "NO"}
                    </td>

                    <td className="data">
                      {" "}
                      <Button
                        variant="success"
                        onClick={updateApptFees}
                        value={key}
                        size="sm"
                      >
                        {" "}
                        &nbsp; Edit &nbsp;
                      </Button>{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
});

export default ShowAppointment;
