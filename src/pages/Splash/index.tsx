import style from "./Splash.module.scss";

import React from "react";
import { Icon, Card, Header, Button } from "semantic-ui-react";
import { useAuth0 } from "@auth0/auth0-react";
import SignupForm from "../../components/SignupForm";

const Splash = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <div className={style.signupCardContainer}>
            <Card>
                <Card.Content>
                    <Card.Header>
                        <h2 style={{ textAlign: "center" }}>
                            <Icon name="signup" />
                            <Header.Content>Appgility</Header.Content>
                        </h2>
                    </Card.Header>
                    <Card.Meta>
                        <span>Trial Secretary Signup</span>
                    </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                    <SignupForm />
                </Card.Content>
                <Card.Content extra>
                    <Card.Meta>
                        Already have an account?{" "}
                        <Button basic color="black" onClick={() => loginWithRedirect()} style={{ marginLeft: "8px" }}>
                            Log In
                        </Button>
                    </Card.Meta>
                </Card.Content>
            </Card>
        </div>
    );
};

export default Splash;
