import { ApolloLink } from "@apollo/client";
import history from "../utils/history";

export const ExpiredTokenLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((responseData) => {
    const { data, errors } = responseData;
    if (!!errors && errors[0].message === "jwt expired") {
      localStorage.removeItem("accessToken");
      history.push("/");
    }
    return responseData;
  })
})