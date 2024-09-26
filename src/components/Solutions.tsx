import { useSolutionContext } from '../context/SolutionContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

interface SolutionItemProps {
  label: string;
  index: number;
}

const SolutionItem = (props: SolutionItemProps) => {
  const { selectedSolutionIndex, setSelectedSolutionIndex } =
    useSolutionContext();
  const { label, index } = props;

  return (
    <li className="list-group-item">
      <input
        className="form-check-input me-2"
        type="radio"
        name="listGroupRadio"
        id={`radio${index}`}
        checked={selectedSolutionIndex === index}
        onChange={() => setSelectedSolutionIndex(index)}
      />
      <label className="form-check-label" htmlFor={`radio${index}`}>
        {label}
      </label>
    </li>
  );
};

const Solutions = () => {
  const { solutions } = useSolutionContext();

  return (
    <div className="d-flex flex-column h-100 justify-content-between">
      <div>
        <p className="text-secondary fs-4 m-3">
          <FontAwesomeIcon icon={faLayerGroup} className="me-1" />
          Solutions
        </p>
        <ul className="list-group list-group-flush">
          {solutions.map((_, index) => (
            <SolutionItem
              key={`solution-${index}`}
              label={`Solution ${index + 1}`}
              index={index}
            />
          ))}
        </ul>
      </div>
      <a
        className="text-center text-secondary fs-4 m-3"
        href="https://github.com/anotherstarburst/fun-with-polygons-and-maps"
        target="_blank"
      >
        <FontAwesomeIcon icon={faGithub} />
      </a>
    </div>
  );
};

export default Solutions;
