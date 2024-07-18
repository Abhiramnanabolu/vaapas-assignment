import React, { Component } from 'react';
import './App.css';
import Loader from '../src/Components/Loader';
import Card from '../src/Components/Card'; 

class App extends Component {
  state = {
    searchTerm: '',
    loading: false,
    results: [],
    error: null
  };

  handleInputChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  };

  fetchImage = () => {
    return fetch('https://dog.ceo/api/breeds/image/random')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        return response.json();
      })
      .then(data => {
        return data.message;
      })
      .catch(error => {
        console.error('Error fetching image:', error);
        return null;
      });
  };

  onSearch = () => {
    const { searchTerm } = this.state;
    const query = searchTerm.split(' ').join('+');
    const url = `https://openlibrary.org/search.json?q=${query}`;

    this.setState({ loading: true });

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(async data => {
        const results = data.docs;
        const resultsWithImages = await Promise.all(results.map(async result => {
          const imageUrl = await this.fetchImage();
          return { ...result, imageUrl };
        }));
        this.setState({ results: resultsWithImages, loading: false, error: null });
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        this.setState({ loading: false, error: error.message });
      });

    console.log("Searching for:", searchTerm);
  };

  render() {
    const { loading, results, error } = this.state;
    return (
      <div className="app-container">
        <h1 className="heading">Movie Search</h1>
        <div className="search-bar-container">
          <input 
            type="text" 
            onChange={this.handleInputChange} 
            className="search-bar" 
            placeholder="Search..." 
          />
          <button className="search-button" onClick={this.onSearch}>Search</button>
        </div>
        <div className='loader-div'>
          {loading ? <Loader /> : ""}
          {error && <p className="error-message">{error}</p>}
        </div>
        <div className="results-container">
          {results.map((result, index) => (
            <Card 
              key={index} 
              title={result.title} 
              author={result.author_name ? result.author_name.join(', ') : 'Unknown'} 
            />
          ))}
        </div>
      </div>
    );
  }
}

export default App;
