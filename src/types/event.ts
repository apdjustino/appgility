import { Scalars, Maybe } from './generic'

export type Event = {
  __typename?: 'Event';
  id: Scalars['String'];
  eventId: Scalars['String'];
  type: Scalars['String'];
  name: Scalars['String'];
  locationCity: Scalars['String'];
  locationState: Scalars['String'];
  status: Scalars['String'];
  trialSite?: Maybe<Scalars['String']>;
  hostClub?: Maybe<Scalars['String']>;
  runPrices?: Maybe<Array<Maybe<Scalars['Int']>>>;
  premiumLink?: Maybe<Scalars['String']>;
  openingDate?: Maybe<Scalars['String']>;
  closingDate?: Maybe<Scalars['String']>;
  trialChairName?: Maybe<Scalars['String']>;
  trialChairEmail?: Maybe<Scalars['String']>;
  trialChairPhone?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
};

export type PersonEvent = {
  __typename?: 'PersonEvent';
  id: Scalars['String'];
  eventId: Scalars['String'];
  personId: Scalars['String'];
  type: Scalars['String'];
  name: Scalars['String'];
  locationCity: Scalars['String'];
  locationState: Scalars['String'];
  status: Scalars['String'];
  trialSite?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  trialDates?: Maybe<Array<Maybe<Scalars['String']>>>;
};