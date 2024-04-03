import Modal from "react-bootstrap/Modal";
import "./createPatient.css";

import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

function CreatePatient(props) {

  const [showMessage, setShowMessage] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    address: "",
    mobile: "",
    zipcode: 0,
  });


  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000); // Hide the message after 2 seconds
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(
      process.env.REACT_APP_PROTOCOL +
        "://" +
        process.env.REACT_APP_BASE_URL +
        ":" +
        process.env.REACT_APP_PORT +
        "/createPatient",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    )
      .then((response) => response.text())
      .then((data) => {
        if (data === "createdOK") {
          props.loadPatients();
          setFormData({});
          props.onHide();
          handleShowMessage();
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <Alert className="fixed-top" show={showMessage} variant="success">
        Patient Created Succesfully
      </Alert>

      {/* For Desktop Only  */}
      <Modal
        className="d-none d-md-block"
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="modaltitle">Create New Patient</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Container>
            <Form onSubmit={handleSubmit}>
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
              </Row>
              <Row className="pb-3">
                <Col>
                  {" "}
                  <Form.Group controlId="formMobile">
                    <Form.Label className="labelfont">Mobile Number</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="Enter your mobile number"
                      name="mobile"
                      minLength={10}
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col className="pt-4 m-2">
                  {" "}
                  <Form.Group controlId="formGender">
                    <Form.Label className="labelfont">
                      &nbsp;&nbsp; Gender : &nbsp;&nbsp;{" "}
                    </Form.Label>
                    <Form.Check
                      type="radio"
                      label="Male"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleChange}
                      required
                      inline
                    />
                    <Form.Check
                      type="radio"
                      label="Female"
                      name="gender"
                      value="female"
                      inline
                      checked={formData.gender === "female"}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formAddress">
                    <Form.Label className="labelfont">Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      type="textarea"
                      placeholder="Enter your address"
                      name="address"
                      maxLength={200}
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formZipCode">
                    <Form.Label className="labelfont"> Zip Code </Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter your ZipCode"
                      name="zipcode"
                      style={{ width: "70%" }}
                      maxLength={10}
                      value={formData.zipcode}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="controlBtn">
                  {" "}
                  <Button variant="primary" type="submit">
                    Create
                  </Button>{" "}
                  &nbsp;&nbsp;
                  <Button variant="danger" onClick={props.onHide}>
                    {" "}
                    Close{" "}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>
        </Modal.Body>
      </Modal>

      {/* For Mobile Phone Only  */}
      <Modal
        className="d-block d-md-none "
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="modaltitleP">
            {" "}
            Create New Patient{" "}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Container>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <Form.Group controlId="formName">
                    <Form.Label className="labelfontP">Name </Form.Label>
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
                  </Form.Group>{" "}
                  <Form.Group controlId="formEmail">
                    <Form.Label className="labelfontP">Email</Form.Label>
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
              </Row>
              <Row>
                <Col>
                  {" "}
                  <Form.Group controlId="formMobile">
                    <Form.Label className="labelfontP">
                      Mobile Number
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="Enter your mobile number"
                      name="mobile"
                      minLength={10}
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>{" "}
                  <Form.Group controlId="formGender">
                    <Form.Label className="labelfontP pt-4  ">
                      Gender : &nbsp;&nbsp;{" "}
                    </Form.Label>
                    <Form.Check
                      type="radio"
                      label="Male"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleChange}
                      required
                      inline
                    />
                    <Form.Check
                      type="radio"
                      label="Female"
                      name="gender"
                      value="female"
                      inline
                      checked={formData.gender === "female"}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formAddress">
                    <Form.Label className="labelfontP">Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      type="textarea"
                      placeholder="Enter your address"
                      name="address"
                      maxLength={200}
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formZipCode">
                    <Form.Label className="labelfontP"> Zip Code </Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter your ZipCode"
                      name="zipcode"
                      style={{ width: "70%" }}
                      maxLength={10}
                      value={formData.zipcode}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <br />
              <Row>
                <Col className="controlBtn">
                  {" "}
                  <Button variant="primary" type="submit">
                    Create
                  </Button>{" "}
                  &nbsp;&nbsp;
                  <Button variant="danger" onClick={props.onHide}>
                    {" "}
                    Close{" "}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreatePatient;
