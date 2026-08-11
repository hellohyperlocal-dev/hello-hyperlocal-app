import Constants, { ExecutionEnvironment } from 'expo-constants';
import { StaticMapPlaceholder, StaticMapMarker } from './StaticMapPlaceholder';

// Expo Go only ships a fixed set of native modules and has never included
// react-native-maps, so requiring it there throws before render. Custom dev
// clients and standalone/EAS builds link it fine and get the real map.
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let MapView: any;
let Marker: any;

if (isExpoGo) {
  MapView = StaticMapPlaceholder;
  Marker = StaticMapMarker;
} else {
  const RNMaps = require('react-native-maps');
  MapView = RNMaps.default;
  Marker = RNMaps.Marker;
}

export default MapView;
export { Marker };
