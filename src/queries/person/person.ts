import { gql } from '@apollo/client'

export const ADD_PERSON = gql`
  mutation AddPerson($data: PersonInput, $password: String) {
    addPerson(data: $data, password: $password) {
      personId
    }
  }
`