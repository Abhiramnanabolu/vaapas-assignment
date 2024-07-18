import React, { Component } from 'react';
import './index.css';

class Card extends Component {
  state = {
    imageUrl: null,
    loading: true,
    error: null
  };

  componentDidMount() {
    this.fetchImage();
  }

  fetchImage = () => {
    fetch('https://dog.ceo/api/breeds/image/random')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        return response.json();
      })
      .then(data => {
        this.setState({ imageUrl: data.message, loading: false, error: null });
      })
      .catch(error => {
        console.error('Error fetching image:', error);
        this.setState({ loading: false, error: error.message });
      });
  };

  render() {
    const { title, author } = this.props;
    const { imageUrl, loading, error } = this.state;

    return (
      <div className="card">
        {loading ? (
          <div className="card-loading">Loading...</div>
        ) : error ? (
          <div className="card-error">{error}</div>
        ) : (
          <img src={imageUrl} alt={title} className="card-image" />
        )}
        <div className="card-content">
          <h2 className="card-title">{title}</h2>
          <p className="card-author">{author}</p>
        </div>
      </div>
    );
  }
}

export default Card;
