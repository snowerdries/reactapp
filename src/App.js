/*global google*/
import React, { Component } from 'react';
import './App.css';
import AppBar from 'material-ui/AppBar';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

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
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.directionsDisplay.setMap(this.map);
        this.addTrafficLayer();
        //this.addMarkers();
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

        const routeInfo = (<div style={{ margin: '20px' }}>
                       <form>
                           <div>
                               <label>Afstand:</label>
                               <label>{distance}</label>
                           </div>
                           <div>
                               <label>Duur:</label>
                               <label>{duration}</label>
                           </div>
                           <div style={{ marginTop: '20px' }}>
                             {this.state.routeCalculationResult.routes.map(function oneRoute (route, routeIndex) {
                                 return (<div style={{ marginTop: '10px' }} onClick={this.showRoute.bind(this, routeIndex)} key={routeIndex}>Route { routeIndex + 1 }</div>);
                             }, this)}
                            </div>
                       </form>
                    </div>);
        return routeInfo;
    }

    render () {
        const mapStyle = {
            width: '100%',
            height: '60vh'
        };
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <div>
                    <AppBar title="Kaart" />
                    <div ref="mapCanvas" style={mapStyle} />
                    {this.renderRouteInfo()}
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
