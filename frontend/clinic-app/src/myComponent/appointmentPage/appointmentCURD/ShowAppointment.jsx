import "./ShowAppointment.css";
import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Form, FormCheck } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import { Dropdown } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

const ShowAppointment = (props) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [DateText, setDateText] = useState("");
  const [previousKey, setPreviousKey] = useState(null);
  const [selectedValue, setSelectedValue] = useState("number");
  const [errorMessage, SetErrorMessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [doctorNameText, setDoctorNameText] = useState("");

  const [currentDate, setCurrentDate] = useState(new Date());

  const [isMobile, setIsMobile] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [doctorSelectedID, setDoctorSelectedID] = useState(null);
  const [chooseDoctorModalShow, setChooseDoctorModalShow] = useState(false);
  const handleChooseDoctorModalClose = () => setChooseDoctorModalShow(false);
  const handleChooseDoctorModalShow = () => {
    setSelectedValue("number");
    setChooseDoctorModalShow(true);
  };

  const [selectedApptValue, setSelectedApptValue] = useState(0);
  const [chooseUpdateApptModalShow, setChooseUpdateApptModalShow] =
    useState(false);
  const handleChooseUpdateApptModalClose = () =>
    setChooseUpdateApptModalShow(false);
  const handleChooseUpdateApptModalShow = () => {
    setChooseUpdateApptModalShow(true);
  };

  const [doctorFormData, setDoctorFormData] = useState({});

  const [doctorTimes, setDoctorTimes] = useState({
    slotTime: "",
    startTime: "",
    endTime: "",
  });

  const [apptUpdateFees, setApptUpdateFees] = useState({
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

    // setRemainingFees();
  };

  function setRemainingFees() {
    var A = 0,
      B = 0,
      C = 0;

    if (apptUpdateFees.totalFees !== "") {
      A = parseInt(apptUpdateFees.totalFees);
    }
    if (apptUpdateFees.advancedFees !== "") {
      B = parseInt(apptUpdateFees.advancedFees);
    }
    if (apptUpdateFees.paidFees !== "") {
      C = parseInt(apptUpdateFees.paidFees);
    }

    setApptUpdateFees({
      ...apptUpdateFees,
      remainingFees: (A - B - C),
    });
  }

  const [showError, setShowError] = useState(false);
  const handleCloseError = () => setShowError(false);
  const handleShowError = () => setShowError(true);

  const [showZero, setShowZero] = useState(false);
  const handleCloseZero = () => setShowZero(false);
  const handleShowZero = () => setShowZero(true);

  const [bookedSlot, setBookedSlot] = useState(null);

  const [selectedID, setSelectedID] = useState(null);
  const handleIDChange = (event) => {
    setSelectedID(event.target.value);
  };

  var [tableRows, setTableRows] = useState();

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setPreviousDoctor();

    if (DateText) {
      getAppointment();
      console.log(DateText);
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
    const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0
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

      setTimeSlots(slots);
    }
  }

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  function fillRow() {
    // const filteredData = timeSlots.filter(item => item.booked === true);

    setTableRows(
      formData.map((item) => (
        <tr className="data" key={item.id}>
          <td className="data">{item.startDate}</td>
          <td className="data">{item.startTime}</td>
          <td className="data"> </td>
        </tr>
      ))
    );
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
  const handleBlur = () => {
    if (searchText.trim() === "") {
      // LoadData();
    }
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

    console.log("val : " + val);
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
          console.log("in GET Appointment 33 22: ");
          console.log(data);
          setFormData(data);
          setDataLoaded(true);
          checkDoctorHoliday(DateText, data);
        })
        .catch((error) => console.error(error));
    }
  }

  function checkDoctorHoliday(myDate, bookedSlot) {
    console.log("In Check Date : " + myDate);

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
        console.log(data);
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
          setDoctorTimes(data);
          console.log(data);
          convertToTimeSlots(
            data.startTime,
            data.endTime,
            data.slotTime,
            bookedSlot
          );
        } else {
          SetErrorMessage(
            "  Doctor is Not Available , he is Absent on This Day"
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
          console.log(data);
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

  // Function to handle clicking on a time slot
  const handleTimeSlotClick = (index) => {
    const updatedSlots = [...timeSlots];

    if (previousKey === null) {
      setPreviousKey(index);
      setTimeSlots(updatedSlots);
    } else {
      updatedSlots[previousKey].isNewSlot = null;
      setPreviousKey(index);
      setTimeSlots(updatedSlots); // try to select only one button yeellow at a time
    }

    if (updatedSlots[index].isNewSlot === true) {
      updatedSlots[index].isNewSlot = null;
    } else {
      updatedSlots[index].isNewSlot = true;
    }

    setBookedSlot({
      ...bookedSlot,
      hour: updatedSlots[index].hour,
      minutes: updatedSlots[index].minute,
      date: DateText,
    });

    setTimeSlots(updatedSlots);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    // Adding suffix to the day
    let suffix = "";
    if (day === 1 || day === 21 || day === 31) {
      suffix = "st";
    } else if (day === 2 || day === 22) {
      suffix = "nd";
    } else if (day === 3 || day === 23) {
      suffix = "rd";
    } else {
      suffix = "th";
    }

    // Add suffix to the day
    return `${day}${suffix} ${month} ${year}`;
  }

  function handleBookedSlot() {
    if (bookedSlot === null) {
      SetErrorMessage(" Selected Slot First");
      handleShowError();
    } else {
      console.log(timeSlots);

      // var time = { hour: bookedSlot.hour, minute: bookedSlot.minutes };
      // var ft = formatTime(time);
      // var fd = formatDate(DateText);
      // var Booking = {
      //   Time: bookedSlot.hour + ":" + bookedSlot.minutes + ":00",
      //   timeString: ft,
      //   dateString: fd,
      //   Date: DateText,
      // };
      //   props.onSlotBook(Booking);
      //   props.onHide();
    }
  }

  function setFormatDate(date) {
    const today = new Date(date);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  // const handlePreviousClick = async() => {
  //   const previousDate = new Date(DateText);
  //   previousDate.setDate(previousDate.getDate() - 1);
  //   setDateText(setFormatDate(previousDate));
  //   getAppointment();

  // };

  const handlePreviousClick = () => {
    const previousDate = new Date(DateText);
    previousDate.setDate(previousDate.getDate() - 1);
    setDateText(setFormatDate(previousDate));
  };

  const handleNextClick = () => {
    const previousDate = new Date(DateText); // Create a copy of the current date
    previousDate.setDate(previousDate.getDate() + 1); // Subtract one day
    setDateText(setFormatDate(previousDate)); // Update the current date state
    console.log(setFormatDate(previousDate));
    getAppointment();
  };

  function updateApptFees(event) {
    setSelectedApptValue(event.target.value);
    const key = event.target.value;
    setApptUpdateFees({
      ...apptUpdateFees,
      status: formData[key].status,
      advancedFees: formData[key].advancedFees,
      totalFees: formData[key].totalFees,
      remainingFees: formData[key].remainingFees,
      paidFees: formData[key].paidFees,
    });
    handleChooseUpdateApptModalShow();
  }

  return (
    <div className="showForm">
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
        show={chooseUpdateApptModalShow}
        onHide={handleChooseUpdateApptModalClose}
        size="xl"
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
            <Form>
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
                  <Form.Group controlId="formMobile">
                    <div className="formgroup2">
                      <Form.Label className="labelfont">
                        Paid Fees :{" "}
                      </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="200 Rs"
                        name="paidFees"
                        step={50}
                        minLength={10}
                        value={apptUpdateFees.paidFees}
                        onChange={handleChange}
                        onKeyUp={setRemainingFees}
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col></Col>
              </Row>

              <br />
              <hr />

              <Row>
                <Col className="controlBtn">
                  {" "}
                  <Button variant="primary" size="lg" onClick={setDoctorName}>
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
            <Button onClick={handlePreviousClick} variant="secondary">
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
              style={{ margin: "0px 10px 0px 10px" }}
            >
              {" "}
              <b>Today </b>
            </Button>
            <Button onClick={handleNextClick} variant="secondary">
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
          <div className="pc-content">
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
                    <td className="data"> {formData[key].remainingFees}</td>
                    <td className="data"> {formData[key].paidFees}</td>

                    <td className="data">
                      {" "}
                      <Button
                        variant="success"
                        // onClick={handleChooseUpdateApptModalShow}
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
};

export default ShowAppointment;
