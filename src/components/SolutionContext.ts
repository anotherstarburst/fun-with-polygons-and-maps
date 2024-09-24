import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { FeatureCollection } from '../types';

interface SolutionContextType {
  selectedSolution: number;
  setSelectedSolution: Dispatch<SetStateAction<number>>;
  payload: FeatureCollection;
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
