import autobind from 'autobind-decorator';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  Dimensions,
  ScrollView
} from 'react-native';

@autobind
export default class RepoScreen extends Component {
  static navigationOptions = ({ navigation }) =>  ({
    title: `${navigation.state.params.full_name}`,
  });

  state = {
    commits: []
  }

  componentDidMount() {
    const url = this.props.navigation.state.params.commits_url.replace(/\{.*\}/, "") + "?per_page=100";
    this.getCommits(url);
  }

  getCommits(url) {
    fetch(url).then(res => res.json()).then(commits => {
      this.setState({ commits })
    }).catch(e => alert(e.message));
  }


  renderCommit(commit, i) {
    const { width, height } = Dimensions.get('window');
    return (
      <Image key={i} style={{  width: (width-0)/4, height: (width-0)/4, alignSelf: 'flex-start', }} source={{ uri: commit.committer && commit.committer.avatar_url }} />
    );
  }


  render() {
    const repo = this.props.navigation.state.params;

    return (
      <ScrollView style={styles.container}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {this.state.commits.filter(a => !!a.committer).map(this.renderCommit)}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'darkgray',
  },
  box: {
    // height: 100,
    marginBottom: 10,
    alignSelf: 'stretch',
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  subtext: {
    fontSize: 8,
  }
});