import { gql } from '@apollo/client'

export const GET_PERSON_TRIALS = gql`
  query GetPersonTrials($personId: String!) {
    getPersonTrials(personId: $personId) {
      trialId,
      name,
      personId,
      startDate,
      locationCity,
      locationState,
      locationVenue
    }
  }
`