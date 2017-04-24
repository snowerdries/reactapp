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
import TextField from 'material-ui/TextField';



class Settings extends Component {

    constructor (props) {
        super(props);
        let settings = JSON.parse(localStorage.getItem("settings"));
        if (!settings) {
            settings = { isToggled: false };
        }
        this.state = settings;
    }

    componentDidMount () {
        const homeInput = document.getElementById("homeAddress");
        this.autocompleteHome = new google.maps.places.Autocomplete(homeInput);
        this.autocompleteHome.addListener('place_changed', this.homeAddressSelected.bind(this));

        const schoolInput = document.getElementById("schoolAddress");
        this.autocompleteSchool = new google.maps.places.Autocomplete(schoolInput);
        this.autocompleteSchool.addListener('place_changed', this.schoolAddressSelected.bind(this));

        const workInput = document.getElementById("workAddress");
        this.autocompleteWork = new google.maps.places.Autocomplete(workInput);
        this.autocompleteWork.addListener('place_changed', this.workAddressSelected.bind(this));
    }

    componentWillUnmount () {
        localStorage.setItem("settings", JSON.stringify(this.state));
    }

    homeAddressSelected () {
        const place = this.autocompleteHome.getPlace();
        this.setState({ homeText: place.formatted_address, homeLocation: place.geometry.location });
    }

    schoolAddressSelected () {
        const place = this.autocompleteSchool.getPlace();
        this.setState({ schoolText: place.formatted_address, schoolLocation: place.geometry.location });
    }

    workAddressSelected () {
        const place = this.autocompleteWork.getPlace();
        this.setState({ workText: place.formatted_address, workLocation: place.geometry.location });
    }

    stopInSchoolToggled (event, isInputChecked) {
        this.setState({ isToggled: isInputChecked });
    }

    render () {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <span>
                        <AppBar className="header"
                         showMenuIconButton={false} title="SETTINGS" iconElementRight={<Link to="/"><IconButton><NavigationArrowBack /></IconButton></Link>} />
                        <div className="content settingscontent">
                            <div className="row">
                                <div className="col-xs-6">
                                    <Toggle toggled={this.state.isToggled} label="Stop in school" onToggle={this.stopInSchoolToggled.bind(this)} />
                                </div>
                            </div>
                            <div className="row addresssettings">
                                <div className="col-xs-12">
                                    <label>{this.state.homeText}</label>
                                </div>
                                <div className="col-xs-12">
                                    <TextField id="homeAddress"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12">
                                    <label>{this.state.schoolText}</label>
                                </div>
                                <div className="col-xs-12">
                                    <TextField id="schoolAddress"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12">
                                    <label>{this.state.workText}</label>
                                </div>
                                <div className="col-xs-12">
                                    <TextField id="workAddress"/>
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
