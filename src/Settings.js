/*global google*/
import React, { Component } from 'react';
import './App.css';
import AppBar from 'material-ui/AppBar';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Link } from 'react-router-dom';



class Settings extends Component {

    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidMount () {
    }

    render () {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <span>
                        <AppBar className="header"
                         showMenuIconButton={false} title="Settings" iconElementRight={<Link to="/">BACK</Link>} />
                        <div className="content">
                            Dit zijn de settings.
                        </div>
                        <div className="clear"/>
                        <div className="footer" />
                </span>
            </MuiThemeProvider>
        );
    }
}

export default Settings;
