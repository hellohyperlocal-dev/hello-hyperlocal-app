import React from 'react';
import { Platform, View, StyleProp, ViewStyle } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { StaticMapPlaceholder } from './StaticMapPlaceholder';

// expo-maps is alpha and explicitly not available in Expo Go (native module
// isn't bundled there), so requiring it there throws before render. Custom
// dev clients and standalone/EAS builds link it fine and get the real map.
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MarkerProps {
  coordinate: Coordinate;
  title?: string;
  description?: string;
  pinColor?: string;
  onPress?: () => void;
}

// Never rendered directly — AppMapView below walks its <Marker> children via
// React.Children and converts their props into expo-maps' markers array.
// This keeps the react-native-maps-style JSX-children API at call sites
// (app/(tabs)/explore.tsx, app/business/[id].tsx) unchanged.
export function Marker(_props: MarkerProps) {
  return null;
}

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface AppMapViewProps {
  style?: StyleProp<ViewStyle>;
  initialRegion?: Region;
  scrollEnabled?: boolean;
  zoomEnabled?: boolean;
  pointerEvents?: 'none' | 'auto' | 'box-none' | 'box-only';
  children?: React.ReactNode;
}

// expo-maps takes a zoom level, not a lat/lng delta — approximate one from
// the delta using the standard Web Mercator relationship. Good enough for
// this app's two fixed use cases (a neighbourhood-wide view and a close
// single-pin preview), not meant to be pixel-exact.
function regionToCamera(region?: Region) {
  if (!region) return undefined;
  return {
    coordinates: { latitude: region.latitude, longitude: region.longitude },
    zoom: Math.log2(360 / region.longitudeDelta),
  };
}

function extractMarkers(children: React.ReactNode) {
  const markers: {
    id: string;
    coordinates: Coordinate;
    title?: string;
    snippet?: string;
    tintColor?: string;
  }[] = [];
  const onPressById = new Map<string, () => void>();

  React.Children.forEach(children, (child, index) => {
    if (!React.isValidElement(child) || child.type !== Marker) return;
    const props = child.props as MarkerProps;
    const id = String(index);
    if (props.onPress) onPressById.set(id, props.onPress);
    markers.push({
      id,
      coordinates: props.coordinate,
      title: props.title,
      // Android's GoogleMapsMarker has `snippet`; iOS's AppleMapsMarker has
      // no description-equivalent field at all — dropped there, not a bug.
      snippet: props.description,
      // Android's GoogleMapsMarker has no tint/color field (would need a
      // custom `icon` image instead) — pinColor only takes effect on iOS.
      tintColor: props.pinColor,
    });
  });

  return { markers, onPressById };
}

const styles = { fill: { flex: 1 } as ViewStyle };

const AppMapView = React.forwardRef<any, AppMapViewProps>(
  ({ style, initialRegion, pointerEvents, children }, ref) => {
    if (isExpoGo) {
      return <StaticMapPlaceholder style={style} />;
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { AppleMaps, GoogleMaps } = require('expo-maps');
    const { markers, onPressById } = extractMarkers(children);
    const cameraPosition = regionToCamera(initialRegion);
    const onMarkerClick = (marker: { id?: string }) => {
      if (marker.id) onPressById.get(marker.id)?.();
    };

    const map =
      Platform.OS === 'ios' ? (
        <AppleMaps.View
          ref={ref}
          style={styles.fill}
          cameraPosition={cameraPosition}
          markers={markers}
          onMarkerClick={onMarkerClick}
        />
      ) : (
        <GoogleMaps.View
          ref={ref}
          style={styles.fill}
          cameraPosition={cameraPosition}
          markers={markers}
          onMarkerClick={onMarkerClick}
        />
      );

    // pointerEvents="none" makes this a static, non-interactive preview
    // (business/[id].tsx's use case) — expo-maps doesn't expose a unified
    // scroll/zoom-gesture toggle across both platforms, so blocking touch
    // at the View level achieves the same effect regardless of platform.
    return (
      <View style={style} pointerEvents={pointerEvents}>
        {map}
      </View>
    );
  }
);

export default AppMapView;
