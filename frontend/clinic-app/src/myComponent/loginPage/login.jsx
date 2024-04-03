import "./login.css";

import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import React from "react";

import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { validateEmail, validateLogin, validatePassword } from "./validation";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const [inputValue, setInputValue] = useState({ email: "", password: "" });
  const [isValid, setIsValid] = useState({
    getEmailBoolValue: true,
    getPasswordBoolValue: true,
    errorPasswordMessage: "",
    errorEmailMessage: "",
  });

  function checkErr(event) {
    var type = event.target.name;

    var obj;

    if (type === "email") {
      obj = validateEmail(inputValue.email);

      setIsValid({
        ...isValid,
        getEmailBoolValue: obj.getEmailBoolValue,
        errorEmailMessage: obj.errorEmailMessage,
      });
    }

    if (type === "password") {
      obj = validatePassword(inputValue.password);

      setIsValid({
        ...isValid,
        getPasswordBoolValue: obj.getPasswordBoolValue,
        errorPasswordMessage: obj.errorPasswordMessage,
      });
    }
  }

  const handleChange = (event) => {
    setInputValue({
      ...inputValue,
      [event.target.name]: event.target.value,
    });
  };

  let navigate = useNavigate();

  function gotoNext() {
    navigate("/patient");
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isValid.getEmailBoolValue && isValid.getPasswordBoolValue) {
      fetch(
        process.env.REACT_APP_PROTOCOL +
          "://" +
          process.env.REACT_APP_BASE_URL +
          ":" +
          process.env.REACT_APP_PORT +
          "/loginForm",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inputValue),
        }
      )
        .then((response) => response.text())
        .then((data) => {
          var obj;

          if (data !== "eno") {
            const decodedToken = jwtDecode(data);
            console.log(data);

            if (decodedToken.loggedIn === "confirm") {
              localStorage.setItem(
                "decodedToken",
                JSON.stringify(decodedToken)
              );
              props.setLoggedSession();
              gotoNext();
            } else if (data === "pno") {
              obj = validateLogin("passwordError");
              setIsValid({
                ...isValid,
                getPasswordBoolValue: obj.getPasswordBoolValue,
                errorPasswordMessage: obj.errorPasswordMessage,
              });
            }
          } else if (data === "eno") {
            obj = validateLogin("emailError");
            setIsValid({
              ...isValid,
              getEmailBoolValue: obj.getEmailBoolValue,
              errorEmailMessage: obj.errorEmailMessage,
            });
          } else {
            alert(" Opps.. Something Went Wrong !!! ");
          }
        })
        .catch((error) => console.error(error));
    } else {
      alert(" Plzz Fill all Details Accuretly ");
    }
  };

  return (
    <div>
      <Card
        className="logForms"
        style={{ border: "5px solid rgb(0, 102, 255)" }}
      >
        <Card.Body>
          <p className="logHead"> Please Login To Continue </p>

          <Form onSubmit={handleSubmit}>
            <FloatingLabel
              controlId="floatingInput"
              label="Email address"
              className="mb-3"
            >
              <Form.Control
                onChange={handleChange}
                onKeyUp={checkErr}
                type="email"
                name="email"
                placeholder="name@example.com"
                required
                style={{
                  borderColor: isValid.getEmailBoolValue ? "" : "red",
                  boxShadow: isValid.getEmailBoolValue ? "" : " 0 0 10px red",
                }}
              />
              {!isValid.getEmailBoolValue && (
                <p className="inputErrord"> {isValid.errorEmailMessage} </p>
              )}
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </FloatingLabel>

            <FloatingLabel controlId="floatingPassword" label="Password">
              <Form.Control
                onChange={handleChange}
                onKeyUp={checkErr}
                type="password"
                name="password"
                placeholder="Password"
                required
                style={{
                  borderColor: isValid.getPasswordBoolValue ? "" : "red",
                  boxShadow: isValid.getPasswordBoolValue
                    ? ""
                    : " 0 0 10px red",
                }}
              />
              {!isValid.getPasswordBoolValue && (
                <p className="inputErrord"> {isValid.errorPasswordMessage} </p>
              )}
            </FloatingLabel>
            <br />
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Remember Me " />
            </Form.Group>
            <br />
            <Button
              style={{
                marginLeft: "33%",
                paddingLeft: "10%",
                paddingRight: "10%",
                fontSize: "120%",
                fontWeight: "500",
              }}
              variant="success"
              type="submit"
            >
              Sign In
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;
