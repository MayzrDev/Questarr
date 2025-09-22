import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import Header from "./Header";
import SearchBar from "./SearchBar";
import GameGrid from "./GameGrid";
import StatsCard from "./StatsCard";
import { Library, Download, Star, Calendar } from "lucide-react";
import { type Game } from "./GameCard";
import { type GameStatus } from "./StatusBadge";

interface DashboardProps {
  games?: Game[];
  isLoading?: boolean;
}

export default function Dashboard({ games = [], isLoading = false }: DashboardProps) {
  const [activeSection, setActiveSection] = useState("/");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // TODO: remove mock functionality
  const stats = [
    {
      title: "Total Games",
      value: games.length || 156,
      subtitle: "in your library",
      icon: Library,
      trend: { value: 12, label: "from last month" }
    },
    {
      title: "Downloads", 
      value: games.filter(g => g.status === "downloading").length || 3,
      subtitle: "in progress",
      icon: Download
    },
    {
      title: "Wishlist",
      value: games.filter(g => g.status === "wanted").length || 24,
      subtitle: "wanted games", 
      icon: Star,
      trend: { value: -2, label: "from last week" }
    },
    {
      title: "Releases",
      value: 8,
      subtitle: "this month",
      icon: Calendar,
      trend: { value: 5, label: "vs last month" }
    }
  ];

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const handleNavigation = (url: string) => {
    console.log(`Navigate to: ${url}`);
    setActiveSection(url);
  };

  const handleSearch = (query: string) => {
    console.log(`Search: ${query}`);
    setSearchQuery(query);
  };

  const handleFilterToggle = () => {
    console.log("Filter panel toggled");
  };

  const handleRemoveFilter = (filter: string) => {
    console.log(`Remove filter: ${filter}`);
    setActiveFilters(prev => prev.filter(f => f !== filter));
  };

  const handleAddGame = () => {
    console.log("Add game modal would open");
  };

  const handleThemeToggle = () => {
    console.log("Theme toggle");
    setIsDarkMode(!isDarkMode);
  };

  const handleStatusChange = (gameId: string, newStatus: GameStatus) => {
    console.log(`Status change: ${gameId} -> ${newStatus}`);
  };

  const handleViewDetails = (gameId: string) => {
    console.log(`View details: ${gameId}`);
  };

  const getPageTitle = () => {
    switch (activeSection) {
      case "/discover": return "Discover Games";
      case "/library": return "Game Library";
      case "/downloads": return "Downloads";
      case "/calendar": return "Release Calendar";
      case "/trending": return "Trending Games";
      case "/wishlist": return "Wishlist";
      case "/settings": return "Settings";
      default: return "Dashboard";
    }
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full" data-testid="layout-dashboard">
        <AppSidebar activeItem={activeSection} onNavigate={handleNavigation} />
        
        <div className="flex flex-col flex-1">
          <Header
            title={getPageTitle()}
            onAddGame={handleAddGame}
            onToggleTheme={handleThemeToggle}
            isDarkMode={isDarkMode}
            notificationCount={3}
          />
          
          <main className="flex-1 overflow-auto p-6">
            {activeSection === "/" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat) => (
                    <StatsCard
                      key={stat.title}
                      title={stat.title}
                      value={stat.value}
                      subtitle={stat.subtitle}
                      icon={stat.icon}
                      trend={stat.trend}
                    />
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Recent Additions</h2>
                  <SearchBar
                    onSearch={handleSearch}
                    onFilterToggle={handleFilterToggle}
                    activeFilters={activeFilters}
                    onRemoveFilter={handleRemoveFilter}
                    placeholder="Search your library..."
                  />
                  <GameGrid
                    games={games}
                    onStatusChange={handleStatusChange}
                    onViewDetails={handleViewDetails}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            )}
            
            {activeSection !== "/" && (
              <div className="space-y-6">
                <SearchBar
                  onSearch={handleSearch}
                  onFilterToggle={handleFilterToggle}
                  activeFilters={activeFilters}
                  onRemoveFilter={handleRemoveFilter}
                />
                <GameGrid
                  games={games}
                  onStatusChange={handleStatusChange}
                  onViewDetails={handleViewDetails}
                  isLoading={isLoading}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}