import { useSolutionContext } from './SolutionContext';
import { useCallback, useMemo } from 'react';
import { polygonColorOptions } from './constants';
import { Geometry } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import { getAreaOfPolygon } from 'geolib';
import { GeolibInputCoordinates } from 'geolib/es/types';
import styles from './Statistics.module.scss';

function Statistics() {
  const { selectedPolygons, apiResponse, selectedSolution } =
    useSolutionContext();
  const totalArea = useMemo(() => {
    return 1000;
  }, []);

  const computedArea = useCallback((polygon: Geometry) => {
    const points = polygon.coordinates[0] as GeolibInputCoordinates[];
    return getAreaOfPolygon(points);
  }, []);

  const allSelectedPolygonsGeometry = useMemo(() => {
    const selectedPolygonsGeometry: Geometry = {
      type: 'Polygon',
      coordinates: [[]],
    };

    for (const index of selectedPolygons) {
      const feature = apiResponse[selectedSolution];
      const coordinates = feature?.features[index].geometry.coordinates;
      selectedPolygonsGeometry.coordinates[0] = [
        ...selectedPolygonsGeometry.coordinates[0],
        ...coordinates[0],
      ];
    }

    return selectedPolygonsGeometry;
  }, [selectedPolygons, apiResponse, selectedSolution]);

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
            {selectedPolygons.length > 1 && (
              <>
                <li>
                  <span className="fa-li">
                    {selectedPolygons.map((value) => (
                      <FontAwesomeIcon
                        icon={faSquare}
                        style={{
                          color: polygonColorOptions[value],
                          fontSize: '1em',
                          marginRight: '1px',
                        }}
                      />
                    ))}
                  </span>
                  {Math.floor(
                    computedArea(allSelectedPolygonsGeometry)
                  ).toLocaleString()}{' '}
                  m<sup>2</sup>
                </li>
              </>
            )}
            {selectedPolygons.length > 1 && (
              <>
                <li>
                  <span className="fa-li">
                    <div
                      className={`${styles['custom-icon-stack']} ${styles[`total-icons-${selectedPolygons.length}`]}`}
                    >
                      {selectedPolygons.map((value, index) => (
                        <span key={index} className={`${styles['fa-stack']}`}>
                          <FontAwesomeIcon
                            icon={faSquare}
                            className={`${styles['stacked-icon']}`}
                            style={{ color: polygonColorOptions[value] }}
                          />
                        </span>
                      ))}
                    </div>
                  </span>
                  TODO m<sup>2</sup>
                </li>
              </>
            )}
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
