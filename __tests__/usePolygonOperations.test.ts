import { renderHook, act } from '@testing-library/react';
import { usePolygonOperations } from '../src/hooks/usePolygonOperations';
import { useSolutionContext } from '../src/context/SolutionContext';
import {
  FeatureCollection,
  Feature,
  Polygon,
  MultiPolygon,
  GeoJsonProperties,
  Position,
} from 'geojson';

import * as turf from '@turf/turf';

jest.mock('../src/context/SolutionContext', () => ({
  useSolutionContext: jest.fn(),
}));

jest.mock('@turf/turf', () => ({
  booleanContains: jest.fn(),
}));

const createPolygon = (
  coordinates: number[][]
): Feature<Polygon, Record<string, unknown>> => ({
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [coordinates],
  },
  properties: {},
});

const createMultiPolygon = (
  coordinates: Position[][][]
): Feature<MultiPolygon, Record<string, unknown>> => ({
  type: 'Feature',
  geometry: {
    type: 'MultiPolygon',
    coordinates,
  },
  properties: {},
});

const mockInitialSolutionsTwoPolygons: FeatureCollection[] = [
  {
    type: 'FeatureCollection',
    features: [
      createPolygon([
        [2, 2],
        [3, 3],
        [3, 2],
        [2, 2],
      ]),
      createPolygon([
        [5, 6],
        [7, 8],
      ]),
    ],
  },
];

const mockInitialSolutionsThreePolygons: FeatureCollection[] = [
  {
    type: 'FeatureCollection',
    features: [
      createPolygon([
        [2, 2],
        [3, 3],
        [3, 2],
        [2, 2],
      ]),
      createPolygon([
        [5, 6],
        [7, 8],
      ]),
      createPolygon([
        [10, 20],
        [10, 30],
        [10, 35],
      ]),
    ],
  },
];

describe('usePolygonOperations', () => {
  let mockSetSolutions: jest.Mock;

  beforeEach(() => {
    mockSetSolutions = jest.fn();
    (useSolutionContext as jest.Mock).mockReturnValue({
      selectedPolygonIndexes: [0, 1],
      selectedSolutionIndex: 0,
      setSolutions: mockSetSolutions,
    });
  });

  it('should update solutions with a new Polygon', () => {
    const constructedPolygon = createPolygon([
      [0, 0],
      [1, 1],
      [1, 0],
      [0, 0],
    ]);

    const { result } = renderHook(() => usePolygonOperations());

    act(() => {
      result.current.updatePolygonsArray(
        constructedPolygon,
        mockInitialSolutionsTwoPolygons
      );
    });

    // The new polygon should be added to the solutions. Those listed in initialSolutions
    // should be removed from the solutions as they're present as indexes in selectedPolygonIndexes.
    expect(mockSetSolutions).toHaveBeenCalledWith([
      {
        type: 'FeatureCollection',
        features: [constructedPolygon],
      },
    ]);
  });

  it('should update solutions with a new MultiPolygon', () => {
    const { result } = renderHook(() => usePolygonOperations());

    const constructedMultiPolygon = createMultiPolygon([
      [
        [
          [0, 1],
          [2, 3],
          [4, 5],
        ],
      ],
      [
        [
          [0, 1],
          [2, 3],
        ],
      ],
    ]);

    act(() => {
      result.current.updatePolygonsArray(
        constructedMultiPolygon,
        mockInitialSolutionsTwoPolygons
      );
    });

    // Again, the setSolutions will remove the existing initialSolutions (as both have been "selected") and instead
    // insert the two polygons split from the multipolygon.
    expect(mockSetSolutions).toHaveBeenCalledWith([
      {
        type: 'FeatureCollection',
        features: [
          createPolygon([
            [0, 1],
            [2, 3],
            [4, 5],
          ]),
          createPolygon([
            [0, 1],
            [2, 3],
          ]),
        ],
      },
    ]);
  });

  it('should throw an error for invalid geometry type', () => {
    const { result } = renderHook(() => usePolygonOperations());
    const initialSolutions: FeatureCollection[] = [
      { type: 'FeatureCollection', features: [] },
    ];
    const invalidPolygon = {
      type: 'Feature',
      properties: {},
      geometry: { type: 'InvalidType', coordinates: [[]] },
    } as unknown as Feature<Polygon | MultiPolygon, GeoJsonProperties>;

    expect(() =>
      result.current.updatePolygonsArray(invalidPolygon, initialSolutions)
    ).toThrow('Invalid geometry type');
  });

  it('should sort features based on polygon containment', () => {
    const { result } = renderHook(() => usePolygonOperations());

    const constructedPolygon = createPolygon([
      [0, 0],
      [1, 1],
      [1, 0],
      [0, 0],
    ]);

    // Mock the booleanContains function to simulate containment
    (turf.booleanContains as jest.Mock).mockImplementation((a, b) => {
      // The last polygon in initialSolutions contains the newly constructed polygon
      return (
        a === mockInitialSolutionsThreePolygons[0].features[2] &&
        b === constructedPolygon
      );
    });

    act(() => {
      result.current.updatePolygonsArray(
        constructedPolygon,
        mockInitialSolutionsThreePolygons
      );
    });

    expect(mockSetSolutions).toHaveBeenCalled();
    const updatedSolutions = mockSetSolutions.mock.calls[0][0];

    // The last polygon in the solutions array overlaps with the new polygon,
    // so we should put that first, and the new polygon should be added to the end of the array
    // to ensure they're written to the map, one on top of the other
    expect(updatedSolutions[0].features[0]).toEqual(
      mockInitialSolutionsThreePolygons[0].features[2]
    );

    // The constructed polygon should be added after the remaining polygon in the solutions array
    // as it overlaps with the new polygon.
    // This is to ensure they're written to the map, one on top of the other.
    expect(updatedSolutions[0].features[1]).toEqual(constructedPolygon);
  });
});
