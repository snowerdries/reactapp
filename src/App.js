/*global google*/
import React, { Component } from 'react';
import './App.css';
import AppBar from 'material-ui/AppBar';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Link } from 'react-router-dom';

injectTapEventPlugin();

class App extends Component {

    constructor (props) {
        super(props);
        this.state = { value: 1 };
    }

    componentDidMount () {
        this.home = new google.maps.LatLng(51.139116, 4.542925);
        this.work = new google.maps.LatLng(51.147526, 4.436579);
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
    }

    calculateRoute () {
        const routeRequest = {
            origin: this.home,
            destination: this.work,
            travelMode: 'DRIVING',
            provideRouteAlternatives: true
        };
        const self = this;
        this.directionsService.route(routeRequest, function routeCalculated (result, status) {
            if (status === 'OK') {
                self.setState({ routeInfo: result.routes[0], routeCalculationResult: result });
            }
        });
    }

    showRoute (routeIndex) {
        this.setState({ routeInfo: this.state.routeCalculationResult.routes[routeIndex] });
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
            distance = this.state.routeInfo.legs[0].distance.text;
            duration = this.state.routeInfo.legs[0].duration.text;
        }

        const routeInfo = (
        <div className="footer">
            <form>
                <div>
                    <label>Afstand:</label>
                    <label>{distance}</label>
                </div>
                <div>
                    <label>Duur:</label>
                    <label>{duration}</label>
                </div>
                <div className="routebuttons">
                    {this.state.routeCalculationResult.routes.map(function oneRoute (route, routeIndex) {
                        return (<span className="routebutton"
                        onClick={this.showRoute.bind(this, routeIndex)}
                        key={routeIndex}>Route { routeIndex + 1 }</span>);
                    }, this)}
                </div>
            </form>
        </div>
        );
        return routeInfo;
    }

    render () {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <span>
                    <AppBar className="header" showMenuIconButton={false}
                    title="Kaart" iconElementRight={<Link to="/settings">SETTINGS</Link>} />
                    <div ref="mapCanvas" className="content" />
                    <div className="clear"/>
                    {this.renderRouteInfo()}
                </span>
            </MuiThemeProvider>
        );
    }
}

export default App;
