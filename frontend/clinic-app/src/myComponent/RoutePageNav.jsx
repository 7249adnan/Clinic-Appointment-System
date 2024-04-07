import "./RoutePageNav.css";

import Login from "./loginPage/login";
import Home from "./homePage/home";
import Patient from "./patientPage/patient";

import Doctor from "./doctorPage/DoctorPage";
import UpdateDoctor from "./doctorPage/doctorCURD/UpdateDoctor";

import Appointment from "./appointmentPage/appointment";
import CreateAppointment from "./appointmentPage/appointmentCURD/CreateAppointment";

//import Login from "./myComponent/homePage/login";

import Container from "react-bootstrap/Container";
import { Button } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookMedical } from "@fortawesome/free-solid-svg-icons";

// eslint-disable-next-line
import {Route, Link, Routes } from "react-router-dom";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UpdateAppointment from "./appointmentPage/appointmentCURD/UpdateAppointment";

function RoutePageNav(props) {
  const [showNav, setShowNav] = useState(false);
  const [userName, setUserName] = useState("");

  function setLogged() {
    setShowNav(true);
    setSession();
  }

  let navigate = useNavigate();

  function gotoLogInPage() {
    navigate("/");
  }

  const handleLogout = () => {
    setShowNav(false);
    setUserName("");
    localStorage.removeItem("decodedToken");
    gotoLogInPage();
  };

  // Function to check session expiry
  const setSession = () => {
    const token = JSON.parse(localStorage.getItem("decodedToken"));

    if (token) {
      const decodedToken = token;
      const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds

      if (expirationTime > Date.now()) {
        const timeout = expirationTime - Date.now();
        setUserName(token.userName);

        setTimeout(() => {         
          handleLogout();
        }, timeout);
      } else {
        // Token expired, clear it
        localStorage.removeItem("decodedToken");
      }
    }
  };

  const { location } = props;
  return (
    <div >
      <Navbar sticky="top" collapseOnSelect expand="lg" bg="primary" data-bs-theme="dark">
        <Container fluid>
          <Navbar.Brand href="/home" style={{ fontSize: "150%" }}>
            <FontAwesomeIcon
              icon={faBookMedical}
              className="navIcon"
              
            />
            &nbsp;&nbsp;{" "}
            <label className="navBarHead1">
              {process.env.REACT_APP_NAVBAR_HEAD_NAME}
            </label>
          </Navbar.Brand>
          <Navbar.Toggle  hidden={ !showNav} aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav
              className="navItems"
              style={{ paddingLeft: "4%" }}
              activeKey={location}
            >
              <Nav.Link href="/login" as={Link} hidden={true} to="/login">
                Login
              </Nav.Link>

              <Nav.Link
                style={{ paddingLeft: "15%" }}
                href="/home1"
                hidden={!showNav}
                as={Link}
                to="/home"
              >
                Home
              </Nav.Link>
              <Nav.Link
                style={{ paddingLeft: "15%" }}
                href="/patient"
                as={Link}
                hidden={!showNav}
                to="/patient"
              >
                Patient
              </Nav.Link>
              <Nav.Link
                style={{ paddingLeft: "15%" }}
                href="/doctor"
                as={Link}
                hidden={!showNav}
                to="/doctor"
              >
                Doctor
              </Nav.Link>
              <Nav.Link
                style={{ paddingLeft: "15%" }}
                href="/appointment"
                as={Link}
                hidden={!showNav}
                to="/appointment"
              >
                Appointment
              </Nav.Link>
            </Nav>

           
          </Navbar.Collapse>
          <label
            className="logUserName"
            hidden={ !showNav}
            htmlFor="userName"
          >
            {userName}{" "}
          </label>
          <Button
            variant="danger"
            hidden={!showNav}
            onClick={handleLogout}
            className="align-right"
          >
            <b>Logout</b>
          </Button>
        </Container>
      </Navbar>

      <Routes>
        <Route
          exact
          path="/"
          element={<Login setLoggedSession={setLogged} />}
        />
        <Route
          exact
          path="/login"
          element={<Login setLoggedSession={setLogged} />}
        />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/patient" element={<Patient />} />
        <Route exact path="/doctor" element={<Doctor />} />
        <Route exact path="/doctor/updateDoctor" element={<UpdateDoctor/>} />
        <Route exact path="/appointment" element={<Appointment/>} />
        <Route exact path="/appointment/createappointment" element={<CreateAppointment/>} />
        <Route exact path="/appointment/updateappointment" element={<UpdateAppointment/>} />
        
        

        
      </Routes>
    </div>
  );
}

export default RoutePageNav;
