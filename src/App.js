/*global google*/
import React, { Component } from 'react';
import './App.css';
import AppBar from 'material-ui/AppBar';
import darkBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Link } from 'react-router-dom';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import IconButton from 'material-ui/IconButton';
import { sumBy } from 'lodash';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import MapsDirectionsCar from 'material-ui/svg-icons/maps/directions-car';
import ImageTimer from 'material-ui/svg-icons/image/timer';


injectTapEventPlugin();

class App extends Component {

    constructor (props) {
        super(props);
        this.state = { value: 1 };
    }

    componentDidMount () {
        this.settings = JSON.parse(localStorage.getItem("settings"));
        if (!this.settings) {
            this.settings = {};
        }
        this.home = new google.maps.LatLng(this.settings.homeLocation);
        this.work = new google.maps.LatLng(this.settings.workLocation);
        this.school = new google.maps.LatLng(this.settings.schoolLocation);
        this.map = this.createMap();
        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
        this.directionsDisplay.setMap(this.map);
        this.addTrafficLayer();
        this.addMarkers();
        this.calculateRoute();
    }

    createMap () {
        const mapOptions = {
            zoom: 12,
            center: this.home
        };
        return new google.maps.Map(this.refs.mapCanvas, mapOptions);
    }

    addTrafficLayer () {
        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(this.map);
    }

    addMarkers () {
        this.homeMarker = new google.maps.Marker({
            position: this.home,
            title: 'Thuis',
            label: 'T'
        });
        this.homeMarker.setMap(this.map);

        this.workMarker = new google.maps.Marker({
            position: this.work,
            title: 'Werk',
            label: 'W'
        });
        this.workMarker.setMap(this.map);

        this.workMarker = new google.maps.Marker({
            position: this.school,
            title: 'School',
            label: 'S'
        });
        this.workMarker.setMap(this.map);
    }

    calculateRoute () {
        let waypoints = [];
        if (this.settings.isStopAtSchoolToggled) {
            waypoints = [{ location: this.school, stopover: true }];
        }

        let a = this.home;
        let b = this.work;

        const hour = new Date().getHours();
        if (hour > 13) {
            a = this.work;
            b = this.home;
        }

        const routeRequest = {
            origin: a,
            destination: b,
            travelMode: 'DRIVING',
            drivingOptions: {
                departureTime: new Date(),
                trafficModel: 'bestguess'
            },
            waypoints: waypoints,
            provideRouteAlternatives: true
        };
        const self = this;
        this.directionsService.route(routeRequest, function routeCalculated (result, status) {
            if (status === 'OK') {
                self.setState({ routeInfo: result.routes[0], routeCalculationResult: result, selectedRoute: 0 });
            }
        });
    }

    showRoute (event, index, value) {
        this.setState({ routeInfo: this.state.routeCalculationResult.routes[value], selectedRoute: value });
    }

    renderRouteSelection () {
        if (!this.state.routeCalculationResult) {
            return null;
        }

        return (
        <SelectField className="routeselection"
          floatingLabelText="Route"
          value={this.state.selectedRoute}
          onChange={this.showRoute.bind(this)}>
        {this.state.routeCalculationResult.routes.map(function oneRoute (route, routeIndex) {
            const label = "Route " + (routeIndex + 1);
            return (<MenuItem value={routeIndex} primaryText={label} key={routeIndex}
             />);
        }, this)}
        </SelectField>
        );
    }

    renderRouteInfo () {
        if (!this.state.routeCalculationResult) {
            return;
        }
        let distance;
        let duration;

        if (this.state && this.state.routeInfo && this.state.routeInfo.legs) {
            this.directionsDisplay.setDirections(this.state.routeCalculationResult);
            this.directionsDisplay.setRouteIndex(this.state.routeCalculationResult.routes.indexOf(this.state.routeInfo));
            distance = sumBy(this.state.routeInfo.legs, function (leg) {
                return leg.distance.value;
            });
            duration = sumBy(this.state.routeInfo.legs, function (leg) {
                return leg.duration.value;
            });

            distance /= 1000;
            duration = Math.ceil(duration / 60);
        }

        const routeInfo = (
        <div className="footer">
                {
                    this.state.routeInfo.legs.map(function oneLeg (leg, index) {
                        const key = "route" + index;
                        return (
                            <div key={key} className="row">
                                <div className="col-xs-1">
                                    {index + 1}
                                </div>
                                <div className="col-xs-5">
                                    <MapsDirectionsCar /> {leg.distance.text}
                                </div>
                                <div className="col-xs-5">
                                    <ImageTimer /> {leg.duration.text}
                                </div>
                            </div>
                        );
                    })
                }
                <div className="row">
                    <div className="col-xs-1">
                        Tot.
                    </div>
                    <div className="col-xs-5">
                        <MapsDirectionsCar /> <span>{distance} km</span>
                    </div>
                    <div className="col-xs-5">
                        <ImageTimer /> {duration} min
                    </div>
                 </div>
        </div>
        );
        return routeInfo;
    }

    render () {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <span>
                    <div className="header">
                    <AppBar showMenuIconButton={false}
                    title="KAART" iconElementRight={<Link to="/settings"><IconButton><ActionSettings /></IconButton></Link>} />
                    {this.renderRouteSelection()}
                    </div>
                    <div ref="mapCanvas" className="content" />
                    <div className="clear"/>
                    {this.renderRouteInfo()}
                </span>
            </MuiThemeProvider>
        );
    }
}

export default App;
