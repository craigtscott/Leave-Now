import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Navigator,
  TouchableHighlight,
  ListView
} from 'react-native';

import IndexRow from './indexRow';

const flights = [{
    city: 'Milan',
    country: 'Italy',
    price: '$700'
  },
  {
    city: 'Amsterdam',
    country: 'Netherlands',
    price: '$550'
  },
  {
    city: 'London',
    country: 'England',
    price: '$500'
  }
];

class FlightIndex extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      quotes: "",
      places: "",
      indexFlightInfo: "",
      flightsDataSource: ds.cloneWithRows(flights)
    };
  }

  componentWillMount() {
    this.props.fetchFlights();
  }

  componentWillReceiveProps(nextProps) {
    this.state.quotes = nextProps.flightIndex.Quotes;
    this.state.places = nextProps.flightIndex.Places;
    this.parseIndexDetails();
  }

  parseIndexDetails() {
    let info = [];
    let origin;
    let destination;

    function findOrigin(place) {
      return place.PlaceId === origin;
    }

    function findDestination(place) {
      return place.PlaceId === destination;
    }

    for (let i = 0; i < this.state.quotes.length; i++) {
      if (this.state.quotes && this.state.places) {
        origin = this.state.quotes[i].InboundLeg.DestinationId;
        destination = this.state.quotes[i].OutboundLeg.DestinationId;
        let departDate = this.state.quotes[i].OutboundLeg.DepartureDate;
        let minPrice = this.state.quotes[i].MinPrice;
        info.push({
          "Departure City": this.state.places.find(findOrigin).CityName,
          "Departure Country": this.state.places.find(findOrigin).CountryName,
          "Arrival City": this.state.places.find(findDestination).CityName,
          "Arrival Country": this.state.places.find(findDestination).CountryName,
          "Departure Date": departDate,
          "Price": minPrice
        });
      }
    }

    this.state.indexFlightInfo = info;
  }

  _navigate(){
    this.props.navigator.push({
      name: 'FlightDetail'
    });
  }

  _renderFlightRow(flight) {
    return (
      <TouchableHighlight onPress={ () => this._navigate() }>
        <View style={styles.flightRow}>
          <Text style={styles.place}>{flight.city}, {flight.country}</Text>
          <Text style={styles.price}>{flight.price}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    // console.log(this.state.indexFlightInfo);

    return (
      <View style={styles.container}>

        <ListView
          style={{marginTop: 40}}
          dataSource={this.state.flightsDataSource}
          renderRow={(flight) => { return this._renderFlightRow(flight) ;}}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    borderWidth: 1,
    backgroundColor: '#9ad3de'
  },
  flightRow: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc'
  },
  place: {
    // color: 'slategray'
    paddingRight: 100
  },
  price: {
    color: 'gray'
  }

});

export default FlightIndex;
