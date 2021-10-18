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

function App() {
  return (
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
  );
}

export default App;
