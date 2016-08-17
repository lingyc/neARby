import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableHighlight,
  Switch,
  Slider,
  Text,
} from 'react-native';
import { LoginButton, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import Drawer from 'react-native-drawer';
import ARview from './ARview';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/index';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderValue: 1,
      sampleSwitch: false,
      username: '',
      drawerItem: 'Search',
<<<<<<< f9ba151a6fa7df9b41663c9ae3c771507cb66632
=======
      deltaX: 0,
      deltaZ: 0,
      totalAPICalls: 0,
      intializing: true,
      places: [],
>>>>>>> fix/meeerrrrgeeee connnffflliiicttts
      businessEvent: false,
      familyEvent: false,
      comedyEvent: false,
      festivalEvent: false,
      sportsEvent: false,
      musicEvent: false,
      socialEvent: false,
      filmEvent: false,
      artEvent: false,
      sciTechEvent: false,
      eventDays: 1,
      eventSearch: '',
      foodPlace: false,
      hotelPlace: false,
      cafesPlace: false,
      nightlifePlace: false,
      shoppingPlace: false,
      publicTransitPlace: false,
      bankPlace: false,
      gasStationPlace: false,
      parkingPlace: false,
      parkPlace: false,
<<<<<<< f9ba151a6fa7df9b41663c9ae3c771507cb66632
      placeSearch: '',
      placesEvents: []
=======
      placeSearch: ''
>>>>>>> fix/meeerrrrgeeee connnffflliiicttts
    };
  }

  componentWillMount() {
    console.log(Object.keys(Actions));
    const infoRequest = new GraphRequest(
      '/me?fields=name,picture',
      null,
      this.getUserInfo.bind(this)
    );
    // Start the graph request.
    new GraphRequestManager().addRequest(infoRequest).start();
  }

  componentDidMount() {
    this.props.action.drawerState('Places');
    // console.log(this.props.places, ' PLACES');
  }

  getUserInfo(err, data) {
    if (err) {
      console.log('ERR ', err);
    } else {
      this.setState({username: data.name,
        picture: data.picture.data.url});
      console.log('DATA - ', data.name + ' ' + data.picture.data.url);
    }
  }

  closeControlPanel = () => {
    this._drawer.close();
  }

  openControlPanel = () => {
    this._drawer.open();
  }

  handleSignout = () => {
    this.props.navigator.resetTo({name: 'Login'});
  }

  placeSearch = () => {
    let placeQuery = {
      food: this.state.foodPlace,
      hotel: this.state.hotelPlace,
      cafes: this.state.cafesPlace,
      nightlife: this.state.nightlifePlace,
      shopping: this.state.shoppingPlace,
      publicTransit: this.state.publicTransitPlace,
      bank: this.state.bankPlace,
      gasStation: this.state.gasStationPlace,
      parking: this.state.parkingPlace,
      park: this.state.parkPlace,
      placeSearch: this.state.placeSearch,
      latitude: 37.78375460769774,
      longitude: -122.4091061298944,
      threejsLat: 0,
      threejsLon: 0,
    };
  fetch('http://10.6.23.239:3000/places', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(placeQuery)
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    this.setState({
      placesEvents: data
    });
  }.bind(this));
  // .catch(function(error) {
  //   console.error(error);
  // });
  console.log(this.state.placesEvents);
    this._drawer.close();
    this.setState({
      foodPlace: false,
      hotelPlace: false,
      cafesPlace: false,
      nightlifePlace: false,
      shoppingPlace: false,
      publicTransitPlace: false,
      bankPlace: false,
      gasStationPlace: false,
      parkingPlace: false,
      parkPlace: false,
      placeSearchPlace: '',
      drawerItem: 'Search'
    });
  }

  getLocation = (obj) => {
    this.setState({
      latitude: obj.latitude,
      longitude: obj.longitude,
      threeLat: obj.threeLat,
      threeLon: obj.threeLon
    });
  }

  getInitialLocation = (obj) => {
    this.setState({
      latitude: obj.latitude,
      longitude: obj.longitude,
      threeLan: obj.threeLat,
      threeLon: obj.threeLon
    });
    // need to go and fetch the data from the server and set the places state
  }


  eventSearch = () => {
    console.log('calling eventsearch');
    let eventQuery = {
      business: this.state.businessEvent,
      family: this.state.familyEvent,
      comedy: this.state.comedyEvent,
      festival: this.state.festivalEvent,
      sports: this.state.sportsEvent,
      music: this.state.musicEvent,
      social: this.state.socialEvent,
      film: this.state.filmEvent,
      art: this.state.artEvent,
      sciTech: this.state.sciTechEvent,
      eventDays: this.state.sliderValue,
      eventSearch: this.state.eventSearch,
      latitude: 37.78375460769774,
      longitude: -122.4091061298944,
      threejsLat: 0,
      threejsLon: 0
    };
    console.log(eventQuery, 'QUERY');
  fetch('http://10.6.23.239:3000/events', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventQuery)
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    this.setState({
      placesEvents: data
    });
  }.bind(this));
  // .catch(function(error) {
  //   console.error(error);
  // });
    this._drawer.close();
    this.setState({
      businessEvent: false,
      familyEvent: false,
      comedyEvent: false,
      festivalEvent: false,
      sportsEvent: false,
      musicEvent: false,
      socialEvent: false,
      filmEvent: false,
      artEvent: false,
      sciTechEvent: false,
      eventDays: 1,
      eventSearch: ''
    });
  }

  placeSearch = () => {
    let placeQuery = {
      food: this.state.foodPlace,
      hotel: this.state.hotelPlace,
      cafes: this.state.cafesPlace,
      nightlife: this.state.nightlifePlace,
      shopping: this.state.shoppingPlace,
      publicTransit: this.state.publicTransitPlace,
      bank: this.state.bankPlace,
      gasStation: this.state.gasStationPlace,
      parking: this.state.parkingPlace,
      park: this.state.parkPlace,
      placeSearch: this.state.placeSearch
    };
  fetch('https://agile-peak-45133.herokuapp.com/places', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(placeQuery)
  })
  .then(function(response) {
    if (response.status === 200) {
      console.log(response);
      return response.json();
    } else  {
      console.log('error');
    }
  })
  .catch(function(error) {
    console.error(error);
  });
    this._drawer.close();
    this.setState({
      foodPlace: false,
      hotelPlace: false,
      cafesPlace: false,
      nightlifePlace: false,
      shoppingPlace: false,
      publicTransitPlace: false,
      bankPlace: false,
      gasStationPlace: false,
      parkingPlace: false,
      parkPlace: false,
      placeSearchPlace: '',
      drawerItem: 'Search'
    });
  }

  eventSearch = () => {
    console.log('calling eventsearch');
    let eventQuery = {
      business: this.state.businessEvent,
      family: this.state.familyEvent,
      comedy: this.state.comedyEvent,
      festival: this.state.festivalEvent,
      sports: this.state.sportsEvent,
      music: this.state.musicEvent,
      social: this.state.socialEvent,
      film: this.state.filmEvent,
      art: this.state.artEvent,
      sciTech: this.state.sciTechEvent,
      eventDays: this.state.eventDays,
      eventSearch: this.state.eventSearch
    };
    console.log(eventQuery, 'QUERY');
  fetch('https://agile-peak-45133.herokuapp.com/events', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventQuery)
  })
  .then(function(response) {
    if (response.status === 200) {
      console.log(response);
      return response.json();
    } else  {
      console.log('error');
    }
  })
  .catch(function(error) {
    console.error(error);
  });
    this._drawer.close();
    this.setState({
      businessEvent: false,
      familyEvent: false,
      comedyEvent: false,
      festivalEvent: false,
      sportsEvent: false,
      musicEvent: false,
      socialEvent: false,
      filmEvent: false,
      artEvent: false,
      sciTechEvent: false,
      eventDays: 1,
      eventSearch: ''
    });
  }

  handleDrawer = (e) => {
    e.preventDefault();
    this.props.action.drawerState('Places');
  }

  createSwitch = (event, text) => {
    return <View style={styles.switch}>
      <Switch
          onTintColor="#009D9D"
          onValueChange={(value) => this.setState({[event]: value})}
          value={this.state[event]} />
      <Text style={styles.switchText}>{text}</Text>
    </View>;
  }

  renderSliderValue = () => {
    // if slidervalue is one return today
    const weekdays = {
      0: 'Sunday',
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday',
      7: 'Sunday',
      8: 'Monday',
      9: 'Tuesday',
      10: 'Wednesday',
      11: 'Thursday',
      12: 'Friday',
      13: 'Saturday'
    };
    let d = new Date();
    let dayOfWeek = d.getDay();

    if (this.state.sliderValue === 1) {
      return 'today';
    } else {
      return 'between today and ' + weekdays[dayOfWeek + this.state.sliderValue - 1];
    }
  }

  render() {
    let drawerItems;
    if (this.state.drawerItem === 'Search') {
        drawerItems = <View style={styles.panel}>
        <Text style={styles.heading}>search</Text>
        <View style={{alignItems: 'center'}}>
          <TouchableHighlight style={styles.placeOrEventButton} onPress={() => { this.setState({drawerItem: 'Places'}); }}>
            <Text style={styles.buttonText}>places</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.placeOrEventButton} onPress={() => { this.setState({drawerItem: 'Events'}); }}>
            <Text style={styles.buttonText}>events</Text>
          </TouchableHighlight>
          </View>
        </View>;
    } else if (this.state.drawerItem === 'Events') {
      drawerItems = <View style={styles.panel}>
      <Text style={styles.heading}>events</Text>
        <TextInput style={styles.textInput} onChangeText={(text) => this.setState({eventSearch: text})} value={this.state.eventSearch} placeholder="Search Events" />
        <Text style={styles.subheading}>I want events happening ...</Text>
        <Text style={styles.text}>{this.renderSliderValue()}</Text>
        <Slider
          {...this.props}
          onValueChange={(value) => this.setState({sliderValue: value})}
          minimumValue={1}
          maximumValue={7}
          step={1} />
        <Text style={styles.subheading}>Event Type</Text>
      <View style={styles.switchTable}>
        <View style={styles.switchColumn}>
          {this.createSwitch('businessEvent', 'Business')}
          {this.createSwitch('familyEvent', 'Family')}
          {this.createSwitch('comedyEvent', 'Comedy')}
          {this.createSwitch('festivalEvent', 'Festivals')}
          {this.createSwitch('sportsEvent', 'Sports')}
        </View>
        <View style={styles.switchColumn}>
          {this.createSwitch('musicEvent', 'Music')}
          {this.createSwitch('socialEvent', 'Social')}
          {this.createSwitch('filmEvent', 'Film')}
          {this.createSwitch('artEvent', 'Art')}
          {this.createSwitch('sciTechEvent', 'Sci/Tech')}
        </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableHighlight style={styles.placeOrEventButton} onPress={() => { this.setState({drawerItem: 'Search'}); }}>
            <Text style={styles.buttonText}>go back</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.placeOrEventButton} onPress={() => { this.eventSearch(); }}>
            <Text style={styles.buttonText}>submit</Text>
          </TouchableHighlight>
        </View>
        </View>;
    } else if (this.state.drawerItem === 'List') {
      var content = this.state.placesEvents.map(function(item, key) {
        return (
            <Text key={key}>{item.name}</Text>
        );
      });
      drawerItems = <View style={styles.panel}>
        <Text style={styles.heading}>Places</Text>
            {content}
        <TouchableHighlight style={styles.placeOrEventButton}>
            <Text style={styles.buttonText}>More</Text>
          </TouchableHighlight>
        </View>;
    } else if (this.state.drawerItem === 'Places') {
        drawerItems = <View style={styles.panel}>
      <Text style={styles.heading}>places</Text>
        <TextInput style={styles.textInput}  onChangeText={(text) => this.setState({placeSearch: text})} value={this.state.placeSearch} placeholder="Search Places" />
        <Text style={styles.subheading}>Place Type</Text>
      <View style={styles.switchTable}>
        <View style={styles.switchColumn}>
          {this.createSwitch('foodPlace', 'Food')}
          {this.createSwitch('hotelPlace', 'Hotels')}
          {this.createSwitch('cafesPlace', 'Cafes')}
          {this.createSwitch('nightlifePlace', 'Nightlife')}
          {this.createSwitch('shoppingPlace', 'Shopping')}
        </View>
        <View style={styles.switchColumn}>
          {this.createSwitch('publicTransit', 'Public Transit')}
          {this.createSwitch('bankPlace', 'Bank/ATM')}
          {this.createSwitch('gasStationPlace', 'Gas Stations')}
          {this.createSwitch('parkingPlace', 'Parking')}
          {this.createSwitch('parkPlace', 'Parks')}
        </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableHighlight style={styles.placeOrEventButton} onPress={() => { this.setState({drawerItem: 'Search'}); }}>
            <Text style={styles.buttonText}>go back</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.placeOrEventButton} onPress={() => { this.placeSearch(); }}>
            <Text style={styles.buttonText}>submit</Text>
          </TouchableHighlight>
        </View>
        </View>;
    } else {
      drawerItems = <View style={styles.panel}>
      <Text style={styles.heading}>under constrooction
             <LoginButton
          publishPermissions={['publish_actions']}
          onLogoutFinished={this.handleSignout.bind(this)}/></Text>

      </View>;
    }

    return (
      <Drawer
        type="overlay"
        side="right"
        ref={(ref) => {this._drawer = ref;}}
        content={drawerItems}
        panOpenMask={0.5}
        panCloseMask={0.2}
        tweenHandler={(ratio) => ({main: { opacity:(3 - ratio) / 3 }})}>
        <ARview
          pressProfile={() => {this.setState({drawerItem: 'Profile'}); this._drawer.open();}}
          pressSearch={() => {this.setState({drawerItem: 'Search'}); this._drawer.open();}}
          pressList={() => {this.setState({drawerItem: 'List'}); this._drawer.open();}}
          // mainViewGeoLocation={this.getInitialLocation.bind()}
          // mainViewSetLocation={this.getLocation.bind()}
          placesEvents={this.state.placesEvents}
        />
       </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)'
  },
  preview: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  menu: {
    padding: 10
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderColor: '#FFF',
    borderWidth: 2,
    borderRadius: 30,
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#FFF',
    fontSize: 25,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center'
  },
  drawerStyles: {
      flex: 1,
      // justifyContent: 'space-between',
      // alignItems: 'center',
      shadowRadius: 3,
      backgroundColor: 'rgba(0,0,0,.5)'

  },
  panel: {
    backgroundColor: 'rgba(255,255,255,.9)',
    justifyContent: 'center',
    margin: 20,
    padding: 20,
    flex: 1
  },
  subheading: {
    fontSize: 18,
    fontFamily: 'AvenirNext-Medium',
    textAlign: 'center',
    padding: 15
  },
  heading: {
    fontSize: 50,
    fontFamily: 'AvenirNext-Medium',
    textAlign: 'center',
    padding: 10,
    paddingBottom: 15
  },
  image: {
    flex: 1
  },
  search: {
    height: 25,
    width: 25
  },
  placeOrEventButton: {
    backgroundColor: '#009D9D',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    borderColor: '#000',
    height: 60,
    width: 150,
    margin: 10
  },
  text: {
    fontSize: 18,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    padding: 5
  },
  switch: {
    flex: 1,
    flexDirection: 'row',
  },
  switchText: {
    fontSize: 16,
    fontFamily: 'AvenirNext-Regular',
    marginLeft: 5,
    marginTop: 5
  },
  switchColumn: {
    flex: 1,
    flexDirection: 'column'
  },
  switchTable: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5
  },
  textInput: {
    fontSize: 16,
    fontFamily: 'AvenirNext-Regular',
    backgroundColor: '#FFF',
    height: 40,
    padding: 8,
    color: '#000',
    marginBottom: 20
  },
  compass: {
    width: 150,
    height: 150,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  }
});


const mapStateToProps = function(state) {
  console.log('map state to props is called, this is state: ', state);
  return {
    places: state.places,
    // user: state.user
    drawer: state.drawer.option
  };
};

const mapDispatchToProps = function(dispatch) {
  console.log('map dispatch to props is called');
  return { action: bindActionCreators(Actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
