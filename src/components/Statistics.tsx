import { useSolutionContext } from './SolutionContext';
import { useCallback, useMemo } from 'react';
import { polygonColorOptions } from './constants';
import { Geometry } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import { getAreaOfPolygon } from 'geolib';
import { GeolibInputCoordinates } from 'geolib/es/types';

function Statistics() {
  const { selectedPolygons, apiResponse, selectedSolution } =
    useSolutionContext();
  const totalArea = useMemo(() => {
    return 1000;
  }, []);

  const computedArea = useCallback((polygon: Geometry) => {
    const points = polygon.coordinates[0] as GeolibInputCoordinates[];
    console.log({ points });
    return getAreaOfPolygon(points);
  }, []);

  return (
    <>
      <h3>Statistics</h3>
      {selectedPolygons.length > 0 && (
        <>
          <p>Area</p>
          <ul className="fa-ul ms-4">
            {selectedPolygons.map((value) => {
              return (
                <li>
                  <span className="fa-li">
                    <FontAwesomeIcon
                      icon={faSquare}
                      style={{
                        color: polygonColorOptions[value],
                      }}
                    />
                  </span>
                  <span
                    title={`${computedArea(apiResponse[selectedSolution].features[value].geometry)}`}
                  >
                    {Math.floor(
                      computedArea(
                        apiResponse[selectedSolution].features[value].geometry
                      )
                    ).toLocaleString()}{' '}
                    m<sup>2</sup>
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
      <p>
        Area: {totalArea}m{' '}
        <mark>Todo - requires union to be calculated first</mark>
      </p>
      <hr />
      <h3>Tools</h3>
      <hr />
      Tools available for selected solution
    </>
  );
}

export default Statistics;
