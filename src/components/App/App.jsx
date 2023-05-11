import React, { Component } from 'react';
import Notiflix from 'notiflix';

import { AppImg, Wrapper } from './App.styled';
import { Container } from 'components/Container/Container';
import { Searchbar } from 'components/Searchbar/Searchbar';
import { fetchImages } from '../../FetchImages/FetchImages';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Button } from 'components/Button/Button';
import { ColorRingLoad } from 'components/Loader/Loader';
import { ButtonUpTop } from 'components/ButtonUpTop/ButtonUpTop';

export class App extends Component {
  state = {
    query: '',
    items: [],
    status: 'idle',
    totalHits: 0,
    page: 1,
    error: '',
  };
  handleSubmit = async searchQuery => {
    this.setState({ query: searchQuery, page: 1 });

    try {
      this.setState({ status: 'pending' });
      const { hits, totalHits } = await fetchImages(searchQuery, 1);
      // console.log(hits, totalHits);
      if (hits.length < 1) {
        this.setState({ status: 'idle', totalHits: 0 });
      } else {
        this.setState({
          items: hits,
          totalHits: totalHits,
          status: 'resolved',
        });
      }
    } catch (error) {
      this.setState({ status: 'rejected', error });
    }
  };

  onLoadMore = async () => {
    const { query, page } = this.state;
    this.setState({ status: 'pending' });
    this.setState(prevState => {
      return { page: prevState.page + 1 };
    });
    try {
      const { hits } = await fetchImages(query, page + 1);

      this.setState(prevState => ({
        items: [...prevState.items, ...hits],
        status: 'resolved',
      }));
    } catch (error) {
      this.setState({ status: 'rejected', error });
    }
  };
  onUpTop = e => {
    if (window.pageYOffset > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  render() {
    const { totalHits, status, items, query } = this.state;
    if (status === 'idle') {
      return (
        <AppImg>
          <Container>
            <Searchbar onSubmit={this.handleSubmit} />
            {query && totalHits < 1 ? (
              Notiflix.Notify.info(' 🙄No results were found for your search')
            ) : (
              <ImageGallery images={this.state.items} />
            )}
          </Container>
        </AppImg>
      );
    }
    if (status === 'pending') {
      return (
        <AppImg>
          <Container>
            <Searchbar onSubmit={this.handleSubmit} />
            <ImageGallery images={this.state.items} />
            <ColorRingLoad />
          </Container>
        </AppImg>
      );
    }
    if (status === 'rejected') {
      return (
        <AppImg>
          <Container>
            <Searchbar onSubmit={this.handleSubmit} />
            <ImageGallery images={this.state.items} />

            {Notiflix.Notify.failure(`${this.state.error.message}`)}
          </Container>
        </AppImg>
      );
    }
    if (status === 'resolved') {
      return (
        <AppImg>
          <Container>
            <Searchbar onSubmit={this.handleSubmit} />
            <ImageGallery images={this.state.items} />
            {totalHits > 12 && totalHits > items.length && (
              <Wrapper>
                <Button btnLoadMore={this.onLoadMore} />
                <ButtonUpTop onClick={this.onUpTop} />
              </Wrapper>
            )}
          </Container>
        </AppImg>
      );
    }
  }
}
export default App;
