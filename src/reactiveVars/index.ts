
import { makeVar } from '@apollo/client';
import { PersonView } from '../components/AddRunWizard/Step1';
import { AddRunFormData } from '../types/run';

export const getEventId = makeVar<string | undefined>(undefined);

export const selectedEventMenu = makeVar<string | undefined>(undefined);

export const addRunFormVar = makeVar<AddRunFormData>({ personId: '', dogId: '', runs: []});

export const selectedPersonForRunVar = makeVar<PersonView[]>([]);