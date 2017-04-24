/*global google*/
import React, { Component } from 'react';
import './App.css';
import AppBar from 'material-ui/AppBar';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Link } from 'react-router-dom';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';



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
                         showMenuIconButton={false} title="Settings" iconElementRight={<Link to="/"><IconButton><NavigationArrowBack color="black"/></IconButton></Link>} />
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
