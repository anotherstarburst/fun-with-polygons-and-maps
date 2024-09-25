import { Polygon } from './Polygon';
import { useSolutionContext } from '../../context/SolutionContext';

import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { FeatureCollection } from '../../types';
import { useMemo } from 'react';
import { polygonColorOptions } from '../constants';
import { MAX_SELECTED_POLYGONS } from '../constants';
import * as turf from '@turf/turf';

const SELECTED_POLYGON_COLOUR = '#fff';

function getPolygons(activeSolution: FeatureCollection) {
  return activeSolution.features.map((feature) => {
    return feature.geometry.coordinates[0].map((coord) => ({
      lat: coord[1],
      lng: coord[0],
    }));
  });
}

function WorkSurface() {
  const { activeSolution, setSelectedPolygonIndexes, selectedPolygonIndexes } =
    useSolutionContext();

  const paths = useMemo(() => getPolygons(activeSolution), [activeSolution]);

  const defaultCenter = useMemo(() => {
    const points: number[][] = [];
    activeSolution.features.forEach((feature) => {
      feature.geometry.coordinates[0].forEach((coord) => {
        points.push([coord[0], coord[1]]);
      });
    });

    if (!points || !points.length) return paths[0][0];

    const features = turf.points(points);

    const center = turf.center(features);

    return {
      lat: center?.geometry?.coordinates[1],
      lng: center?.geometry?.coordinates[0],
    };
  }, [activeSolution.features, paths]);

  return (
    <APIProvider apiKey={''}>
      <Map
        defaultZoom={16}
        defaultCenter={defaultCenter}
        mapId="DEMO_MAP_ID"
        className="vh-100 card"
      >
        {paths.map((path, index) => (
          <Polygon
            key={`polygon-${index}`}
            paths={[path]}
            strokeColor={
              selectedPolygonIndexes.includes(index)
                ? SELECTED_POLYGON_COLOUR
                : 'transparent'
            }
            fillColor={polygonColorOptions[index]}
            onClick={() => {
              if (selectedPolygonIndexes.includes(index)) {
                setSelectedPolygonIndexes((prevState) =>
                  prevState.filter((polygonIndex) => polygonIndex !== index)
                );
                return;
              }

              // if there are more than MAX_SELECTED_POLYGONS remove the first one
              // so that we can add the new one
              let currentPolygons = [...selectedPolygonIndexes];
              if (currentPolygons.length >= MAX_SELECTED_POLYGONS) {
                currentPolygons = [...currentPolygons.slice(1), index];
                setSelectedPolygonIndexes([...currentPolygons]);
                return;
              }

              setSelectedPolygonIndexes([...currentPolygons, index]);
            }}
          />
        ))}
      </Map>
    </APIProvider>
  );
}

export default WorkSurface;
