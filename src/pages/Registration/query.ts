import { gql } from "@apollo/client";

export const GET_TRIAL_DATES = gql`
  query GetTrialDates($eventId: String!) {
    getEventTrials(eventId: $eventId) {
      trialId,
      trialDate
    },
    getEvent(eventId: $eventId) {
      name
    }
  }
`