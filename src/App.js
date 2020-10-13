import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/login" component={login} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
