import { useSolutionContext } from '../context/SolutionContext';
import { useCallback, useMemo } from 'react';
import { polygonColorOptions } from './constants';
import { FeatureCollection, Geometry } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRuler, faSquare } from '@fortawesome/free-solid-svg-icons';

import * as turf from '@turf/turf';
import { Feature, Polygon, MultiPolygon, GeoJsonProperties } from 'geojson';
import UnionAreaIcon from './icons/UnionAreaIcon';
import StackedAreaIcon from './icons/StackedAreaIcon';
import IntersectionAreaIcon from './icons/IntersectionAreaIcon';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const calculateArea = (polygon: Geometry) => {
  const p = turf.polygon(polygon.coordinates);
  return turf.area(p);
};

function Statistics() {
  const {
    selectedPolygonIndexes,
    activeSolution,
    selectedSolutionIndex,
    setSolutions,
    solutions,
  } = useSolutionContext();

  const stackedArea = useMemo(() => {
    let area = 0;
    // Adds the areas of all selected polygons together.
    for (const index of selectedPolygonIndexes) {
      area += calculateArea(activeSolution.features[index].geometry);
    }
    return area;
  }, [activeSolution, calculateArea, selectedPolygonIndexes]);

  const turfPolygons = useMemo(() => {
    if (!activeSolution) return [];

    if (selectedPolygonIndexes.length > 2)
      throw new Error('Too many polygons selected');

    const polygons = [];
    for (const polygonIndex of selectedPolygonIndexes) {
      const { coordinates } = activeSolution.features[polygonIndex].geometry;
      polygons.push(turf.polygon(coordinates));
    }
    return polygons;
  }, [selectedPolygonIndexes, activeSolution]);

  const arePolygonsOverlapping = useMemo(() => {
    // Impossible to have overlapping polygons if there is only one polygon
    if (turfPolygons.length < 2) return false;

    // returns true if the two geometries overlap, provided that neither completely contains the other.
    return turf.booleanOverlap(turfPolygons[0], turfPolygons[1]);
  }, [turfPolygons]);

  const arePolygonsContained = useMemo(() => {
    // Impossible to have overlapping polygons if there is only one polygon
    if (turfPolygons.length < 2) return false;

    // returns true if either geometry completely contains the other.
    return (
      turf.booleanContains(turfPolygons[0], turfPolygons[1]) ||
      turf.booleanContains(turfPolygons[1], turfPolygons[0])
    );
  }, [turfPolygons]);

  const unionArea = useMemo(() => {
    // Only calculated if there are two or more selected polygons and all overlap
    // or are contained
    if (!arePolygonsOverlapping && !arePolygonsContained) return NaN;

    const union = turf.union(turf.featureCollection(turfPolygons));

    if (!union) return NaN;

    return turf.area(union);
  }, [arePolygonsContained, arePolygonsOverlapping, turfPolygons]);

  const intersectionArea = useMemo(() => {
    // Only calculated if there are two or more selected polygons and all overlap
    // or are contained
    if (!arePolygonsOverlapping && !arePolygonsContained) return NaN;

    const intersection = turf.intersect(turf.featureCollection(turfPolygons));

    if (!intersection) return NaN;

    return turf.area(intersection);
  }, [arePolygonsContained, arePolygonsOverlapping, turfPolygons]);

  if (selectedPolygonIndexes.length < 1)
    return (
      <div className="d-flex flex-column h-100 justify-content-center align-items-center">
        <p>Please select a polygon to start.</p>
      </div>
    );

  const StackedAreaComponent = () => {
    if (selectedPolygonIndexes.length < 2) return null;

    return (
      <OverlayTrigger
        placement="auto"
        overlay={<Tooltip>Sum of the area of the selected polygons.</Tooltip>}
      >
        <li>
          <span className="fa-li">
            <StackedAreaIcon selectedPolygonIndexes={selectedPolygonIndexes} />
          </span>
          {Math.floor(stackedArea).toLocaleString()} m<sup>2</sup>
        </li>
      </OverlayTrigger>
    );
  };

  const UnionAreaComponent = () => {
    if (isNaN(unionArea)) return null;
    return (
      <OverlayTrigger
        placement="auto"
        overlay={<Tooltip>Area of the union of the selected polygons.</Tooltip>}
      >
        <li>
          <span className="fa-li">
            <UnionAreaIcon selectedPolygonIndexes={selectedPolygonIndexes} />
          </span>
          {Math.floor(unionArea).toLocaleString()} m<sup>2</sup>
        </li>
      </OverlayTrigger>
    );
  };

  const IntersectionAreaComponent = () => {
    if (isNaN(intersectionArea)) return null;
    return (
      <OverlayTrigger
        placement="auto"
        overlay={
          <Tooltip>Area of the intersection of the selected polygons.</Tooltip>
        }
      >
        <li title="Intersection area">
          <span className="fa-li">
            <IntersectionAreaIcon
              selectedPolygonIndexes={selectedPolygonIndexes}
            />
          </span>
          {Math.floor(intersectionArea).toLocaleString()} m<sup>2</sup>
        </li>
      </OverlayTrigger>
    );
  };

  const IndividualAreaComponent = (props: { polygonIndex: number }) => {
    const { polygonIndex } = props;

    return (
      <OverlayTrigger
        placement="auto"
        overlay={
          <Tooltip>
            Area of the {polygonColorOptions[polygonIndex]} polygon
          </Tooltip>
        }
      >
        <li>
          <span className="fa-li">
            <FontAwesomeIcon
              icon={faSquare}
              style={{
                color: polygonColorOptions[polygonIndex],
              }}
            />
          </span>
          <span
            title={`${calculateArea(activeSolution.features[polygonIndex].geometry)}`}
          >
            {Math.floor(
              calculateArea(activeSolution.features[polygonIndex].geometry)
            ).toLocaleString()}{' '}
            m<sup>2</sup>
          </span>
        </li>
      </OverlayTrigger>
    );
  };

  return (
    <div className="d-flex flex-column h-100 justify-content-between">
      {selectedPolygonIndexes.length > 0 && (
        <div>
          <p className="text-secondary fs-4">
            <FontAwesomeIcon icon={faRuler} className="me-1" />
            Area
          </p>

          {/* Right aligned, and monospaced so that it's easier to compare the numbers (spreadsheet style) */}
          <ul className="fa-ul ms-4 text-end font-monospace">
            {selectedPolygonIndexes.map((value) => {
              return (
                <IndividualAreaComponent
                  polygonIndex={value}
                  key={`${polygonColorOptions[value]}-polygon`}
                />
              );
            })}

            <StackedAreaComponent />
            <UnionAreaComponent />
            <IntersectionAreaComponent />
          </ul>
        </div>
      )}
      <div>
        {(arePolygonsOverlapping || arePolygonsContained) && (
          <div>
            <button
              className="btn btn-outline-light w-100 mb-2"
              onClick={() => {
                const union = turf.union(turf.featureCollection(turfPolygons));
                updatePolygonsArray(union, solutions);
              }}
            >
              <UnionAreaIcon selectedPolygonIndexes={selectedPolygonIndexes} />
              Union
            </button>

            <button
              className="btn btn-outline-light w-100 mb-2"
              onClick={() => {
                const intersection = turf.intersect(
                  turf.featureCollection(turfPolygons)
                );

                updatePolygonsArray(intersection, solutions);
              }}
            >
              <IntersectionAreaIcon
                selectedPolygonIndexes={selectedPolygonIndexes}
              />
              Intersection
            </button>
          </div>
        )}
      </div>
    </div>
  );

  function updatePolygonsArray(
    newPolygon: Feature<Polygon | MultiPolygon, GeoJsonProperties> | null,
    solutions: FeatureCollection[]
  ) {
    const selectedPolygonIndexesClone = [...selectedPolygonIndexes];

    if (!newPolygon) {
      console.error('No polygon');
      return solutions;
    }

    const newSolutions = [...solutions];
    const newFeatures = [...newSolutions[selectedSolutionIndex].features];

    // Remove the original polygons
    const updatedFeatures = newFeatures.filter(
      (_, index) => !selectedPolygonIndexesClone.includes(index)
    );

    // Function to add a single polygon feature
    const addPolygonFeature = (polygonGeometry: Polygon) => {
      updatedFeatures.push({
        type: 'Feature',
        properties: {},
        geometry: polygonGeometry,
      });
    };

    // Handle Polygon or MultiPolygon
    if (newPolygon.geometry.type === 'Polygon') {
      addPolygonFeature(newPolygon.geometry);
    } else {
      // MultiPolygon
      newPolygon.geometry.coordinates.forEach((polygonCoords) => {
        addPolygonFeature({
          type: 'Polygon',
          coordinates: polygonCoords,
        });
      });
    }

    newSolutions[selectedSolutionIndex] = {
      ...newSolutions[selectedSolutionIndex],
      features: updatedFeatures,
    };

    setSolutions(newSolutions);
  }
}

export default Statistics;
