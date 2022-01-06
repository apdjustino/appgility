import { ApolloLink } from "@apollo/client";
import history from "../utils/history";

export const ExpiredTokenLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((responseData) => {
    const { data, errors } = responseData;    
    if (!!errors && !!errors[0].extensions && errors[0].extensions.code === "UNAUTHENTICATED") {      
      localStorage.removeItem("appgilityAccessToken");
      window.location.pathname = "/"
    }
    return responseData;
  })
})