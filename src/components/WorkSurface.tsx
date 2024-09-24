import { Polygon } from './Polygon';
import { useSolutionContext } from './SolutionContext';

import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { FeatureCollection } from '../types';
import { useMemo } from 'react';
import { polygonColorOptions } from './utils';

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
            strokeColor={polygonColorOptions[index]}
            fillColor={polygonColorOptions[index]}
            onClick={() => {
              console.log(`Polygon ${index} clicked`);
              if (selectedPolygons.includes(index)) {
                setSelectedPolygons((prevState) =>
                  prevState.filter((polygonIndex) => polygonIndex !== index)
                );
                return;
              }
              setSelectedPolygons([...selectedPolygons, index]);
            }}
          />
        ))}
      </Map>
    </APIProvider>
  );
}

export default WorkSurface;
