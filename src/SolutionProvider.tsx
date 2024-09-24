import { useState, useMemo, ReactNode, useEffect } from 'react';
import { SolutionContext } from './components/SolutionContext';
import { FeatureCollection } from './types';

import responseOne from './api-responses/SE_State_Management_Polygons_1.json';
import responseTwo from './api-responses/SE_State_Management_Polygons_2.json';

interface SolutionProviderProps {
  children: ReactNode;
}

export function SolutionProvider({ children }: SolutionProviderProps) {
  const [selectedSolution, setSelectedSolution] = useState<number>(0);
  const [selectedPolygons, setSelectedPolygons] = useState<number[]>([]);

  const apiResponse = useMemo(() => {
    return [responseOne, responseTwo] as FeatureCollection[];
  }, []);

  const payload = useMemo(() => {
    return apiResponse[selectedSolution];
  }, [apiResponse, selectedSolution]);

  // Reset the selected polygons when the solution changes
  useEffect(() => {
    setSelectedPolygons([]);
  }, [selectedSolution]);

  return (
    <SolutionContext.Provider
      value={{
        selectedSolution,
        setSelectedSolution,
        payload,
        apiResponse,
        selectedPolygons,
        setSelectedPolygons,
      }}
    >
      {children}
    </SolutionContext.Provider>
  );
}
