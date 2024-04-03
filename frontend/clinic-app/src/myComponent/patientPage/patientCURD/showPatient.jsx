import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Button, FormCheck } from "react-bootstrap";
import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Dropdown } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import "./showPatient.css";

const ShowPatient = forwardRef((props, ref) => {
  /// SEE about use ref and compare in chatgpt

  const [formdata, setFormData] = useState({});
  const [selectedID, setSelectedID] = useState(null);

  const [isMobile, setIsMobile] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [selectedValue, setSelectedValue] = useState("number");

  const [showError, setShowError] = useState(false);
  const handleCloseError = () => setShowError(false);
  const handleShowError = () => setShowError(true);

  const [showZero, setShowZero] = useState(false);
  const handleCloseZero = () => setShowZero(false);
  const handleShowZero = () => setShowZero(true);

  

  const handleSelect = (eventKey) => {
    setSelectedValue(eventKey);
  };

  const handleIDChange = (event) => {
    setSelectedID(event.target.value);
    props.setIdIndex(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleBlur = () => {
    if (searchText.trim() === "") {
      LoadData();
    }
  };

  function findSearch() {
    if (searchText === "") {
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
          setFormData(data);

          if(isEmpty(data)){
           handleShowZero();
          }
         
        })
        .catch((error) => console.error(error));
    }
  }



  useImperativeHandle(ref, () => ({
    deletePatient,
    LoadData,
  }));

  useEffect(() => {
    // Function to call on page load
    setIsMobile(window.innerWidth < 768);

    LoadData();

    // Clean-up function (IDal)
    return () => {
      // Code to execute on component unmount (if needed)
    };
    // eslint-disable-next-line
  }, []); // Empty dependency array means this effect will only run once

  function deletePatient() {
    if (selectedID != null) {
      fetch(
        process.env.REACT_APP_PROTOCOL +
          "://" +
          process.env.REACT_APP_BASE_URL +
          ":" +
          process.env.REACT_APP_PORT +
          "/deletePatient",
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
            LoadData();
          }
        })
        .catch((error) => console.error(error));
    } else {
      alert(" Plzz selected value");
    }
  }

  function LoadData() {
    setSelectedID(null);
    props.setIdIndex(null);

    fetch(
      process.env.REACT_APP_PROTOCOL +
        "://" +
        process.env.REACT_APP_BASE_URL +
        ":" +
        process.env.REACT_APP_PORT +
        "/getPatient",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setFormData(data);
        setSelectedID(null);
        
      })
      .catch((error) => console.error(error));
  }

  function isEmpty(obj) {
    return Object.keys(obj).length === 0 ;
  }
  

  return (
    <div>
      <div className="searchBar">
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ fontSize: "20px" }} id="basic-addon1">
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
            onClick={findSearch}
            style={{ fontSize: "20px" }}
            className="mx-2    "
          >
            {" "}
            Search
          </Button>
        </InputGroup>
      </div>

      <div>
        <Modal show={showError} onHide={handleCloseError}>
          <Modal.Header closeButton>
            <Modal.Title>
              {" "}
              <b style={{ color: "red" }}> Error !!! </b>{" "}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            First Plzz Enter a Value for Searching . . . !!!{" "}
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
              <b style={{ color: "orange"  }}>  No Record Found !!! </b>{" "}
            </Modal.Title>
          </Modal.Header>
         
          <Modal.Footer>
            <Button variant="danger" onClick={handleCloseZero}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <div className="app">
        {isMobile ? (
          <div className="mobile-content">
            <table>
              <thead>
                <tr>
                  <th className="data">Select</th>
                  <th className="data">Name</th>
                  <th className="data"> Number</th>
                </tr>
              </thead>
              <tbody>
                {/* Using Object.keys() to get an array of keys */}
                {Object.keys(formdata).map((key) => (
                  <tr key={key}>
                    <td className="data">
                      {" "}
                      <FormCheck
                        type="radio"
                        name="radioGroup"
                        value={formdata[key].id}                        
                        onChange={handleIDChange}
                      />{" "}
                    </td>
                    <td className="data">{formdata[key].name}</td>
                    <td className="data">{formdata[key].number}</td>
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
                  <th className="data">Name</th>
                  <th className="data"> Email </th>
                  <th className="data"> Number </th>
                  <th className="data">Gender</th>
                  <th className="data">ZipCode</th>
                </tr>
              </thead>
              <tbody>
                {/* Using Object.keys() to get an array of keys */}
                {Object.keys(formdata).map((key) => (
                  <tr key={key}>
                    <td className="data">
                      {" "}
                      <FormCheck
                        type="radio"
                        name="radioGroup"
                        value={formdata[key].id}                       
                        onChange={handleIDChange}
                      />{" "}
                    </td>
                    <td className="data">{formdata[key].name}</td>
                    <td className="data">{formdata[key].email}</td>
                    <td className="data">{formdata[key].number}</td>
                    <td className="data"> {formdata[key].gender}</td>
                    <td className="data"> {formdata[key].zipcode}</td>
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

export default ShowPatient;
