import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Settings from './Settings';
import './index.css';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

ReactDOM.render(
  <Router>
    <div className="container">
        <Route exact path="/" component={App}/>
        <Route exact path="/settings" component={Settings}/>
    </div>
  </Router>,
  document.getElementById('root')
);
