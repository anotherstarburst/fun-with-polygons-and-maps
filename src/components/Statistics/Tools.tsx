import { useSolutionContext } from '../../context/SolutionContext';
import { FeatureCollection } from '../../types';
import { Feature, Polygon, MultiPolygon, GeoJsonProperties } from 'geojson';
import IntersectionAreaIcon from '../icons/IntersectionAreaIcon';
import UnionAreaIcon from '../icons/UnionAreaIcon';
import * as turf from '@turf/turf';
import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';

interface ToolsComponentProps {
  arePolygonsOverlapping: boolean;
  arePolygonsContained: boolean;
  turfPolygons: Feature<Polygon, GeoJsonProperties>[];
}

function ToolsComponent(props: ToolsComponentProps) {
  const { arePolygonsOverlapping, arePolygonsContained, turfPolygons } = props;
  const {
    selectedPolygonIndexes,
    selectedSolutionIndex,
    setSolutions,
    solutions,
  } = useSolutionContext();

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

    const addPolygonFeature = (polygonGeometry: Polygon) => {
      updatedFeatures.push({
        type: 'Feature',
        properties: {},
        geometry: polygonGeometry,
      });
    };

    if (newPolygon.geometry.type === 'Polygon') {
      addPolygonFeature(newPolygon.geometry);
    } else if (newPolygon.geometry.type === 'MultiPolygon') {
      // MultiPolygon
      newPolygon.geometry.coordinates.forEach((polygonCoords) => {
        addPolygonFeature({
          type: 'Polygon',
          coordinates: polygonCoords,
        });
      });
    } else {
      throw new Error(
        'Invalid geometry type: ' + JSON.stringify(newPolygon.geometry)
      );
    }

    // Sort the features to ensure no polygon fully contains another that precedes it
    updatedFeatures.sort((a, b) => {
      if (turf.booleanContains(a, b)) return -1;
      if (turf.booleanContains(b, a)) return 1;
      return 0;
    });

    newSolutions[selectedSolutionIndex] = {
      ...newSolutions[selectedSolutionIndex],
      features: updatedFeatures,
    };

    setSolutions(newSolutions);
  }

  const isBtnDisabled = useMemo(() => {
    return !(arePolygonsOverlapping || arePolygonsContained);
  }, [arePolygonsContained, arePolygonsOverlapping]);

  if (selectedPolygonIndexes.length < 2) return null;

  return (
    <div>
      <button
        className={`btn btn-outline-light w-100 mb-2`}
        onClick={() => {
          const union = turf.union(turf.featureCollection(turfPolygons));
          updatePolygonsArray(union, solutions);
        }}
        disabled={isBtnDisabled}
      >
        {!isBtnDisabled && (
          <UnionAreaIcon selectedPolygonIndexes={selectedPolygonIndexes} />
        )}
        {isBtnDisabled && <FontAwesomeIcon className="me-1" icon={faBan} />}
        Union
      </button>

      <button
        className={`btn btn-outline-light w-100 mb-2`}
        onClick={() => {
          const intersection = turf.intersect(
            turf.featureCollection(turfPolygons)
          );

          updatePolygonsArray(intersection, solutions);
        }}
        disabled={isBtnDisabled}
      >
        {!isBtnDisabled && (
          <IntersectionAreaIcon
            selectedPolygonIndexes={selectedPolygonIndexes}
          />
        )}
        {isBtnDisabled && <FontAwesomeIcon className="me-1" icon={faBan} />}
        Intersection
      </button>
    </div>
  );
}

export default ToolsComponent;
