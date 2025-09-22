import StatsCard from '../StatsCard'
import { Library, Download, Star, Calendar } from "lucide-react"

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <StatsCard
        title="Total Games"
        value={156}
        subtitle="in your library"
        icon={Library}
        trend={{ value: 12, label: "from last month" }}
      />
      <StatsCard
        title="Downloads"
        value={3}
        subtitle="in progress"
        icon={Download}
      />
      <StatsCard
        title="Wishlist"
        value={24}
        subtitle="wanted games"
        icon={Star}
        trend={{ value: -2, label: "from last week" }}
      />
      <StatsCard
        title="Releases"
        value={8}
        subtitle="this month"
        icon={Calendar}
        trend={{ value: 5, label: "vs last month" }}
      />
    </div>
  )
}