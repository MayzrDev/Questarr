import Header from '../Header'

export default function HeaderExample() {
  const handleAddGame = () => {
    console.log("Add game clicked");
  };

  const handleToggleTheme = () => {
    console.log("Theme toggle clicked");
  };

  return (
    <div className="w-full">
      <Header
        title="Game Library"
        onAddGame={handleAddGame}
        onToggleTheme={handleToggleTheme}
        notificationCount={3}
        isDarkMode={true}
      />
    </div>
  )
}