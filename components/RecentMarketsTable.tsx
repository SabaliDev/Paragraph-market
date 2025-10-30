interface Market {
  id: string;
  title: string;
  status: 'active' | 'resolved';
  predictions: number;
  volume: string;
}

const marketsData: Market[] = [
  {
    id: '1',
    title: 'Will ETH reach $4k by end of Q3?',
    status: 'active',
    predictions: 12450,
    volume: '$150.2k'
  },
  {
    id: '2',
    title: 'AI model "Genesis" to be released in 2024?',
    status: 'active',
    predictions: 8932,
    volume: '$95.8k'
  },
  {
    id: '3',
    title: 'Next US President Election Winner',
    status: 'resolved',
    predictions: 256789,
    volume: '$1.2M'
  },
  {
    id: '4',
    title: 'Global temperature rise above 1.5°C in 2025?',
    status: 'resolved',
    predictions: 42101,
    volume: '$431.5k'
  }
];

function StatusBadge({ status }: { status: 'active' | 'resolved' }) {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  if (status === 'active') {
    return (
      <span className={`${baseClasses} bg-primary/20 text-primary`}>
        Active
      </span>
    );
  }
  
  return (
    <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>
      Resolved
    </span>
  );
}

export default function RecentMarketsTable() {
  return (
    <section>
      <h2 className="font-display text-2xl font-bold tracking-tight text-text-light dark:text-text-dark px-1 pb-4 pt-2">
        Recent Markets
      </h2>
      <div className="rounded-xl border border-white/10 overflow-hidden bg-surface-dark/50 dark:bg-surface-dark">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-text-muted-dark border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium" scope="col">
                  Market Title
                </th>
                <th className="px-6 py-4 font-medium" scope="col">
                  Status
                </th>
                <th className="px-6 py-4 font-medium text-right" scope="col">
                  Total Predictions
                </th>
                <th className="px-6 py-4 font-medium text-right" scope="col">
                  Volume
                </th>
                <th className="px-6 py-4 font-medium text-center" scope="col">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {marketsData.map((market, index) => (
                <tr 
                  key={market.id}
                  className={`${
                    index < marketsData.length - 1 ? 'border-b border-white/10' : ''
                  } hover:bg-white/5`}
                >
                  <th 
                    className="px-6 py-4 font-medium whitespace-nowrap text-text-dark" 
                    scope="row"
                  >
                    {market.title}
                  </th>
                  <td className="px-6 py-4">
                    <StatusBadge status={market.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {market.predictions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {market.volume}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="font-medium text-secondary hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}