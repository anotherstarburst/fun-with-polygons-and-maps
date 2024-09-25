import { Polygon } from './Polygon';
import { useSolutionContext } from './SolutionContext';

import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { FeatureCollection } from '../types';
import { useMemo } from 'react';
import { polygonColorOptions } from './constants';
import { MAX_SELECTED_POLYGONS } from './constants';

const SELECTED_POLYGON_COLOUR = '#fff';

function getPolygons(payload: FeatureCollection) {
  return payload.features.map((feature) => {
    return feature.geometry.coordinates[0].map((coord) => ({
      lat: coord[1],
      lng: coord[0],
    }));
  });
}

function WorkSurface() {
  const { payload, setSelectedPolygons, selectedPolygons } =
    useSolutionContext();

  const paths = useMemo(() => getPolygons(payload), [payload]);

  const defaultCenter = useMemo(() => {
    return paths[0][0];
  }, [paths]);

  return (
    <APIProvider apiKey={''}>
      <Map
        defaultZoom={16}
        defaultCenter={defaultCenter}
        mapId="DEMO_MAP_ID"
        className="vh-100"
      >
        {paths.map((path, index) => (
          <Polygon
            key={index}
            paths={[path]}
            strokeColor={
              selectedPolygons.includes(index)
                ? SELECTED_POLYGON_COLOUR
                : 'transparent'
            }
            fillColor={polygonColorOptions[index]}
            onClick={() => {
              if (selectedPolygons.includes(index)) {
                setSelectedPolygons((prevState) =>
                  prevState.filter((polygonIndex) => polygonIndex !== index)
                );
                return;
              }

              // if there are more than MAX_SELECTED_POLYGONS remove the first one
              // so that we can add the new one
              let currentPolygons = [...selectedPolygons];
              if (currentPolygons.length >= MAX_SELECTED_POLYGONS) {
                currentPolygons = [...currentPolygons.slice(1), index];
                setSelectedPolygons([...currentPolygons]);
                return;
              }

              setSelectedPolygons([...currentPolygons, index]);
            }}
          />
        ))}
      </Map>
    </APIProvider>
  );
}

export default WorkSurface;
