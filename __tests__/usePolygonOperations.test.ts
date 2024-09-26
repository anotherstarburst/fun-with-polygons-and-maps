import { renderHook, act } from '@testing-library/react';
import { usePolygonOperations } from '../src/hooks/usePolygonOperations';
import { useSolutionContext } from '../src/context/SolutionContext';
import { Feature, Polygon, MultiPolygon, GeoJsonProperties } from 'geojson';
import { FeatureCollection } from '../src/types';

jest.mock('../src/context/SolutionContext', () => ({
  useSolutionContext: jest.fn(),
}));

jest.mock('@turf/turf', () => ({
  booleanContains: jest.fn(),
}));

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
    const newPolygon: Feature<Polygon | MultiPolygon, GeoJsonProperties> = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [1, 1],
            [1, 0],
            [0, 0],
          ],
        ],
      },
      properties: {},
    };

    const initialSolutions: FeatureCollection[] = [
      {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [2, 2],
                  [3, 3],
                  [3, 2],
                  [2, 2],
                ],
              ],
            },
            properties: {},
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [5, 6],
                  [7, 8],
                ],
              ],
            },
            properties: {},
          },
        ],
      },
    ];

    const { result } = renderHook(() => usePolygonOperations());

    act(() => {
      result.current.updatePolygonsArray(newPolygon, initialSolutions);
    });

    // The new polygon should be added to the solutions. Those listed in initialSolutions
    // should be removed from the solutions as they're present as indexes in selectedPolygonIndexes.
    expect(mockSetSolutions).toHaveBeenCalledWith([
      {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [0, 0],
                  [1, 1],
                  [1, 0],
                  [0, 0],
                ],
              ],
            },
          },
        ],
      },
    ]);
  });

  it('should update solutions with a new MultiPolygon', () => {
    const { result } = renderHook(() => usePolygonOperations());
    const initialSolutions: FeatureCollection[] = [
      {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [2, 2],
                  [3, 3],
                  [3, 2],
                  [2, 2],
                ],
              ],
            },
            properties: {},
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [5, 6],
                  [7, 8],
                ],
              ],
            },
            properties: {},
          },
        ],
      },
    ];

    const newMultiPolygon: Feature<MultiPolygon, GeoJsonProperties> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
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
        ],
      },
    };

    act(() => {
      result.current.updatePolygonsArray(newMultiPolygon, initialSolutions);
    });

    // Again, the setSolutions will remove the existing initialSolutions (as both have been "selected") and instead
    // insert the two polygons split from the multipolygon.
    expect(mockSetSolutions).toHaveBeenCalledWith([
      {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [0, 1],
                  [2, 3],
                  [4, 5],
                ],
              ],
            },
          },
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [0, 1],
                  [2, 3],
                ],
              ],
            },
          },
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

  // it('should sort features based on polygon containment', () => {
  //     //  TODO
  //     expect(true).toBe(false);
  // });
});
