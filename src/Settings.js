/*global google*/
import React, { Component } from 'react';
import './App.css';
import AppBar from 'material-ui/AppBar';
import darkBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Link } from 'react-router-dom';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';
import Toggle from 'material-ui/Toggle';



class Settings extends Component {

    constructor (props) {
        super(props);
        this.state = { isToggled: localStorage.getItem("stopInSchool") === "true" };
    }

    componentDidMount () {
    }

    stopInSchoolToggled (event, isInputChecked) {
        localStorage.setItem("stopInSchool", isInputChecked);
        this.setState({ isToggled: isInputChecked });
    }

    render () {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <span>
                        <AppBar className="header"
                         showMenuIconButton={false} title="SETTINGS" iconElementRight={<Link to="/"><IconButton><NavigationArrowBack color="black"/></IconButton></Link>} />
                        <div className="content">
                            <div className="row">
                                <div className="col-xs-6">
                                    <Toggle toggled={this.state.isToggled} label="Stop in school" onToggle={this.stopInSchoolToggled.bind(this)} />
                                </div>
                            </div>
                        </div>
                        <div className="clear"/>
                        <div className="footer" />
                </span>
            </MuiThemeProvider>
        );
    }
}

export default Settings;
