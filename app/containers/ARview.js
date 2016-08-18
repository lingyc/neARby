import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Image,
  Text,
  DeviceEventEmitter //DeviceEventEmitter is imported for geolocation update
} from 'react-native';

import styles from '../styles/style';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/index';
import Camera from 'react-native-camera';
import WebViewBridge from 'react-native-webview-bridge';
import { RNLocation as Location } from 'NativeModules';
import { calculateDistance } from '../lib/calculateDistance';
import html from '../webview/html';

//this script will be injectScripted into WebViewBridge to communicate
import { injectScript } from '../webview/webviewBridgeScript';
import Compass from '../components/Compass';

//webviewbrige variables
var testHeading = 0;
var sendNewHeading = false;

//deltaX is change in latidue, north (+), south (-)
//deltaZ is change im latidue, east(+), west (-)
class ARview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentHeading: null
    };
  }

  componentWillReceiveProps(nextProps) {
    //listen to changes in search places;
    if (this.sendPlacesToWebView && nextProps.places) {
      this.sendPlacesToWebView(nextProps.places);
    }
  }

  componentWillUnmount() {
    //this will stop the location update
    Location.stopUpdatingLocation();
    Location.stopUpdatingHeading();
  }

  startDeviceLocationUpdate() {
    Location.requestWhenInUseAuthorization();
    Location.setDesiredAccuracy(1);
    Location.setDistanceFilter(1);
  }

  sendOrientation(callback, intialize) {
    //heading is the orientation of device relative to true north
    Location.startUpdatingHeading();
    this.getHeading = DeviceEventEmitter.addListener(
      'headingUpdated',
      (data) => {

        // this.props.action.updateHeading(data.heading);
        this.setState({currentHeading: data.heading});
        callback(data.heading);
      }
    );
  }

  //initGeolocation gets the initial geolocation and set it to initialPosition state
  initGeolocation(initialCameraAngleCallback, sendInitLocToMainView) {
    Location.startUpdatingLocation();
    //this will listen to geolocation changes and update it in state
    this.getInitialLocation = DeviceEventEmitter.addListener(
      'locationUpdated',
      (location) => {
        console.log('initGeolocation', location.coords);

        this.props.action.updateInitLocation(location.coords);
      }
    );

    //wait 7 seconds to get a more accurate location reading, remove getInitialLocation listner after that
    setTimeout(() => {
      this.getInitialLocation.remove();

      //initial call to server to set initialPosition to 0,0
      let positionObj = {
        latitude: this.props.initialPosition.latitude,
        longitude: this.props.initialPosition.longitude,
        threejsLat: 0,
        threejsLon: 0
      };
      this.props.action.fetchPlaces(positionObj);

      if (sendInitLocToMainView) {
        sendInitLocToMainView(sendInitLocToMainView);
      }

      initialCameraAngleCallback();
    }, 2000);
  }

  //watchGeolocation will subsequenly track the geolocation changes and update it in lastPosition state
  watchGeolocation(cameraCallback, placesCallback, sendLocToMainView) {
    Location.startUpdatingLocation();
    //this will listen to geolocation changes and update it in state
    DeviceEventEmitter.addListener(
      'locationUpdated',
      (location) => {
        let threeJSPosition = calculateDistance(this.props.initialPosition, location.coords);
        console.log('threeJSPosition', threeJSPosition);
        this.props.action.updateCurrentLocation({
          currentPosition: location.coords,
          threeLat: threeJSPosition.deltaX,
          threeLon: threeJSPosition.deltaZ,
          distance: threeJSPosition.distance
        });

        if (!this.props.lastAPICallPosition || placesCallback) {
          let distanceFromLastAPICallPosition = 0;
          if (this.props.lastAPICallPosition) {
            distanceFromLastAPICallPosition = calculateDistance(this.props.lastAPICallPosition, location.coords);
            // this.setState({distanceFromLastAPICallString: distanceFromLastAPICallPosition.distance.toString()});
          }

          if (!this.props.lastAPICallPosition || distanceFromLastAPICallPosition.distance > 20) {
            //update the lastAPICallPosition to current position
            this.props.action.updateLastAPICallLocation({
              lastAPICallPositionString: JSON.stringify(location),
              lastAPICallPosition: location.coords,
              totalAPICalls: this.props.totalAPICalls += 1
            });

            console.log('range reached');
            placesCallback(location.coords.latitude, location.coords.longitude, threeJSPosition.deltaX, threeJSPosition.deltaZ);
          }
        }

        if (cameraCallback) {
          cameraCallback(threeJSPosition);
        }
      }
    );
  }

  //onBridgeMessage will be pass down to WebViewBridge to allow the native componenent to communicate to the webview;
  onBridgeMessage(message) {
    const { webviewbridge } = this.refs;

    //////////////////////////
    //react buttons handlers
    //////////////////////////
    this.addCubeToLocation = (location) => {
      let cubeLocation = calculateDistance(this.props.initialPosition, location);
      cubeLocation.type = 'addTestCube';
      webviewbridge.sendToBridge(JSON.stringify(cubeLocation));
    };

    ///////////////////////////////////////////////
    //test buttons handlers, for dev purpose only
    ///////////////////////////////////////////////
    //for dev purpose only, resets threejs camera back to 0,0
    this.setHeading = (heading) => {
      webviewbridge.sendToBridge(JSON.stringify({type: 'currentHeading', heading: heading}));
    };

    //this is fired when direction buttons are click
    this.controlThreeJSCamera = (x, z) => {
      webviewbridge.sendToBridge(JSON.stringify({type: 'cameraPosition', deltaX: this.props.threeLat + x, deltaZ: this.props.threeLon + z}));
      this.props.action.updateCurrentLocation({
        currentPosition: this.props.currentPosition,
        threeLat: this.props.threeLat + x,
        threeLon: this.props.threeLon + z
      });
    };

    //////////////////////////////////////
    //webviewBridge communication helpers
    //////////////////////////////////////
    this.setInitialCameraAngle = () => {
      this.sendOrientation(
        (initialHeading) => {
          console.log('initialHeading', initialHeading);
          webviewbridge.sendToBridge(JSON.stringify({type: 'initialHeading', heading: initialHeading}));
          this.getHeading.remove();
        }, true
      );
    };

    //this will sent current heading to threejs to correct
    this.calibrateCameraAngle = (heading) => {
      // console.log('calibrate ThreeJSCamera');
      if (sendNewHeading) {
        webviewbridge.sendToBridge(JSON.stringify({type: 'currentHeading', heading: heading}));
        sendNewHeading = false;
      }
    };

    this.updateThreeJSCameraPosition = (newCameraPosition) => {
      webviewbridge.sendToBridge(JSON.stringify(newCameraPosition));
    };

    this.sendPlacesToWebView = (places) => {
      let placesMsg = {type: 'places', places: places};
      console.log('sending places to webview', places);
      webviewbridge.sendToBridge(JSON.stringify(placesMsg));
    };

    this.updatePlaces = (latitude, longitude, threejsLat, threejsLon) => {
      //call fetchplaces to fetch places from server
      let positionObj = {
        latitude: latitude,
        longitude: longitude,
        threejsLat: threejsLat || 0,
        threejsLon: threejsLon || 0
        //more filters
      };

      this.props.action.fetchPlaces(positionObj)
      .then((results) => {
        this.sendPlacesToWebView(results.payload);
      })
      .catch((err) => {
        console.log(err);
      });
    };

    message = JSON.parse(message);
    //webview will send 'webview is loaded' back when the injectedScript is loaded
    if (message === 'webview is loaded') {
      this.startDeviceLocationUpdate();
      //once bridge injectedScript is loaded, set 0,0, and send over heading to orient threejs camera
      this.initGeolocation(this.setInitialCameraAngle, this.props.mainViewGeoLocation);
    } else if (message === 'heading received') {
      // console.log('heading received');
      //at this point, the app is finish loading
      this.props.action.finishLoadingPosition(false);
      //if distance exceed a certain treashold, updatePlaces will be called to fetch new locations
      this.watchGeolocation(this.updateThreeJSCameraPosition, this.updatePlaces, this.props.mainViewSetLocation);
      //calibrate threejs camera according to north every 5 seconds
      setInterval(() => { sendNewHeading = true; }, 5000);
      this.sendOrientation(this.calibrateCameraAngle);
    } else if (message === 'clicked') {
      //sending obj back to activate another view
      // this.props.threejsOnClick(message.place);
    } else {
      console.log(message);
    }

  }


  renderDebug() {
    return (
      <View>
        <Text>
          <Text style={styles.title}>Current position: </Text>
          {this.props.currentPositionString}
        </Text>
        <TouchableHighlight onPress={() => { this.addCubeToLocation({latitude: this.props.currentPosition.latitude, longitude: this.props.currentPosition.longitude})} }>
          <Text>add cube here</Text>
        </TouchableHighlight>
        <Text>
          <Text style={styles.title}>Current heading: </Text>
          {this.state.currentHeading}
        </Text>
        <Text>
          <Text style={styles.title}>threeLat from 0,0: </Text>
          {this.props.threeLat}
        </Text>
        <Text>
          <Text style={styles.title}>threeLon from 0,0: </Text>
          {this.props.threeLon}
        </Text>
        <Text>
          <Text style={styles.title}>Distance from last API call: </Text>
          {this.props.distanceFromLastAPICallString}
        </Text>
        <Text>
          <Text style={styles.title}>Total API calls: </Text>
          {this.props.totalAPICalls}
        </Text>
        <TouchableHighlight onPress={() => {this.controlThreeJSCamera(0.2, 0)} }>
          <Text>go front</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => {this.controlThreeJSCamera(-.2, 0)} }>
          <Text>go back</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => {this.controlThreeJSCamera(0, -.2)} }>
          <Text>go left</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => {this.controlThreeJSCamera(0, .2)} }>
          <Text>go right</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => {testHeading += 1; this.setHeading(testHeading)}}>
          <Text>add heading</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => {testHeading -= 1; this.setHeading(testHeading)}}>
          <Text>reduce heading</Text>
        </TouchableHighlight>
      </View>
    );
  }

  renderButtons() {
    return (
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start'}}>
        <TouchableHighlight style={styles.menu} onPress={this.props.pressSearch}>
          <View style={styles.button}>
            <Image style={styles.search} source={require('../assets/search.png')}/>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.menu} onPress={this.props.pressProfile}>
          <View style={styles.button}>
            <Image style={styles.userimg} source={{uri: this.props.user.picture}}/>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.menu} onPress={this.props.pressList}>
          <View style={styles.button}>
            <Image style={styles.search} source={require('../assets/link.png')}/>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.menu} onPress={this.props.pressCreate}>
          <View style={styles.button}>
            <Image style={styles.search} source={require('../assets/place.png')}/>
          </View>
        </TouchableHighlight>
        <Compass style={styles.compass} rotation={this.state.currentHeading} places={this.props.places.slice(0,10)} currentLocation={{threeLat: this.props.threeLat, threeLon: this.props.threeLon}}/>
      </View>
    );
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Camera
          ref={(cam) => {
          this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>
          <WebViewBridge
            ref="webviewbridge"
            onBridgeMessage={this.onBridgeMessage.bind(this)}
            injectedJavaScript={injectScript}
            source={{html}}
            style={{backgroundColor: 'transparent', flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
            {this.renderButtons()}
          </WebViewBridge>
        </Camera>
        {/* this.renderDebug() */}
      </View>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'rgba(255,255,255,1)'
//   },
//   preview: {
//     flex: 1,
//     alignItems: 'flex-end',
//     justifyContent: 'flex-end'
//   },
//   menu: {
//     padding: 10
//   },
//   button: {
//     backgroundColor: 'rgba(0,0,0,0)',
//     borderColor: '#FFF',
//     borderWidth: 2,
//     borderRadius: 30,
//     height: 60,
//     width: 60,
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   search: {
//     height: 25,
//     width: 25
//   },
//   userimg: {
//     height: 57,
//     width: 57,
//     borderRadius: 30
//   },
//   compass: {
//     width: 150,
//     height: 150,
//     justifyContent: 'flex-end',
//     left: 150,
//   }
// });

const mapStateToProps = function(state) {
  return {
    places: state.places,
    drawer: state.drawer,
    user: state.user,
    LastAPICallPosition: state.Geolocation.lastAPICallPosition,
    totalAPICalls: state.Geolocation.totalAPICalls,
    initialPosition: state.Geolocation.initialPosition,
    currentPosition: state.Geolocation.currentPosition,
    threeLat: state.Geolocation.threeLat,
    threeLon: state.Geolocation.threeLon,
    // currentHeading: state.Geolocation.currentHeading
  };
};

const mapDispatchToProps = function(dispatch) {
  return { action: bindActionCreators(Actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(ARview);
