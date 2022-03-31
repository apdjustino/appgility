import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import reportWebVitals from "./reportWebVitals";
import "semantic-ui-css/semantic.min.css";
import "./styles/theme.scss";
import history from "./utils/history";

const onRedirectCallback = (appState: any) => {
    // Use the router's history module to replace the url
    history.replace(appState?.returnTo || window.location.pathname);
};

ReactDOM.render(
    <React.StrictMode>
        <Auth0Provider
            domain="dev-egx1hh70.us.auth0.com"
            clientId="jA5MmuRvIVxCr4PHKNIj5PNBlPoOht6a"
            redirectUri={`${process.env.REACT_APP_HOST_URL}/secretary/home`}
            audience="https://graph.appgility.com"
            onRedirectCallback={onRedirectCallback}
        >
            <App />
        </Auth0Provider>
    </React.StrictMode>,
    document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
