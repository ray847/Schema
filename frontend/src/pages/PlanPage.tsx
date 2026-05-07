import { NlQueryView } from '../features/nl-query';
import { PlanningView } from '../features/planning';

export function PlanPage() {
  return (
    <div className="page-stack">
      <PlanningView />
      <NlQueryView />
    </div>
  );
}
