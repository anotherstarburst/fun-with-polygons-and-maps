import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { FeatureCollection } from '../types';

interface SolutionContextType {
  selectedPolygonIndexes: number[];
  setSelectedPolygonIndexes: Dispatch<SetStateAction<number[]>>;
  selectedSolutionIndex: number;
  setSelectedSolutionIndex: Dispatch<SetStateAction<number>>;
  activeSolution: FeatureCollection;
  solutions: FeatureCollection[];
  setSolutions: (newSolutions: FeatureCollection[]) => void;
}

export const SolutionContext = createContext<SolutionContextType | undefined>(
  undefined
);

export function useSolutionContext() {
  const context = useContext(SolutionContext);
  if (!context) {
    throw new Error(
      'useSolutionContext must be used within a SolutionProvider'
    );
  }
  return context;
}
