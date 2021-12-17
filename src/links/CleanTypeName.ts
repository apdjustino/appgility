import { ApolloLink } from "@apollo/client";

export const CleanTypeName = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    const omitTypename = (key: any, value: any) => (key === "__typename" ? undefined : value);
    operation.variables = JSON.parse(JSON.stringify(operation.variables), omitTypename);
  }
  return forward(operation).map((responseData) => {
    return responseData
  })
  
});