import { useSolutionContext } from './SolutionContext';
import { useCallback, useMemo } from 'react';
import { polygonColorOptions } from './constants';
import { Geometry } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPizzaSlice, faSquare } from '@fortawesome/free-solid-svg-icons';
import styles from './Statistics.module.scss';
import * as turf from '@turf/turf';

function Statistics() {
  const { selectedPolygons, apiResponse, selectedSolution } =
    useSolutionContext();

  const computedArea = useCallback((polygon: Geometry) => {
    const p = turf.polygon(polygon.coordinates);
    return turf.area(p);
  }, []);

  const stackedArea = useMemo(() => {
    let area = 0;
    // Adds the areas of all selected polygons together.
    for (const index of selectedPolygons) {
      area += computedArea(
        apiResponse[selectedSolution].features[index].geometry
      );
    }
    return area;
  }, [apiResponse, computedArea, selectedPolygons, selectedSolution]);

  const arePolygonsOverlapping = useMemo(() => {
    // Impossible to have overlapping polygons if there is only one polygon
    if (selectedPolygons.length < 2) return false;

    if (selectedPolygons.length > 2)
      throw new Error('Too many polygons selected');

    const polys = [];
    for (const index of selectedPolygons) {
      const feature = apiResponse[selectedSolution];
      polys.push(turf.polygon(feature?.features[index].geometry.coordinates));
    }

    return turf.booleanOverlap(polys[0], polys[1]);
  }, [apiResponse, selectedPolygons, selectedSolution]);

  const unionArea = useMemo(() => {
    // Only calculated if there are two or more selected polygons and all overlap
    if (!arePolygonsOverlapping) return NaN;

    const polygons = [];
    for (const index of selectedPolygons) {
      const feature = apiResponse[selectedSolution];
      const coordinates = feature?.features[index].geometry.coordinates;
      polygons.push(
        turf.polygon(coordinates, { fill: polygonColorOptions[index] })
      );
    }

    const union = turf.union(turf.featureCollection(polygons));

    if (!union) return NaN;

    return turf.area(union);
  }, [apiResponse, arePolygonsOverlapping, selectedPolygons, selectedSolution]);

  const intersectionArea = useMemo(() => {
    // Only calculated if there are two or more selected polygons and all overlap
    if (!arePolygonsOverlapping) return NaN;

    const polygons = [];
    for (const index of selectedPolygons) {
      const feature = apiResponse[selectedSolution];
      const coordinates = feature?.features[index].geometry.coordinates;
      polygons.push(
        turf.polygon(coordinates, { fill: polygonColorOptions[index] })
      );
    }

    const intersection = turf.intersect(turf.featureCollection(polygons));

    if (!intersection) return NaN;

    return turf.area(intersection);
  }, [apiResponse, arePolygonsOverlapping, selectedPolygons, selectedSolution]);

  if (!selectedPolygons.length)
    return (
      <div className="d-flex flex-column h-100 justify-content-center align-items-center">
        <p>Please select a polygon to start.</p>
      </div>
    );

  return (
    // space between the two containers
    <div className="d-flex flex-column h-100 justify-content-between">
      <div>
        {arePolygonsOverlapping && (
          <div className="mt-1">
            <button className="btn btn-outline-light w-100 mb-1">
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
              Union
            </button>
            <button className="btn btn-outline-light w-100">
              <FontAwesomeIcon icon={faPizzaSlice} className="me-1" />
              Intersection
            </button>
          </div>
        )}
      </div>

      {selectedPolygons.length > 0 && (
        <div>
          <p className="text-secondary fs-6">Selected Area</p>
          <ul className="fa-ul ms-4 text-end font-monospace">
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
                  {Math.floor(stackedArea).toLocaleString()} m<sup>2</sup>
                </li>
              </>
            )}
            {!isNaN(unionArea) && (
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
                  {Math.floor(unionArea).toLocaleString()} m<sup>2</sup>
                </li>
              </>
            )}
            {!isNaN(intersectionArea) && (
              <>
                <li title="Intersection area">
                  <span className="fa-li">
                    <FontAwesomeIcon icon={faPizzaSlice} />
                  </span>
                  {Math.floor(intersectionArea).toLocaleString()} m<sup>2</sup>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Statistics;
