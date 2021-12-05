import React from "react";
import { Col, Container, Row } from 'react-bootstrap';
import SignupForm from "../../components/SignupForm";

const Signup = () => {
  return (
    <div className="d-flex align-items-center min-vh-100 bg-auth border-top border-top-2 border-primary">
      <Container fluid>
        <Row className="align-items-center justify-content-center">
          <Col xs={12} md={5} lg={6} xl={4} className="px-lg-6 my-5">
            <SignupForm />
          </Col>
          <Col xs={12} md={7} lg={6} xl={8} className="d-none d-lg-block">
            <div
              className="bg-cover vh-100 mt-n1 me-n3"
              style={{
                backgroundImage: 'url(/img/agility/molly-splash-2.jpeg)',
              }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  )
  
}

export default Signup;