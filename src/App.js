/*global google*/
import React, { Component } from 'react';
import './App.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Link } from 'react-router-dom';
import { sumBy } from 'lodash';

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

    showRoute (value) {
        this.setState({ routeInfo: this.state.routeCalculationResult.routes[value], selectedRoute: value });
    }

    renderRouteSelection () {
        if (!this.state.routeCalculationResult) {
            return null;
        }
        return (
            <div className="dropdown">
                <button className="btn btn-default dropdown-toggle" type="button" id="routeSelection" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                    Route
                    <span className="caret" />
                </button>
                <ul className="dropdown-menu dropdownright" aria-labelledby="routeSelection">
                    {
                        this.state.routeCalculationResult.routes.map(function oneRoute (route, routeIndex) {
                            const label = "Route " + (routeIndex + 1);
                            return (<li key={label} onClick={this.showRoute.bind(this, routeIndex)}>{label}</li>);
                        }, this)
                    }
                </ul>
            </div>
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
                    this.renderRouteLegs()
                }
                <div className="row">
                    <div className="col-xs-4">
                        <span className="badge">TOT</span>
                    </div>
                    <div className="col-xs-4">
                        <i className="fa fa-car" aria-hidden="true" /> {distance} km
                    </div>
                    <div className="col-xs-4">
                        <i className="fa fa-clock-o" aria-hidden="true" /> {duration} min
                    </div>
                 </div>
        </div>
        );
        return routeInfo;
    }

    renderRouteLegs () {
        if (this.state.routeInfo.legs.length < 2) {
            return null;
        }

        return this.state.routeInfo.legs.map(function oneLeg (leg, index) {
            const key = "route" + index;
            return (
                <div key={key} className="row">
                    <div className="col-xs-4">
                        <span className="badge">{index + 1}</span>
                    </div>
                    <div className="col-xs-4">
                        <i className="fa fa-car" aria-hidden="true"/> {leg.distance.text}
                    </div>
                    <div className="col-xs-4">
                        <i className="fa fa-clock-o" aria-hidden="true" /> {leg.duration.text}
                    </div>
                </div>
            );
        });
    }

    render () {
        return (
            <span>
                <div className="row hcenter">
                    <div className="col-xs-2">
                        Route { isNaN(this.state.selectedRoute) ? '' : this.state.selectedRoute + 1 }
                    </div>
                    <div className="col-xs-2">
                        {this.renderRouteSelection()}
                    </div>
                     <div className="col-xs-4">
                        <h4><span className="label label-primary">KAART</span></h4>
                    </div>
                     <div className="col-xs-4">
                        <Link to="/settings"><i className="fa fa-cog fa-2x" aria-hidden="true" /></Link>
                    </div>
                </div>
                <div ref="mapCanvas" className="content" />
                <div className="clear"/>
                {this.renderRouteInfo()}
            </span>
        );
    }
}

export default App;
