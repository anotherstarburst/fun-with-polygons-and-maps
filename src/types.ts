export interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}

export interface Feature {
  type: 'Feature';
  properties: Record<string, unknown>;
  geometry: Geometry;
}

export interface Geometry {
  type: 'Polygon';
  coordinates: number[][][];
}
