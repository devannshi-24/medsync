import { FiSearch,FiX } from "react-icons/fi";

function PageHeader({
  title,
  subtitle,
  showSearch = false,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange = () => {},
  actionButton = null,
  resultCount = null,
}) {
  return (
    <div className="px-12 py-5 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        {/* Left Side */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-500 mt-1">
              {subtitle}
            </p>
          )}
          {searchValue && resultCount !== null && (
            <p className="text-sm text-blue-500 mt-1 font-medium">
              Showing {resultCount.filtered} of {resultCount.total} results
            </p>
          )}
        </div>
        {/* Right Side */}
        <div className="flex items-center gap-4">
          {showSearch && (
            <div className="relative">
              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-72 border rounded-xl pl-11 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* ✕ clear button — only visible when something is typed */}
              {searchValue && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
          {actionButton}

        </div>

      </div>

    </div>
  );
}

export default PageHeader;