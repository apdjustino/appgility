import { gql } from '@apollo/client'

export const ADD_PERSON = gql`
  mutation AddPerson($data: PersonInput, $password: String) {
    addPerson(data: $data, password: $password) {
      personId
    }
  }
`

export const GET_PERSON_BY_EMAIL = gql`
  query GetPersonByEmail($email: String!) {
    getPersonByEmail(email: $email) {
      personId,
      name,
      email,
      address,
      city,
      state,
      phone,
      zip
    }
  }
`

export const ADD_DOG = gql`
  mutation AddDog($personId: String!, $dog: DogInput!) {
    addDog(personId: $personId, dog: $dog) {
      dogId,
      personId,
      callName,
      breed,
      sex,
      dob
    }
  }
`