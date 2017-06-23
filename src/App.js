import {
  StackNavigator,
} from 'react-navigation';

import MainScreen from './MainScreen'
import RepoScreen from './RepoScreen'

export default App = StackNavigator({
  Main: {screen: MainScreen},
  Repo: {screen: RepoScreen},
});