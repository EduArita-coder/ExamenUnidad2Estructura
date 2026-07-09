interface HistoryEntry {
  expression: string;
  result: number;
}

interface HistoryListProps {
  entries: HistoryEntry[];
}

export function HistoryList({ entries }: HistoryListProps) {
  if (entries.length === 0) {
    return <div className="history-list">
        <h2 style={{ fontSize: '16px' }}>Historial de Operaciones</h2>
      <p>Sin operaciones aún</p>
    </div>;
  }

  return (
    <div className="history-list">
        <h2 style={{ fontSize: '16px' }}>Historial de Operaciones</h2>
      <ul>
        {entries.map((entry, index) => (
          <li key={`${entry.expression}-${index}`}>
            {entry.expression} = {entry.result}
          </li>
        ))}
      </ul>
    </div>
  );
}
