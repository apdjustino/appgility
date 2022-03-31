import { gql } from "@apollo/client";

export const ADD_PERSON = gql`
    mutation AddPerson($data: PersonInput, $password: String) {
        addPerson(data: $data, password: $password) {
            personId
            email
            name
        }
    }
`;

export const GET_PERSON_BY_EMAIL = gql`
    query GetPersonByEmail($email: String!) {
        getPersonByEmail(email: $email) {
            personId
            name
            email
            address
            city
            state
            phone
            zip
        }
    }
`;

export const ADD_DOG = gql`
    mutation AddDog($personId: String!, $secretaryId: String!, $dog: DogInput!) {
        addDog(personId: $personId, secretaryId: $secretaryId, dog: $dog) {
            dogId
            personId
            callName
            breed
            sex
            dob
        }
    }
`;
