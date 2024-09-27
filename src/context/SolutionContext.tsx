import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { FeatureCollection } from '../types';
import { ReactNode, useMemo, useState, useEffect, useCallback } from 'react';

import responseOne from '../data/solution-1.json';
import responseTwo from '../data/solution-2.json';

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

interface SolutionProviderProps {
  children: ReactNode;
}

export function SolutionProvider({ children }: SolutionProviderProps) {
  const apiResponse = useMemo(() => {
    return [responseOne, responseTwo] as FeatureCollection[];
  }, []);

  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState<number>(0);
  const [selectedPolygonIndexes, setSelectedPolygonIndexes] = useState<
    number[]
  >([]);
  const [solutions, setAllSolutions] =
    useState<FeatureCollection[]>(apiResponse);

  const activeSolution = useMemo(() => {
    return solutions[selectedSolutionIndex];
  }, [solutions, selectedSolutionIndex]);

  // Reset the selected polygons when the solution changes
  useEffect(() => {
    setSelectedPolygonIndexes([]);
  }, [selectedSolutionIndex]);

  // We're using a callback here, instead of a direct setState call to handle side effects
  // (e.g. resetting the selected polygon indexes). Otherwise the app crashes if you set a set of solutions
  // that are smaller than the previous solution
  const setSolutions = useCallback(
    (newSolutions: FeatureCollection[]) => {
      setSelectedPolygonIndexes([]);
      if (selectedSolutionIndex > solutions.length - 1) {
        setSelectedSolutionIndex(solutions.length - 1);
      }
      setAllSolutions(newSolutions);
    },
    [selectedSolutionIndex, solutions.length]
  );

  return (
    <SolutionContext.Provider
      value={{
        selectedSolutionIndex,
        setSelectedSolutionIndex,
        activeSolution,
        solutions,
        setSolutions,
        selectedPolygonIndexes,
        setSelectedPolygonIndexes,
      }}
    >
      {children}
    </SolutionContext.Provider>
  );
}
