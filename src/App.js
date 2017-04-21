/*global google*/
import React, { Component } from 'react';
import './App.css';
import AppBar from 'material-ui/AppBar';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

class App extends Component {

    componentDidMount () {
        this.map = this.createMap();
    }

    createMap () {
        var antwerp = { lat: 51.2167, lng: 4.4167 };
        const mapOptions = {
            zoom: 10,
            center: antwerp
        };
        return new google.maps.Map(this.refs.mapCanvas, mapOptions);
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
