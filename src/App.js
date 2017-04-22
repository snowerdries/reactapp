/*global google*/
import React, { Component } from 'react';
import './App.css';
import AppBar from 'material-ui/AppBar';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

class App extends Component {

    componentDidMount () {
        this.home = new google.maps.LatLng(51.139116, 4.542925);
        this.work = new google.maps.LatLng(51.147526, 4.436579);
        this.map = this.createMap();
        this.addTrafficLayer();
        this.addMarkers();
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

    render () {
        const mapStyle = {
            width: '100%',
            height: '80vh'
        };
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <div>
                    <AppBar title="Kaart" />
                    <div ref="mapCanvas" style={mapStyle} />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
