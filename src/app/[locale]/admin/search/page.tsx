"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdvancedSearch, SearchSuggestion, SearchResult } from '@/components/ui/advanced-search';
import { Search, TrendingUp, Clock, Zap, BarChart3, Target } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  searchProducts,
  getAutocompleteSuggestions,
  getPopularSearches,
  getHighlightedText
} from '@/lib/search';

// Mock data - replace with actual search functions when fuse.js is available
const mockProducts = [
  { id: 1, name: "ÁO PHÔNG HEAVYWEIGHT MAY VIỀN", description: "Áo phông chất liệu heavyweight, may viền tỉ mỉ, form rộng thoải mái, phù hợp đi chơi hoặc mặc hằng ngày." },
  { id: 2, name: "ÁO NỈ PHỐI KẺ SỌC KHÁC MÀU", description: "Áo nỉ thiết kế phối kẻ sọc khác màu độc đáo, chất vải mềm mại giữ ấm tốt, phù hợp cho những ngày se lạnh." },
  { id: 3, name: "QUẦN JEANS SLIM FIT TIMELESS", description: "Quần jeans slim fit thiết kế tối giản, phù hợp mặc hằng ngày, giữ form và bền màu theo thời gian." },
];

const mockPopularSearches = [
  { query: 'áo phông', count: 45 },
  { query: 'quần jeans', count: 38 },
  { query: 'áo sơ mi', count: 32 },
  { query: 'áo khoác', count: 28 },
  { query: 'áo polo', count: 25 },
];

// Helper function to convert suggestions to the expected format
const formatSuggestions = (query: string): SearchSuggestion[] => {
  const autocompleteSuggestions = getAutocompleteSuggestions(query, 3);
  const popularSearches = getPopularSearches(3);

  const suggestions: SearchSuggestion[] = [];

  // Add autocomplete suggestions
  autocompleteSuggestions.forEach((text, index) => {
    suggestions.push({
      id: `auto-${index}`,
      text,
      type: 'autocomplete',
    });
  });

  // Add popular searches
  popularSearches.forEach((popular, index) => {
    if (popular.query.toLowerCase().includes(query.toLowerCase())) {
      suggestions.push({
        id: `popular-${index}`,
        text: popular.query,
        type: 'popular',
        count: popular.count,
      });
    }
  });

  return suggestions.slice(0, 5);
};

export default function AdminSearchPage() {
  const t = useTranslations('Admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [correctedQuery, setCorrectedQuery] = useState<string>();
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Get suggestions when query changes
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const newSuggestions = formatSuggestions(searchQuery);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setShowResults(true);

    // Add to search history
    setSearchHistory(prev => {
      const newHistory = [query, ...prev.filter(h => h !== query)].slice(0, 10);
      return newHistory;
    });

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const { results, correctedQuery: corrected, totalResults: total } = searchProducts(query);

      // Add highlighting to results
      const highlightedResults = results.map(result => ({
        ...result,
        highlightedName: getHighlightedText(result.name, query),
        highlightedDescription: getHighlightedText(result.description, query),
      }));

      setSearchResults(highlightedResults);
      setCorrectedQuery(corrected);
      setTotalResults(total);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setShowResults(false);
    setSearchResults([]);
    setTotalResults(0);
    setCorrectedQuery(undefined);
  };

  const popularSearches = useMemo(() => getPopularSearches(8), []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="admin-page-container space-y-6 mt-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Search className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Product Search</h1>
          </div>
          <p className="text-gray-600">
            Advanced search with autocomplete, typo correction, and highlighted results
          </p>
        </div>

        {/* Search Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Search Products
            </CardTitle>
            <CardDescription>
              Search through all products with intelligent suggestions and typo correction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AdvancedSearch
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              suggestions={suggestions}
              results={showResults ? searchResults : []}
              placeholder="Search for products by name or description..."
              showSuggestions={!showResults}
              showResults={showResults}
              loading={loading}
              correctedQuery={correctedQuery}
              totalResults={totalResults}
              className="w-full"
            />

            {showResults && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {totalResults > 0 ? (
                    <>Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{searchQuery}"</>
                  ) : (
                    <>No results found for "{searchQuery}"</>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={clearResults}>
                  Clear Results
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        {showResults && searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Search Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 
                          className="font-semibold text-gray-900 mb-2"
                          dangerouslySetInnerHTML={{ __html: result.highlightedName || result.name }}
                        />
                        <p 
                          className="text-sm text-gray-600"
                          dangerouslySetInnerHTML={{ __html: result.highlightedDescription || result.description }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">ID: {result.id}</Badge>
                        {result.score && (
                          <Badge variant="outline">
                            {Math.round((1 - result.score) * 100)}% match
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Popular Searches & Search History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Popular Searches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                Popular Searches
              </CardTitle>
              <CardDescription>
                Most searched terms by users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {popularSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSearchQuery(search.query);
                      handleSearch(search.query);
                    }}
                  >
                    <span className="text-sm text-gray-700">{search.query}</span>
                    <Badge variant="secondary" className="text-xs">
                      {search.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Search History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                Recent Searches
              </CardTitle>
              <CardDescription>
                Your recent search queries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {searchHistory.length > 0 ? (
                  searchHistory.map((query, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSearchQuery(query);
                        handleSearch(query);
                      }}
                    >
                      <span className="text-sm text-gray-700">{query}</span>
                      <Clock className="h-3 w-3 text-gray-400" />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recent searches
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Features Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Search Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Search className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm text-gray-900">Autocomplete</h3>
                <p className="text-xs text-gray-600 mt-1">Smart suggestions as you type</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm text-gray-900">Popular Searches</h3>
                <p className="text-xs text-gray-600 mt-1">See what others are searching</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Zap className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm text-gray-900">Typo Correction</h3>
                <p className="text-xs text-gray-600 mt-1">Automatic spelling suggestions</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm text-gray-900">Highlighted Results</h3>
                <p className="text-xs text-gray-600 mt-1">See matching terms highlighted</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
