import { vietnamese } from 'vietnamese-js';
import productsData from '../data/adam-store_products.json';

export interface Product {
  id: number;
  name: string;
  description: string;
}

export interface SearchResult extends Product {
  score?: number;
  matches?: any[]; // TODO: Replace with Fuse.FuseResultMatch[] when fuse.js is installed
}

export interface PopularSearch {
  query: string;
  count: number;
  lastSearched: Date;
}

// TODO: Fuse.js configuration for optimal search (when fuse.js is installed)
// const fuseOptions = { ... };
// const fuse = new Fuse(productsData as Product[], fuseOptions);

// Popular searches storage (in a real app, this would be in a database)
let popularSearches: PopularSearch[] = [
  { query: 'áo phông', count: 45, lastSearched: new Date() },
  { query: 'quần jeans', count: 38, lastSearched: new Date() },
  { query: 'áo sơ mi', count: 32, lastSearched: new Date() },
  { query: 'áo khoác', count: 28, lastSearched: new Date() },
  { query: 'áo polo', count: 25, lastSearched: new Date() },
  { query: 'quần short', count: 22, lastSearched: new Date() },
  { query: 'tank top', count: 18, lastSearched: new Date() },
  { query: 'denim', count: 15, lastSearched: new Date() },
];

// Vietnamese product terms with proper diacritics
const vietnameseTerms = [
  'áo', 'quần', 'phông', 'sơ mi', 'khoác', 'polo', 'nỉ', 'denim',
  'jeans', 'short', 'tank', 'top', 'cotton', 'linen', 'heavyweight',
  'slim', 'fit', 'regular', 'relaxed', 'skinny', 'straight', 'barrel',
  'flare', 'bermuda', 'cargo', 'varsity', 'bomber', 'oxford', 'jacquard',
  'viscose', 'chino', 'kẻ', 'sọc', 'thêu', 'họa tiết', 'màu', 'cọ',
  'dệt', 'may', 'viền', 'cổ', 'tay', 'dài', 'ngắn', 'rộng', 'ôm',
  'thời trang', 'phong cách', 'cá tính', 'trẻ trung', 'sang trọng',
  'thoải mái', 'mềm mại', 'co giãn', 'thoáng mát', 'giữ ấm',
  'chống nước', 'chống gió', 'thấm hút', 'bền màu', 'không đều',
  'phối', 'in', 'thủng lỗ', 'xếp li', 'rách', 'limited edition',
  'timeless', 'water repellent', 'boxy', 'oversized'
];

// Create a map of non-diacritic versions to proper Vietnamese
const vietnameseMap = new Map<string, string>();
vietnameseTerms.forEach(term => {
  const withoutTones = vietnamese(term);
  if (withoutTones !== term) {
    vietnameseMap.set(withoutTones.toLowerCase(), term);
  }
});

/**
 * Correct Vietnamese typos using vietnamese-js library
 */
export function correctTypos(query: string): string {
  const words = query.toLowerCase().split(' ');
  const correctedWords = words.map(word => {
    // First, try to find exact match in our Vietnamese terms map
    const exactMatch = vietnameseMap.get(word);
    if (exactMatch) {
      return exactMatch;
    }

    // Remove diacritics and try to find match
    const withoutTones = vietnamese(word);
    const vietnameseMatch = vietnameseMap.get(withoutTones);
    if (vietnameseMatch) {
      return vietnameseMatch;
    }

    // Try partial matching for compound words
    for (const [key, value] of vietnameseMap.entries()) {
      if (word.includes(key) || key.includes(word)) {
        return value;
      }
    }

    return word;
  });
  return correctedWords.join(' ');
}

/**
 * Normalize text for better Vietnamese matching
 */
function normalizeForSearch(text: string): string {
  return vietnamese(text.toLowerCase());
}

/**
 * Check if text matches query (with Vietnamese tone normalization)
 */
function matchesQuery(text: string, query: string): boolean {
  const normalizedText = normalizeForSearch(text);
  const normalizedQuery = normalizeForSearch(query);
  return normalizedText.includes(normalizedQuery) || text.toLowerCase().includes(query.toLowerCase());
}

/**
 * Get autocomplete suggestions based on partial query (Enhanced with vietnamese-js)
 */
export function getAutocompleteSuggestions(query: string, limit: number = 5): string[] {
  if (!query || query.length < 2) return [];

  const correctedQuery = correctTypos(query);
  const suggestions = new Set<string>();

  // Search through products for matches
  (productsData as Product[]).forEach(product => {
    // Add words from product name that start with the query
    const nameWords = product.name.toLowerCase().split(' ');
    nameWords.forEach(word => {
      if (matchesQuery(word, correctedQuery) && word.length > correctedQuery.length) {
        suggestions.add(word);
      }
    });

    // Add the full product name if it contains the query
    if (matchesQuery(product.name, correctedQuery)) {
      suggestions.add(product.name);
    }
  });

  // Add popular searches that match
  popularSearches.forEach(popular => {
    if (matchesQuery(popular.query, correctedQuery)) {
      suggestions.add(popular.query);
    }
  });

  return Array.from(suggestions).slice(0, limit);
}

/**
 * Calculate relevance score for search results
 */
function calculateScore(product: Product, query: string): number {
  const normalizedName = normalizeForSearch(product.name);
  const normalizedDesc = normalizeForSearch(product.description);
  const normalizedQuery = normalizeForSearch(query);

  let score = 0;

  // Exact name match gets highest score
  if (normalizedName === normalizedQuery) score += 1.0;
  // Name starts with query gets high score
  else if (normalizedName.startsWith(normalizedQuery)) score += 0.8;
  // Name contains query gets medium score
  else if (normalizedName.includes(normalizedQuery)) score += 0.6;
  // Description contains query gets lower score
  else if (normalizedDesc.includes(normalizedQuery)) score += 0.3;

  // Boost score for shorter names (more specific matches)
  if (product.name.length < 50) score += 0.1;

  return Math.min(score, 1.0);
}

/**
 * Perform search with typo correction and result highlighting (Enhanced with vietnamese-js)
 */
export function searchProducts(query: string, limit: number = 10): {
  results: SearchResult[];
  correctedQuery?: string;
  totalResults: number;
} {
  if (!query) {
    return { results: [], totalResults: 0 };
  }

  // Track popular searches
  trackPopularSearch(query);

  const originalQuery = query;
  const correctedQuery = correctTypos(query);

  // Enhanced search implementation with Vietnamese support
  const allResults: SearchResult[] = (productsData as Product[])
    .filter(product =>
      matchesQuery(product.name, correctedQuery) ||
      matchesQuery(product.description, correctedQuery)
    )
    .map(product => ({
      ...product,
      score: calculateScore(product, correctedQuery),
      matches: [], // TODO: Implement proper matching when fuse.js is available
    }))
    .sort((a, b) => (b.score || 0) - (a.score || 0)) // Sort by relevance score
    .slice(0, limit);

  return {
    results: allResults,
    correctedQuery: correctedQuery !== originalQuery ? correctedQuery : undefined,
    totalResults: allResults.length,
  };
}

/**
 * Get highlighted text with matches (Enhanced with Vietnamese support)
 */
export function getHighlightedText(text: string, query?: string): string {
  if (!query) return text;

  let highlightedText = text;

  // First, try exact match highlighting
  const exactRegex = new RegExp(`(${query})`, 'gi');
  highlightedText = highlightedText.replace(exactRegex, `<mark class="bg-yellow-200 px-1 rounded">$1</mark>`);

  // Then, try highlighting without Vietnamese tones
  const normalizedQuery = vietnamese(query);
  if (normalizedQuery !== query) {
    const words = text.split(' ');
    const highlightedWords = words.map(word => {
      const normalizedWord = vietnamese(word);
      if (normalizedWord.toLowerCase().includes(normalizedQuery.toLowerCase()) &&
          !word.includes('<mark')) { // Don't double-highlight
        return `<mark class="bg-yellow-200 px-1 rounded">${word}</mark>`;
      }
      return word;
    });
    highlightedText = highlightedWords.join(' ');
  }

  return highlightedText;
}

/**
 * Track popular searches
 */
function trackPopularSearch(query: string): void {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return;
  
  const existingSearch = popularSearches.find(search => 
    search.query.toLowerCase() === normalizedQuery
  );
  
  if (existingSearch) {
    existingSearch.count++;
    existingSearch.lastSearched = new Date();
  } else {
    popularSearches.push({
      query: normalizedQuery,
      count: 1,
      lastSearched: new Date(),
    });
  }
  
  // Keep only top 20 popular searches
  popularSearches = popularSearches
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
}

/**
 * Get popular searches
 */
export function getPopularSearches(limit: number = 8): PopularSearch[] {
  return popularSearches
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Get search suggestions based on query (Enhanced with Vietnamese support)
 */
export function getSearchSuggestions(query: string): {
  autocomplete: string[];
  popular: PopularSearch[];
  correctedQuery?: string;
  vietnameseVariations?: string[];
} {
  const correctedQuery = correctTypos(query);

  // Generate Vietnamese tone variations
  const vietnameseVariations: string[] = [];
  if (query.length >= 2) {
    const withoutTones = vietnamese(query);
    if (withoutTones !== query) {
      // If user typed with tones, suggest without tones
      vietnameseVariations.push(withoutTones);
    } else {
      // If user typed without tones, suggest with tones from our vocabulary
      vietnameseTerms.forEach(term => {
        const termWithoutTones = vietnamese(term);
        if (termWithoutTones.toLowerCase().includes(query.toLowerCase()) &&
            term !== query) {
          vietnameseVariations.push(term);
        }
      });
    }
  }

  return {
    autocomplete: getAutocompleteSuggestions(query, 5),
    popular: getPopularSearches(5),
    correctedQuery: correctedQuery !== query ? correctedQuery : undefined,
    vietnameseVariations: vietnameseVariations.slice(0, 3),
  };
}
