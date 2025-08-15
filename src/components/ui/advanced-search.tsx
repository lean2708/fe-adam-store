"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'autocomplete' | 'popular' | 'recent';
  count?: number;
}

export interface SearchResult {
  id: number;
  name: string;
  description: string;
  score?: number;
  highlightedName?: string;
  highlightedDescription?: string;
}

interface AdvancedSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  suggestions?: SearchSuggestion[];
  results?: SearchResult[];
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  showResults?: boolean;
  loading?: boolean;
  correctedQuery?: string;
  totalResults?: number;
}

export function AdvancedSearch({
  value,
  onChange,
  onSearch,
  suggestions = [],
  results = [],
  placeholder = "Search products...",
  className,
  showSuggestions = true,
  showResults = false,
  loading = false,
  correctedQuery,
  totalResults = 0,
}: AdvancedSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const showDropdown = isFocused && (
    (showSuggestions && (suggestions.length > 0 || correctedQuery)) ||
    (showResults && results.length > 0)
  );

  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions, results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    const totalItems = showSuggestions ? suggestions.length : results.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < totalItems - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (showSuggestions && suggestions[selectedIndex]) {
            handleSuggestionClick(suggestions[selectedIndex]);
          } else if (showResults && results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
        } else {
          onSearch(value);
        }
        break;
      case 'Escape':
        setIsFocused(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text);
    onSearch(suggestion.text);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleResultClick = (result: SearchResult) => {
    // You can customize this behavior - maybe navigate to product detail
    console.log('Selected product:', result);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleCorrectedQueryClick = () => {
    if (correctedQuery) {
      onChange(correctedQuery);
      onSearch(correctedQuery);
      setIsFocused(false);
    }
  };

  const clearSearch = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'popular':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'recent':
        return <Clock className="h-4 w-4 text-gray-400" />;
      default:
        return <Search className="h-4 w-4 text-gray-400" />;
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score < 0.3) return 'text-green-600';
    if (score < 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay hiding to allow clicks
            setTimeout(() => setIsFocused(false), 150);
          }}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg",
            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "placeholder-gray-500 text-sm transition-all duration-200",
            "hover:border-gray-400",
            loading && "animate-pulse"
          )}
        />
        {value && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {loading && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          {/* Typo Correction */}
          {correctedQuery && (
            <div className="px-4 py-3 border-b border-gray-100 bg-blue-50">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="text-gray-600">
                  Did you mean:{' '}
                  <button
                    onClick={handleCorrectedQueryClick}
                    className="text-blue-600 hover:text-blue-800 font-medium underline"
                  >
                    {correctedQuery}
                  </button>
                  ?
                </span>
              </div>
            </div>
          )}

          {/* Results Header */}
          {showResults && results.length > 0 && (
            <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
              <div className="text-sm text-gray-600">
                Found {totalResults} product{totalResults !== 1 ? 's' : ''}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {showSuggestions && suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                "hover:bg-gray-50",
                selectedIndex === index && "bg-blue-50 border-l-2 border-blue-500"
              )}
            >
              {getSuggestionIcon(suggestion.type)}
              <span className="flex-1 text-sm text-gray-700">
                {suggestion.text}
              </span>
              {suggestion.count && (
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  {suggestion.count}
                </span>
              )}
            </div>
          ))}

          {/* Results */}
          {showResults && results.map((result, index) => (
            <div
              key={result.id}
              onClick={() => handleResultClick(result)}
              className={cn(
                "px-4 py-3 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0",
                "hover:bg-gray-50",
                selectedIndex === index && "bg-blue-50 border-l-2 border-blue-500"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div 
                    className="font-medium text-sm text-gray-900 truncate"
                    dangerouslySetInnerHTML={{ 
                      __html: result.highlightedName || result.name 
                    }}
                  />
                  <div 
                    className="text-xs text-gray-600 mt-1 line-clamp-2"
                    dangerouslySetInnerHTML={{ 
                      __html: result.highlightedDescription || result.description 
                    }}
                  />
                </div>
                {result.score && (
                  <div className="flex items-center gap-1">
                    <span className={cn("text-xs font-mono", getScoreColor(result.score))}>
                      {Math.round((1 - result.score) * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Empty State */}
          {((showSuggestions && suggestions.length === 0) || 
            (showResults && results.length === 0)) && 
            !correctedQuery && (
            <div className="px-4 py-6 text-sm text-gray-500 text-center">
              <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              No {showResults ? 'results' : 'suggestions'} found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
