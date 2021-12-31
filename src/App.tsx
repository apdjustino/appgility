import React from 'react';
import { Router, Switch, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Signup from "./pages/Signup";
import history from './utils/history'
import { ExpiredTokenLink } from './links/ExpiredToken'; 
import { CleanTypeName } from './links/CleanTypeName';

import './App.css';
import { ApolloClient, ApolloLink, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuth0 } from '@auth0/auth0-react';

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
      <Router history={history}>        
          <Switch>            
            <ProtectedRoute path='/secretary' component={Home} />
            <Route path='/' component={Signup} />       
          </Switch>        
      </Router>
    </ApolloProvider>
    

  );
}

export default App;
