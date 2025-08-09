/**
 * Mock Data Configuration
 * 
 * This file controls whether to use mock data or real API calls
 * during development and testing.
 */

export const MOCK_DATA_CONFIG = {
  // Chat functionality
  CHAT: {
    enabled: true,
    delays: {
      fetchConversations: 800,
      fetchMessages: 500,
      searchMessages: 300,
      searchConversations: 400,
      deleteMessage: 200,
    }
  },
  
  // Other modules can be added here
  PRODUCTS: {
    enabled: false,
    delays: {
      fetchProducts: 600,
      createProduct: 1000,
      updateProduct: 800,
      deleteProduct: 300,
    }
  },
  
  USERS: {
    enabled: false,
    delays: {
      fetchUsers: 700,
      createUser: 900,
      updateUser: 600,
      deleteUser: 400,
    }
  },
  
  ORDERS: {
    enabled: false,
    delays: {
      fetchOrders: 800,
      updateOrderStatus: 500,
      cancelOrder: 300,
    }
  }
};

/**
 * Helper function to simulate API delays
 */
export const simulateApiDelay = async (delayMs: number): Promise<void> => {
  if (process.env.NODE_ENV === 'development') {
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
};

/**
 * Check if mock data is enabled for a specific module
 */
export const isMockEnabled = (module: keyof typeof MOCK_DATA_CONFIG): boolean => {
  return MOCK_DATA_CONFIG[module]?.enabled ?? false;
};

/**
 * Get delay configuration for a specific module and operation
 */
export const getMockDelay = (
  module: keyof typeof MOCK_DATA_CONFIG,
  operation: string
): number => {
  const moduleConfig = MOCK_DATA_CONFIG[module];
  if (!moduleConfig || !moduleConfig.delays) return 500;

  const delays = moduleConfig.delays as Record<string, number>;
  return delays[operation] ?? 500;
};

/**
 * Environment-based mock data control
 * You can override mock settings based on environment variables
 */
export const getEnvironmentMockConfig = () => {
  const envMockEnabled = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
  const envChatMockEnabled = process.env.NEXT_PUBLIC_MOCK_CHAT === 'true';
  
  return {
    globalMockEnabled: envMockEnabled,
    chatMockEnabled: envChatMockEnabled ?? MOCK_DATA_CONFIG.CHAT.enabled,
  };
};

/**
 * Master function to check if mock data should be used for chat
 */
export const shouldUseChatMockData = (): boolean => {
  const envConfig = getEnvironmentMockConfig();
  
  // Environment variables take precedence
  if (envConfig.globalMockEnabled) return true;
  if (envConfig.chatMockEnabled !== undefined) return envConfig.chatMockEnabled;
  
  // Fall back to configuration
  return MOCK_DATA_CONFIG.CHAT.enabled;
};

/**
 * Development utilities
 */
export const mockDataUtils = {
  /**
   * Log mock data usage for debugging
   */
  logMockUsage: (module: string, operation: string, usingMock: boolean) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Mock Data] ${module}.${operation}: ${usingMock ? 'MOCK' : 'REAL'}`);
    }
  },
  
  /**
   * Generate random delay within a range
   */
  randomDelay: (min: number = 200, max: number = 800): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  /**
   * Simulate network errors for testing
   */
  simulateNetworkError: (errorRate: number = 0.1): boolean => {
    return Math.random() < errorRate;
  }
};
