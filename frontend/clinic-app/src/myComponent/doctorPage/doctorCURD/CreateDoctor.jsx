import Modal from "react-bootstrap/Modal";
import "./CreateDoctor.css";

import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import React, { useState, forwardRef, useImperativeHandle } from "react";

const CreateDoctor = forwardRef((props, ref) => {
  
  useImperativeHandle(ref, () => ({
    createDoctor,
  }));

  const [showMessage, setShowMessage] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isActive: "yes",
    specialist: "Cardiologist",
    mobile: "",
    slotTime: 10,
  });

  function createDoctor() {
    props.onShow();
  }

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
        "/createDoctor",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    )
      .then((response) => response.text())
      .then((data) => {
        if (data === "createdOK") {
          setFormData({
            isActive: "yes",
            specialist: "Cardiologist",
            slotTime: 10,
          });
          props.loadDoctors();
          props.onHide();
          handleShowMessage();
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <Alert className="fixed-top" show={showMessage} variant="success">
        Doctor Created Succesfully
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
          <Modal.Title className="modaltitle">Create New Doctor</Modal.Title>
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
                      &nbsp;&nbsp; IsActive : &nbsp;&nbsp;{" "}
                    </Form.Label>
                    <Form.Check
                      type="radio"
                      label="Yes"
                      name="isActive"
                      value="yes"
                      checked={formData.isActive === "yes" }
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
              </Row>
              <Row>
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
                      <option value="Gastroenterologist">
                        Gastroenterologist
                      </option>
                      <option value="Dermatologist">Dermatologist</option>
                    </Form.Control>
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
                     IsActive : &nbsp;&nbsp;{" "}
                    </Form.Label>
                    <Form.Check
                      type="radio"
                      label="Yes"
                      name="isActive"
                      value="yes"
                      checked={formData.isActive === "yes" }
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
              </Row>
              <Row>
                <Col>
                <Form.Group controlId="Specialist">
                    <Form.Label className="labelfontP pt-4  "> Specialist </Form.Label>
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
                      <option value="Gastroenterologist">
                        Gastroenterologist
                      </option>
                      <option value="Dermatologist">Dermatologist</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="formZipCode">
                    <Form.Label className="labelfontP pt-4  ">Slot Time</Form.Label>
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
});

export default CreateDoctor;
