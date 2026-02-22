export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 shadow-lg text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          🏦 Modern Banking
        </h1>
        <div>
          <span className="text-sm opacity-80">Welcome, Admin</span>
        </div>
      </div>
    </nav>
  )
}
