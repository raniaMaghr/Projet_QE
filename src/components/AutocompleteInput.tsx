import React, { useState, useRef, useEffect } from "react";
import { List, X } from "lucide-react";

interface AutocompleteInputProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: string;
}

export default function AutocompleteInput({
  options,
  value,
  onChange,
  placeholder = "Rechercher...",
  label,
  icon,
}: AutocompleteInputProps) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropdown]);

  // Filtrer les options
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes((search || value || "").toLowerCase())
  );

  const handleSelect = (option: string) => {
    onChange(option);
    setSearch(option);
    setShowDropdown(false);
  };

  const handleClear = () => {
    onChange("");
    setSearch("");
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block mb-2 text-gray-700">
          {icon && <span className="mr-1">{icon}</span>}
          {label}
        </label>
      )}
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={search || value}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
              if (options.includes(e.target.value)) {
                onChange(e.target.value);
              } else if (!e.target.value) {
                onChange("");
              }
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder={placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          
          {showDropdown && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                <>
                  <div className="sticky top-0 bg-gray-50 px-4 py-2 border-b border-gray-200 text-gray-600">
                    {filteredOptions.length} résultat{filteredOptions.length > 1 ? 's' : ''}
                  </div>
                  {filteredOptions.map((option, index) => (
                    <button
                      key={`${option}-${index}`}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={`w-full text-left px-4 py-2 hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-0 ${
                        option === value ? 'bg-indigo-50 text-indigo-700' : ''
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-4 py-3 text-gray-500 text-center">
                  Aucun résultat trouvé
                </div>
              )}
            </div>
          )}
        </div>
        
        <button
          type="button"
          onClick={() => {
            setShowDropdown(!showDropdown);
            setSearch("");
          }}
          className="px-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center justify-center"
          title="Voir toutes les options"
        >
          <List className="w-5 h-5" />
        </button>
      </div>

      {value && (
        <div className="mt-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg inline-flex items-center gap-2">
          <span className="text-sm">✓ {value}</span>
          <button
            type="button"
            onClick={handleClear}
            className="text-green-600 hover:text-green-800 ml-2"
            title="Effacer la sélection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
