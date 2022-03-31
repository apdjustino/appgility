import React from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";

type OwnProps = {
    children: React.ReactNode;
};

const ProtectedRoute = ({ children }: OwnProps) => {
    const Component = withAuthenticationRequired(() => <>{children}</>);
    return <Component />;
};

export default ProtectedRoute;
