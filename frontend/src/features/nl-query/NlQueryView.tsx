import { useMemo, useState } from 'react';
import { parsePlanningQuery } from '../../domain';

export function NlQueryView() {
  const [query, setQuery] = useState('');
  const parsed = useMemo(() => parsePlanningQuery(query), [query]);

  return (
    <section className="feature-surface" aria-labelledby="nl-query-title">
      <div className="feature-heading">
        <p className="eyebrow">NL Query</p>
        <h2 id="nl-query-title">Natural Language Query</h2>
        <p>Placeholder parser for future natural-language planning requests.</p>
      </div>
      <label className="stacked-field">
        Query
        <textarea
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find available lecture rooms tomorrow afternoon"
          value={query}
        />
      </label>
      <div className="placeholder-panel">
        <p>Intent: {parsed.inferredIntent}</p>
      </div>
    </section>
  );
}
