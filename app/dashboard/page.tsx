import Sidebar from '../../components/Sidebar';
import StatsCards from '../../components/StatsCards';
import RecentMarketsTable from '../../components/RecentMarketsTable';
import ConnectWallet from '../../components/ConnectWallet';

export default function Dashboard() {
  return (
    <div className="relative flex min-h-screen w-full">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <div className="flex flex-col gap-1">
                <h1 className="font-display text-4xl font-bold tracking-tighter text-text-light dark:text-text-dark">
                  Dashboard
                </h1>
                <p className="text-base font-normal text-text-light/70 dark:text-text-dark/70">
                  Welcome back, Developer!
                </p>
              </div>
              <div className="flex items-center gap-3">
                <ConnectWallet />
                <a 
                  href="/create-market"
                  className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-secondary text-background-dark text-sm font-bold shadow-lg shadow-secondary/20 hover:brightness-110 transition-all"
                >
                  <span className="material-symbols-outlined">add</span>
                  <span className="truncate">Create Market</span>
                </a>
              </div>
            </header>

            {/* Stats Cards */}
            <StatsCards />

            {/* Recent Markets Table */}
            <RecentMarketsTable />
          </div>
        </div>
      </main>
    </div>
  );
}