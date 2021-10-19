import React from 'react';

import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// integrate Apollo server into the front-end of application
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
// import React-Router-Dom
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// Retrieve token everytime we make GraphQL request
import { setContext } from '@apollo/client/link/context';

// establish a new link to the GraphQL server/endpoint
const httpLink = createHttpLink({
  // uri: 'http://localhost:3001/graphql',
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token? `Bearer ${token}` : '',
    }
  }
})

// ApolloClient() constructor to instantiate the Apollo Client and create the connection to the API endpoint
  // also instantiates a new cache
    // authLink is added so every request retrieves the token and sets the request headers before making the request to the API.
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})


function App() {
  return (
    // enable entire app to interact with ApolloClient instance 
    <ApolloProvider client={client}>
      
      {/* makes all child components aware of all client-side routing */}
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path='/' component={SearchBooks} />
            <Route exact path='/saved' component={SavedBooks} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </>
      </Router>

    </ApolloProvider>
  );
}

export default App;
