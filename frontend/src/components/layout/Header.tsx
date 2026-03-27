import { SearchIcon } from '../ui/icons';

export function Header() {
  return (
    <header className="border-b border-gray-200 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Categories */}
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 hidden sm:inline">
              catawiki
            </span>
          </div>
          <button className="text-sm text-gray-600 hover:text-gray-900 hidden md:block">
            Categories ▾
          </button>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="flex-1 max-w-xl mx-2 sm:mx-8 hidden sm:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for brand, model, artist..."
              className="w-full px-4 py-2 pl-10 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
            <div className="absolute left-3 top-2.5">
              <SearchIcon />
            </div>
          </div>
        </div>

        {/* Mobile Search Icon */}
        <button className="sm:hidden p-2 text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </button>

        {/* Right Side Actions */}works
        <div className="flex items-center gap-2 workssm:gap-4">
          <button className="text-sm text-gray-600 hover:text-gray-900 hidden lg:block">
            How it works?
          </button>
          <button className="text-sm text-gray-600 hover:text-gray-900 hidden md:block">
            Help
          </button>
          <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
            Sign in
          </button>
        </div>
      </div>
    </header>
  );
}
