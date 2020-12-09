import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import login from './pages/Login';
import signup from './pages/SignUp';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/signup" component={signup} />
          <Route exact path="/login" component={login} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
