import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import axios from "axios";

class Autocomplete extends Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array),
  };

  constructor(props) {
    super(props);

    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: true,
      userInput: "",
      suggestions: [],
    };
  }

  onChange = (e) => {
    const userInput = e.currentTarget.value;

    if (userInput.length > 2) {
      axios
        .get(`https://api.github.com/search/users?q=` + userInput)
        .then((resp) => {
          const logins = resp.data.items.map((item, index) => item.login);
          const filteredSuggestions = logins.filter(
            (suggestion) =>
              suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
          );
          this.setState({
            suggestions: logins,
            filteredSuggestions: filteredSuggestions,
          });
        });
      console.log("should filter");

      this.setState({
        activeSuggestion: 0,
        showSuggestions: true,
        userInput: e.currentTarget.value,
      });
    } else {
      this.setState({
        activeSuggestion: 0,
        filteredSuggestions: [],
        showSuggestions: true,
        userInput: e.currentTarget.value,
      });
    }
    console.log("should filter2");
  };

  onClick = (e) => {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText,
    });
  };

  onKeyDown = (e) => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    // User pressed the enter key
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion],
      });
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        //showSuggestions,
        userInput,
      },
    } = this;

    let suggestionsListComponent;

    if (userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestion-active";
              }

              return (
                <li className={className} key={suggestion} onClick={onClick}>
                  <a href={"https://github.com/" + suggestion} target="_blank">
                    {suggestion}
                  </a>
                </li>
              );
            })}
          </ul>
        );
      } else if (userInput.length < 3) {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>Please type at least 3 characters</em>
          </div>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>No suggestions</em>
          </div>
        );
      }
    }

    return (
      <Fragment>
        <input
          type="text"
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={userInput}
        />
        {suggestionsListComponent}
      </Fragment>
    );
  }
}

export default Autocomplete;
