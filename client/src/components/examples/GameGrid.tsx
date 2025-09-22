import GameGrid from '../GameGrid'
import mysticRealmsImage from "@assets/generated_images/Action_RPG_game_cover_e54fe41c.png"
import cyberEvolutionImage from "@assets/generated_images/Sci-fi_cyberpunk_game_cover_2aab877d.png"
import speedLegendsImage from "@assets/generated_images/Racing_game_cover_art_7dbdc440.png"
import shadowValleyImage from "@assets/generated_images/Horror_survival_game_cover_1546d7d7.png"

export default function GameGridExample() {
  // TODO: remove mock functionality
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
    }
  ];

  const handleStatusChange = (gameId: string, newStatus: any) => {
    console.log(`Status changed for ${gameId} to ${newStatus}`);
  };

  const handleViewDetails = (gameId: string) => {
    console.log(`View details for ${gameId}`);
  };

  return (
    <div className="p-4">
      <GameGrid 
        games={mockGames}
        onStatusChange={handleStatusChange}
        onViewDetails={handleViewDetails}
      />
    </div>
  )
}