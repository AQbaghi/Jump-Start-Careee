import React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import jumpStartCareerSVG from '../../images/jump-start-career-2.svg';
import './SearchDashbaurd.css';
import { Link } from 'react-router-dom';

//loaded is a variable to chech if the page loaded the job post data, if not the function will not be called again

let searchObj = null;
let key = 1;

const SearchDashbaurd = (props) => {
  const searchForJob = async (e) => {
    e.preventDefault();
    const jobTitle = document.querySelector('.input-feild #jobTitle').value;
    const address = document.querySelector('.input-feild #location').value;
    const latlng = await adressSelectHandler(address);

    //saving in local storage
    let previousSearches = JSON.parse(localStorage.getItem('previousSearches'));
    previousSearches.searches.push({ jobTitle, latlng, address });

    if (previousSearches.searches.length === 6) {
      previousSearches.searches.shift();
    }
    localStorage.setItem('previousSearches', JSON.stringify(previousSearches));

    props.history.push(
      `/jobs?jobTitle=${jobTitle}&lat=${latlng.lat}&lng=${latlng.lng}`
    );
  };

  const adressSelectHandler = async (value) => {
    const adressResults = await geocodeByAddress(value);
    const latLng = await getLatLng(adressResults[0]);

    return latLng;
  };

  const [address, setAddress] = React.useState('');

  //checking if prevous searches exist
  let previousSearches = localStorage.getItem('previousSearches');
  if (!previousSearches) {
    previousSearches = '{"searches":[]}';
    localStorage.setItem('previousSearches', previousSearches);
  } else {
    searchObj = JSON.parse(localStorage.getItem('previousSearches'));
  }

  return (
    <div className="dashbaurd">
      <div className="overlay"></div>
      <div className="dashbaurd-background-cover"></div>
      <div id="job-search-inputs">
        <form onSubmit={searchForJob} className="job-search-form">
          <br></br>
          <br></br>
          <div className="header">
            <img src={jumpStartCareerSVG} alt="" />
          </div>
          <div className="input-feild if1">
            <input
              placeholder="Job title, company, keyword"
              type="text"
              id="jobTitle"
              name="jobTitle"
              autoComplete="off"
            />
          </div>
          <div className="input-feild if2">
            {/* <input
              placeholder="Where"
              type="text"
              id="location"
              name="location"
              autoComplete="off"
            /> */}

            <PlacesAutocomplete value={address} onChange={setAddress}>
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => {
                return (
                  <div className="suggested-places">
                    <input
                      {...getInputProps({ placeholder: 'Where...' })}
                      type="text"
                      id="location"
                      name="location"
                    />
                    <div className="suggested-places-container">
                      {loading ? <div className="">...loading</div> : null}
                      {suggestions.map((suggestion) => {
                        const style = {
                          backgroundColor: suggestion.active
                            ? '#88a5bd'
                            : '#fff',
                          color: suggestion.active ? '#eee' : '#333',
                        };

                        return (
                          <div
                            className="suggested-place"
                            key={suggestion.description}
                            {...getSuggestionItemProps(suggestion, { style })}
                          >
                            {suggestion.description}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }}
            </PlacesAutocomplete>
          </div>
          <div className="filter"></div>
          <button className="signup-login-button">Search</button>
        </form>
        {searchObj.searches[0] ? (
          <div id="previous-searches">
            <p className="previous-search-header">previous searches</p>
            <ul>
              {searchObj.searches.map((search) => {
                const link = `/jobs?jobTitle=${search.jobTitle}&lat=${search.latlng.lat}&lng=${search.latlng.lng}`;

                return (
                  <li className="search-term" key={key++}>
                    <Link to={link}>
                      {search.jobTitle}, {search.address}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchDashbaurd;
