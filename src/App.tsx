import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Signup from "./pages/Signup";
import { ExpiredTokenLink } from './links/ExpiredToken'; 
import { CleanTypeName } from './links/CleanTypeName';
import Layout from "./layouts/main";
import Configuration from "./pages/Configuration"
import Registration from "./pages/Registration"
import EventDashboard from './pages/EventDashboard';

import './App.css';
import { ApolloClient, ApolloLink, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuth0 } from '@auth0/auth0-react';
import ConfigureTrials from './components/ConfigureTrials';
import BasicTrialConfig from './components/BasicTrialConfig';
import RegistrationConfig from './components/RegistrationConfig';
import TrialRegistration from './components/TrialRegistration';
import AddRunWizard from './components/AddRunWizard';

function App() {
  const { getAccessTokenSilently } = useAuth0()
  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPH_URL
  })
  
  const withToken = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists      
    // const token = localStorage.getItem('appgilityAccessToken');
    let token = localStorage.getItem('appgilityAccessToken')    
    if (!token) {
      try {
        token = await getAccessTokenSilently({ audience: 'https://graph.appgility.com'})
        localStorage.setItem("appgilityAccessToken", token);
      } catch (error) {
        token = ''
      }
    }    
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });  
  const link = ApolloLink.from([withToken, CleanTypeName, ExpiredTokenLink, httpLink]);
  const client = new ApolloClient({    
    link,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            getTrialRunsPaginated: {
              keyArgs: ["trialId", "agilityClass", "level", "jumpHeight", "preferred", "regular", "search"],
              merge(existing, incoming, opts) {                
                if (!existing) {
                  return incoming
                }

                const merged = {...incoming}
                merged.runs = [...existing.runs, ...incoming.runs]
                return merged
              }
            }
          }
        }
      }
    }),    
  })
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>        
          <Routes>          
            <Route path="/" element={<Signup />} />
            <Route path="/secretary" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="home" element={<ProtectedRoute><EventDashboard /></ProtectedRoute>}></Route>
              <Route path="events">
                <Route path=":eventId/configuration" element={<ProtectedRoute><Configuration /></ProtectedRoute>}>
                  <Route path="trials" element={<ProtectedRoute><ConfigureTrials /></ProtectedRoute>} />
                  <Route path="basic" element={<ProtectedRoute><BasicTrialConfig /></ProtectedRoute>} />
                  <Route path="registration" element={<ProtectedRoute><RegistrationConfig /></ProtectedRoute>} />
                </Route>
                <Route path=":eventId/registration" element={<ProtectedRoute><Registration /></ProtectedRoute>}>
                  <Route path=":trialId" element={<ProtectedRoute><TrialRegistration /></ProtectedRoute>} />
                  <Route path=":trialId/add" element={<ProtectedRoute><AddRunWizard /></ProtectedRoute>} />
                </Route>
              </Route>
            </Route>                   
          </Routes>        
      </BrowserRouter>
    </ApolloProvider>
    

  );
}

export default App;
