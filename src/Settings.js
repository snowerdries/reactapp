/*global google*/
import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom';

class Settings extends Component {
    constructor (props) {
        super(props);
        let settings = JSON.parse(localStorage.getItem("settings"));
        if (!settings) {
            settings = { isStopAtSchoolToggled: false };
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

    handleInputChange (event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ isStopAtSchoolToggled: value });
    }

    renderHeader () {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                        <span className="sr-only">Navigatie</span>
                        <span className="icon-bar" />
                        <span className="icon-bar" />
                        <span className="icon-bar" />
                    </button>
                    <a className="navbar-brand" href="#">Settings</a>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <Link to="/"><i className="fa fa-long-arrow-left fa-2x" aria-hidden="true" /></Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }

    render () {
        return (
            <span>
                    {this.renderHeader()}
                    <div className="content settingscontent">
                        <div className="row">
                            <div className="col-xs-6">
                                <label>
                                    Stop in school
                                    <input
                                        name="stopInSchool"
                                        type="checkbox"
                                        checked={this.state.isStopAtSchoolToggled}
                                        onChange={this.handleInputChange.bind(this)} />
                                </label>
                            </div>
                        </div>
                        <div className="row addresssettings">
                            <div className="col-xs-12">
                                <label>{this.state.homeText}</label>
                            </div>
                            <div className="col-xs-12">
                                <input type="text" id="homeAddress"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <label>{this.state.schoolText}</label>
                            </div>
                            <div className="col-xs-12">
                                <input type="text" id="schoolAddress"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <label>{this.state.workText}</label>
                            </div>
                            <div className="col-xs-12">
                                <input type="text" id="workAddress"/>
                            </div>
                        </div>
                    </div>
                    <div className="clear"/>
            </span>
        );
    }
}

export default Settings;
