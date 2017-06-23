import autobind from 'autobind-decorator';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  ListView,
  RefreshControl,
  TouchableHighlight,
  View,
  AsyncStorage
} from 'react-native';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import parse from 'parse-link-header';

import { RepoListItem } from './RepoListItem';

// you don't need a token, but having one increases the rate limit by a lot
const accessToken = ''; // generate you own github token change this to access_token=<your own github api token>

async function getGitHubRepos(url = 'https://api.github.com/repositories?' + accessToken) {

  const response = await fetch(url);

  const json = await response.json();

  if(response.status !== 200) {
    throw new Error(json.message);
  }

  return {
    repos: json,
    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    next: (parse(response.headers.get('link')) || {}).next || false
  };
}

@autobind
export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'RNGitHubBrowser'
  };


  state = {
    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    refreshing: true,
    repos: [],
    next: true
  };

  componentDidMount() {
    this.receiveData(getGitHubRepos());
  }

  loadMoreContentAsync = () => {
    const next = this.state.next;
    this.setState({ next: false });
    this.receiveData(
      getGitHubRepos(this.state.next.url)
      .then(({repos, next}) => ({ repos: this.state.repos.concat(repos), next}))
    )
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.receiveData(getGitHubRepos());
  }

  receiveData(promise) {
    promise
    .then(({repos, next}) => this.setState({
      next,
      repos,
      refreshing: false,
      dataSource: this.state.dataSource.cloneWithRows(repos)
    }))
    .catch(error => {
      alert('Error fetching repos:' + error.message);
      this.setState({ refreshing: false, error })
    })
  }

  render() {
    return (
    <View style={styles.container}>
      <ListView
        style={styles.list}

        renderScrollComponent={props => <InfiniteScrollView {...props} />}

        canLoadMore={!!this.state.next}

        onLoadMoreAsync={this.loadMoreContentAsync}

        refreshControl={
          <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
        }

        dataSource={this.state.dataSource}

        enableEmptySections

        renderRow={repo => <RepoListItem navigate={this.props.navigation.navigate} repo={repo} />}

      >
      </ListView>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },

  list:  {
    flex: 1,
    alignSelf: 'stretch'
  }
});