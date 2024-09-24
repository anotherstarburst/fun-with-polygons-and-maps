import { useState, useMemo, ReactNode } from 'react';
import responseOne from './api-responses/SE_State_Management_Polygons_1.json';
import responseTwo from './api-responses/SE_State_Management_Polygons_2.json';
import { SolutionContext } from './components/SolutionContext';
import { FeatureCollection } from './types';

interface SolutionProviderProps {
  children: ReactNode;
}

export function SolutionProvider({ children }: SolutionProviderProps) {
  const [selectedSolution, setSelectedSolution] = useState<number>(1);

  const payload = useMemo(() => {
    return selectedSolution === 1 ? responseOne : responseTwo;
  }, [selectedSolution]) as FeatureCollection;

  return (
    <SolutionContext.Provider
      value={{ selectedSolution, setSelectedSolution, payload }}
    >
      {children}
    </SolutionContext.Provider>
  );
}
