import React from 'react';
import { Router, Switch} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import EventHome from './pages/EventHome'
import Layout from './layouts/main'
import history from './utils/history'

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
    const token = await getAccessTokenSilently({ audience: 'https://graph.appgility.com'})
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });  
  const link = ApolloLink.from([withToken, httpLink]);
  const client = new ApolloClient({    
    link: link,
    cache: new InMemoryCache(),    
  })
  return (
    <ApolloProvider client={client}>
      <Router history={history}>
        <Layout>
          <Switch>      
            <ProtectedRoute path='/events/:eventId' component={EventHome} />
            <ProtectedRoute path='/' component={Home} />       
          </Switch>
        </Layout>      
      </Router>
    </ApolloProvider>
    

  );
}

export default App;
