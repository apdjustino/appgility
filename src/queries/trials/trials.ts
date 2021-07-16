import { gql } from '@apollo/client'

export const GET_PERSON_TRIALS = gql`
  query GetPersonTrials($personId: String!) {
    getPersonTrials(personId: $personId) {
      trialId,
      name,
      personId,
      startDate,
      endDate,
      locationCity,
      locationState,
      locationVenue
    }
  }
`

export const ADD_NEW_TRIAL = gql`
  mutation AddTrial($data: CreateNewTrialInput, $personId: String) {
    addTrial(data: $data, personId: $personId) {
      trialId,
      name
    }
  }
`