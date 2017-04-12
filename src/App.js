import React, { Component } from 'react';
import './App.css';
import AppBar from 'material-ui/AppBar';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

class App extends Component {
    render () {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <AppBar title="App menu" />
            </MuiThemeProvider>
        );
    }
}

export default App;
