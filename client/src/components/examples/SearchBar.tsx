import SearchBar from '../SearchBar'

export default function SearchBarExample() {
  const mockFilters = ["Action", "RPG", "PC", "2024"];

  const handleSearch = (query: string) => {
    console.log(`Search: ${query}`);
  };

  const handleFilterToggle = () => {
    console.log("Filter panel toggled");
  };

  const handleRemoveFilter = (filter: string) => {
    console.log(`Remove filter: ${filter}`);
  };

  return (
    <div className="p-4 max-w-2xl">
      <SearchBar
        onSearch={handleSearch}
        onFilterToggle={handleFilterToggle}
        activeFilters={mockFilters}
        onRemoveFilter={handleRemoveFilter}
      />
    </div>
  )
}