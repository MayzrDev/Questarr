import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/components/Dashboard";
import NotFound from "@/pages/not-found";
import mysticRealmsImage from "@assets/generated_images/Action_RPG_game_cover_e54fe41c.png";
import cyberEvolutionImage from "@assets/generated_images/Sci-fi_cyberpunk_game_cover_2aab877d.png";
import speedLegendsImage from "@assets/generated_images/Racing_game_cover_art_7dbdc440.png";
import shadowValleyImage from "@assets/generated_images/Horror_survival_game_cover_1546d7d7.png";

// TODO: remove mock functionality - replace with real API data
const mockGames = [
  {
    id: "1",
    title: "Mystic Realms: Shadow of the Ancients",
    coverUrl: mysticRealmsImage,
    releaseDate: "2024-03-15",
    rating: 8.5,
    platform: ["PC", "PlayStation 5"],
    status: "wanted" as const,
    genre: ["Action", "RPG"]
  },
  {
    id: "2",
    title: "Cyber Evolution: Neon Wars",
    coverUrl: cyberEvolutionImage,
    releaseDate: "2024-01-20",
    rating: 9.2,
    platform: ["PC", "Xbox Series X"],
    status: "owned" as const,
    genre: ["Sci-Fi", "Shooter"]
  },
  {
    id: "3",
    title: "Speed Legends Championship",
    coverUrl: speedLegendsImage,
    releaseDate: "2023-11-08",
    rating: 7.8,
    platform: ["PC", "PlayStation 5", "Xbox Series X"],
    status: "completed" as const,
    genre: ["Racing", "Sports"]
  },
  {
    id: "4",
    title: "Shadow Valley: Horror Awakening",
    coverUrl: shadowValleyImage,
    releaseDate: "2024-02-14",
    rating: 8.1,
    platform: ["PC"],
    status: "downloading" as const,
    genre: ["Horror", "Survival"]
  },
  {
    id: "5",
    title: "Mystic Realms II: Return of the Ancient Gods",
    coverUrl: mysticRealmsImage,
    releaseDate: "2024-06-15",
    rating: 9.0,
    platform: ["PC", "PlayStation 5", "Xbox Series X"],
    status: "wanted" as const,
    genre: ["Action", "RPG", "Fantasy"]
  },
  {
    id: "6",
    title: "Cyber Evolution: Quantum Protocol",
    coverUrl: cyberEvolutionImage,
    releaseDate: "2024-04-10",
    rating: 8.8,
    platform: ["PC"],
    status: "owned" as const,
    genre: ["Sci-Fi", "Strategy"]
  }
];

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Dashboard games={mockGames} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
