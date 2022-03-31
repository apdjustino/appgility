import { ApolloLink } from "@apollo/client";

export const ExpiredTokenLink = new ApolloLink((operation, forward) => {
    return forward(operation).map((responseData) => {
        const { errors } = responseData;
        if (!!errors && !!errors[0].extensions && errors[0].extensions.code === "UNAUTHENTICATED") {
            localStorage.removeItem("appgilityAccessToken");
            window.location.pathname = "/";
        }
        return responseData;
    });
});
