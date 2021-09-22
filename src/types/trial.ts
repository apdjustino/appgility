import { Scalars, Maybe } from './generic'

export type EventTrial = {
  __typename?: 'EventTrial';
  id: Scalars['String'];
  trialId: Scalars['String'];
  eventId: Scalars['String'];
  type: Scalars['String'];
  akcTrialNumber?: Maybe<Scalars['String']>;
  trialDate?: Maybe<Scalars['String']>;
  onlineEntries?: Maybe<Scalars['Int']>;
  mailEntries?: Maybe<Scalars['Int']>;
  standardClass?: Maybe<Scalars['Boolean']>;
  standardAbility?: Maybe<Array<Maybe<Scalars['String']>>>;
  standardPreferred?: Maybe<Array<Maybe<Scalars['String']>>>;
  jumpersClass?: Maybe<Scalars['Boolean']>;
  jumpersAbility?: Maybe<Array<Maybe<Scalars['String']>>>;
  jumpersPreferred?: Maybe<Array<Maybe<Scalars['String']>>>;
  fastClass?: Maybe<Scalars['Boolean']>;
  fastAbility?: Maybe<Array<Maybe<Scalars['String']>>>;
  fastPreferred?: Maybe<Array<Maybe<Scalars['String']>>>;
  t2bClass?: Maybe<Scalars['Boolean']>;
  premierStandard?: Maybe<Scalars['Boolean']>;
  premierJumpers?: Maybe<Scalars['Boolean']>;
  runLimit?: Maybe<Scalars['Int']>;
};