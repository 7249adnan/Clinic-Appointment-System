import React, { useState } from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";

const BookingSystem = (props) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [DateText, setDateText] = useState("");
  const [previousKey, setPreviousKey] = useState(null);
  const [doctorTimes, setDoctorTimes] = useState({
    slotTime: "",
    startTime: "",
    endTime: "",
  });

  const [bookedSlot, setBookedSlot] = useState(null);

  // Function to convert time to time slots
  function convertToTimeSlots(startTime, endTime, mySlotTime, bookedSlot) {
    const slots = [];
    const start = startTime.split(":").map(Number);
    const end = endTime.split(":").map(Number);
    let currentTime = [...start];

    if (mySlotTime != null) {
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
            hour: currentTime[0],
            minute: currentTime[1],
            booked: true,
            isNewSlot: false,
          });
        } else {
          slots.push({
            hour: currentTime[0],
            minute: currentTime[1],
            booked: false,
            isNewSlot: null,
          });
        }

        currentTime = addMinutes(currentTime, mySlotTime);
      }

      setTimeSlots(slots);
    }
  }

  const compareTimes = (time1, time2) => {
    if (time1[0] !== time2[0]) return time1[0] - time2[0];
    return time1[1] - time2[1];
  };

  const handleDateChange = (event) => {
    setDateText(event.target.value);
  };

  function getAppointment() {
    if (DateText === "") {
      props.onError("Select DATE First");
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
            doctorId: props.doctorId,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("in GET Appointment 33 : ");
          console.log(data);
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
        body: JSON.stringify({ date: myDate, doctorId: props.doctorId }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data === 1) {
          getDoctorAvailability(myDate, bookedSlot);
        } else {
          props.onError(" Doctor is Not Available , he is on Holiday");
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
        body: JSON.stringify({ date: myDate, doctorId: props.doctorId }),
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
          props.onError(" Doctor is Not Available , he is Absent on This Day ");
        }
      })
      .catch((error) => console.error(error));
  }

  // Function to add minutes to a time array
  const addMinutes = (time, minutes) => {
    const [hour, minute] = time;
    const totalMinutes = hour * 60 + minute + minutes;
    return [Math.floor(totalMinutes / 60), totalMinutes % 60];
  };

  // Function to format time array to AM/PM format
  const formatTime = (time) => {
    const { hour, minute } = time;
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
      props.onError(" Selected Slot First");
    } else {
      var time = { hour: bookedSlot.hour, minute: bookedSlot.minutes };
      var ft = formatTime(time);
      var fd = formatDate(DateText);
      var Booking = {
        Time: bookedSlot.hour + ":" + bookedSlot.minutes + ":00",
        timeString: ft,
        dateString: fd,
        Date: DateText,
      };
      props.onSlotBook(Booking);
      props.onHide();
    }
  }

  return (
    <Container style={{ width: "95%" }}>
      <Row>
        <InputGroup className="mb-5 mt-3">
          <InputGroup.Text style={{ fontSize: "20px" }} id="basic-addon1">
            <b> Select Appointment Date </b>
          </InputGroup.Text>
          <Form.Control
            style={{ fontSize: "20px" }}
            placeholder="Date . . ."
            aria-label="Username"
            type="date"
            aria-describedby="basic-addon1"
            onChange={handleDateChange}
          />

          <Button
            variant="primary"
            onClick={getAppointment}
            style={{ fontSize: "20px" }}
            className="mx-2    "
          >
            {" "}
            Search
          </Button>
        </InputGroup>
      </Row>

      <div>
        <label
          htmlFor=""
          style={{ fontSize: "140%", fontWeight: "400", paddingBottom: "2%" }}
          hidden={doctorTimes.slotTime === ""}
        >
          Time Slots [ {doctorTimes.slotTime} Mins ] :{" "}
        </label>

        <Row xs={1} className="g-2" style={{ paddingLeft: "1%" }}>
          {timeSlots.map((slot, index) => (
            <Col xs={1} key={index}>
              <Button
                size="sm"
                variant={
                  slot.isNewSlot === true
                    ? "warning"
                    : slot.booked
                    ? "secondary"
                    : "success"
                }
                onClick={() => handleTimeSlotClick(index)}
                className="m-2"
                disabled={timeSlots[index].isNewSlot === false}
                block
              >
                {formatTime(slot)}
              </Button>
            </Col>
          ))}
        </Row>
        <br />
        <hr />
        <Row>
          <Col className="controlBtn">
            {" "}
            <Button variant="primary" size="lg" onClick={handleBookedSlot}>
              Selected
            </Button>{" "}
            &nbsp;&nbsp;
            <Button
              size="lg"
              variant="danger"
              onClick={() => {
                props.onHide();
              }}
              // onClick={handleChooseAppointmentModalClose}
            >
              {" "}
              Close{" "}
            </Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default BookingSystem;
