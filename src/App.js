import React, { Component } from "react";
import axios from "axios";
import "./App.css";

import Pagination from "./components/Pagination";
import RestaurantCard from "./components/RestaurantCard";
import ReactSearchBox from "react-search-box";

class App extends Component {
  state = {
    allRestaurants: [],
    currentRestaurants: [],
    currentPage: null,
    totalPages: null,
    totalEntries: 0,
    pageLimit: 15,
    searchQuery: null,
    cityList: []
  };

  componentDidMount() {
    axios
      .get(
        `http://opentable.herokuapp.com/api/restaurants?country=CA&per_page=15&page=1`
      )
      .then(response => {
        const allRestaurants = response.data.restaurants;
        const currentPage = response.data.current_page;
        const totalPages = Math.ceil(response.data.total_entries / 15);
        const totalEntries = response.data.total_entries;
        this.setState({
          currentPage,
          allRestaurants,
          totalPages,
          totalEntries
        });
      });

    axios.get(`./ca.json`).then(response => {
      const cityList = [];
      for (let i = 0; i < response.data.length; i++) {
        var cityArray = [];
        cityArray["key"] = cityArray["value"] = this.replaceDiacritics(
          response.data[i].city
        );
        cityList.push(cityArray);
      }

      this.setState({ cityList });
    });
  }
  replaceDiacritics(str) {
    var diacritics = [
      { char: "A", base: /[\300-\306]/g },
      { char: "a", base: /[\340-\346]/g },
      { char: "E", base: /[\310-\313]/g },
      { char: "e", base: /[\350-\353]/g },
      { char: "I", base: /[\314-\317]/g },
      { char: "i", base: /[\354-\357]/g },
      { char: "O", base: /[\322-\330]/g },
      { char: "o", base: /[\362-\370]/g },
      { char: "U", base: /[\331-\334]/g },
      { char: "u", base: /[\371-\374]/g },
      { char: "N", base: /[\321]/g },
      { char: "n", base: /[\361]/g },
      { char: "C", base: /[\307]/g },
      { char: "c", base: /[\347]/g }
    ];

    diacritics.forEach(function(letter) {
      str = str.replace(letter.base, letter.char);
    });

    return str;
  }

  onPageChanged = data => {
    const { currentPage, totalPages, pageLimit, totalEntries } = data;
    const searchQuery = this.state.searchQuery;
    var url = `http://opentable.herokuapp.com/api/restaurants?country=CA&per_page=${pageLimit}&page=${currentPage}`;
    if (searchQuery != null) {
      url += `&city=${searchQuery}`;
    }
    axios.get(url).then(response => {
      const currentRestaurants = response.data.restaurants;
      const totalEntries = response.data.total_entries;
      this.setState({
        currentPage,
        currentRestaurants,
        totalPages,
        totalEntries
      });
    });
  };

  onSearchPerformed = data => {
    const { currentPage, totalPages, pageLimit, totalEntries } = this.state;
    const searchQuery = data.value;
    axios
      .get(
        `http://opentable.herokuapp.com/api/restaurants?country=CA&per_page=${pageLimit}&page=${currentPage}&city=${searchQuery}`
      )
      .then(response => {
        const currentRestaurants = response.data.restaurants;
        const currentPage = response.data.current_page;
        const totalPages = Math.ceil(response.data.total_entries / 15);
        const totalEntries = response.data.total_entries;

        this.setState({
          currentPage,
          currentRestaurants,
          totalPages,
          totalEntries,
          searchQuery
        });
      });
  };
  render() {
    const {
      allRestaurants,
      currentRestaurants,
      currentPage,
      totalPages,
      totalEntries,
      cityList,
      searchQuery
    } = this.state;
    const totalRestaurants = totalEntries;
    if (totalRestaurants === 0) return null;

    const headerClass = [
      "text-dark py-2 pr-4 m-0",
      currentPage ? "border-gray border-right" : ""
    ]
      .join(" ")
      .trim();
    return (
      <div className="container-fluid">
        <div className="row text-dark py-2 pr-4 pl-4 bg-light">
          <h1>Welcome to Restaurant Search Engine</h1>
        </div>
        <div className="row d-flex flex-row py-5">
          <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between">
            <div className="d-flex flex-row align-items-center col-xs-12 col-xs-12 col-md-4">
              <h2 className={headerClass}>
                <strong className="text-secondary">{totalRestaurants}</strong>{" "}
                Restaurants
              </h2>

              {currentPage && (
                <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                  Page <span className="font-weight-bold">{currentPage}</span> /{" "}
                  <span className="font-weight-bold">{totalPages}</span>
                </span>
              )}
            </div>
            <div className="col-xs-12 col-xs-12 col-md-4">
              <ReactSearchBox
                placeholder="Enter City..."
                value=""
                inputBoxHeight="46px"
                data={cityList}
                callback={record => console.log(record)}
                onSelect={this.onSearchPerformed}
              />
            </div>

            <div className="d-flex flex-row py-4 align-items-center col-xs-12 col-xs-12 col-md-4">
              <Pagination
                totalRecords={totalRestaurants}
                pageLimit={15}
                pageNeighbours={1}
                onPageChanged={this.onPageChanged}
              />
            </div>
          </div>

          {currentRestaurants.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>
    );
  }
}

export default App;
