import autobind from 'autobind-decorator';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  Button,
  Image,
  View
} from 'react-native';


export class RepoListItem extends Component {
  render() {
    const { repo, navigate } = this.props;

    return (
    <TouchableHighlight
      style={styles.listitem}
      onPress={() => navigate('Repo', repo)}
      underlayColor='lightblue'>
        <View style={{ flexDirection: 'row' }}>

          <Image style={{ width: 80, height: 80 }} source={{ uri: repo.owner.avatar_url }} />

          <View style={{ flex: 1, padding: 15 }}>
            <Text>{repo.full_name}</Text>
            <Text style={styles.subtext}>{repo.description}</Text>
          </View>

        </View>
    </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  listitem: {
    // marginHorizontal: 10,
    // marginTop: 10,
     borderBottomWidth: 1,
    borderColor: 'lightgray',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 5, height: 5}
  },
  subtext: {
    fontSize: 8,
  }
});