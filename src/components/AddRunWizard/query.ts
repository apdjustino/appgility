import { gql } from "@apollo/client";

export const SEARCH_PERSON = gql`
  query SearchPerson($query: String!) {
    searchPerson(query: $query) {
      personId,
      name,
      email
    }
  }
`