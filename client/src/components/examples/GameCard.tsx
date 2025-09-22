import GameCard from '../GameCard'
import mysticRealmsImage from "@assets/generated_images/Action_RPG_game_cover_e54fe41c.png"

export default function GameCardExample() {
  const mockGame = {
    id: "1",
    title: "Mystic Realms: Shadow of the Ancients",
    coverUrl: mysticRealmsImage,
    releaseDate: "2024-03-15",
    rating: 8.5,
    platform: ["PC", "PlayStation 5", "Xbox Series X"],
    status: "wanted" as const,
    genre: ["Action", "RPG", "Fantasy"]
  };

  const handleStatusChange = (gameId: string, newStatus: any) => {
    console.log(`Status changed for ${gameId} to ${newStatus}`);
  };

  const handleViewDetails = (gameId: string) => {
    console.log(`View details for ${gameId}`);
  };

  return (
    <div className="w-64 p-4">
      <GameCard 
        game={mockGame}
        onStatusChange={handleStatusChange}
        onViewDetails={handleViewDetails}
      />
    </div>
  )
}