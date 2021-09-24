import { Maybe, Scalars } from "./generic";

export enum Sex {
  Male = 'MALE',
  Female = 'FEMALE'
}

export type Dog = {
  __typename?: 'Dog';
  id: Scalars['String'];
  dogId: Scalars['String'];
  personId: Scalars['String'];
  type: Scalars['String'];
  callName: Scalars['String'];
  akcNumber?: Maybe<Scalars['String']>;
  akcName?: Maybe<Scalars['String']>;
  akcPrefix?: Maybe<Scalars['String']>;
  akcSuffix?: Maybe<Scalars['String']>;
  breed?: Maybe<Scalars['String']>;
  dob?: Maybe<Scalars['String']>;
  jumpHeight?: Maybe<Scalars['Int']>;
  sex?: Maybe<Sex>;
  deleted?: Maybe<Scalars['Boolean']>;
};