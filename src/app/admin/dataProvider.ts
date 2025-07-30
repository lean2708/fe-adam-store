// React Admin DataProvider using API client
import { DataProvider } from 'react-admin';
import { Configuration } from '@/api-client/configuration';
import {
    ProductControllerApi,
    CategoryControllerApi,
    UserControllerApi,
    ColorControllerApi,
    PromotionControllerApi
} from '@/api-client';
import { transformToReactAdmin } from './transforms';

// Helper function to transform API responses using React Admin transforms
const transformResponse = (response: any, resource: string, isListRequest = false) => {
    console.log('transformResponse called with:', { response, resource, isListRequest });

    if (isListRequest) {
        // For paginated list requests - API returns ApiResponsePageResponse structure
        let items = [];
        let total = 0;

        // Handle the standard API response structure: { code, message, result: { content: [], totalElements: number } }
        if (response?.result?.content && Array.isArray(response.result.content)) {
            items = response.result.content;
            total = response.result.totalElements || response.result.total || items.length;
        }
        // Fallback: if result is directly an array
        else if (response?.result && Array.isArray(response.result)) {
            items = response.result;
            total = items.length;
        }
        // Fallback: if response is directly an array
        else if (Array.isArray(response)) {
            items = response;
            total = items.length;
        }
        // Last resort: empty array
        else {
            console.warn('No valid array found in response for', resource, ':', response);
            items = [];
            total = 0;
        }

        console.log(`Found ${items.length} items for ${resource}, total: ${total}`);

        const transformedData = items.map((item: any) => {
            try {
                return transformToReactAdmin(resource, item);
            } catch (error) {
                console.error('Error transforming item:', item, error);
                // Return a basic fallback item
                return {
                    id: item?.id || Math.random(),
                    name: item?.name || `${resource} item`,
                    ...item
                };
            }
        });

        return {
            data: transformedData,
            total: total
        };
    } else {
        // For single item requests - API returns ApiResponse structure
        let item = null;

        // Handle the standard API response structure: { code, message, result: {...} }
        if (response?.result) {
            item = response.result;
        } else {
            item = response;
        }

        try {
            const transformedData = transformToReactAdmin(resource, item);
            return {
                data: transformedData
            };
        } catch (error) {
            console.error('Error transforming single item:', item, error);
            // Return a basic fallback item
            return {
                data: {
                    id: item?.id || Math.random(),
                    name: item?.name || `${resource} item`,
                    ...item
                }
            };
        }
    }
};

// Create API instances
const createApiInstances = (config: Configuration) => ({
    productApi: new ProductControllerApi(config),
    categoryApi: new CategoryControllerApi(config),
    userApi: new UserControllerApi(config),
    colorApi: new ColorControllerApi(config),
    promotionApi: new PromotionControllerApi(config),
});

// Create the main dataProvider
export const createDataProvider = (config: Configuration): DataProvider => {
    const apis = createApiInstances(config);

    return {
        getList: async (resource, params) => {
            const page = params.pagination?.page || 1;
            const perPage = params.pagination?.perPage || 10;
            const field = params.sort?.field;
            const order = params.sort?.order;

            try {
                let response;
                const pageIndex = page - 1; // Convert to 0-based indexing

                switch (resource) {
                    case 'products':
                        response = await apis.productApi.fetchAllProductsForAdmin();
                        break;
                    case 'categories':
                        response = await apis.categoryApi.fetchAllCategoriesForAdmin();
                        break;
                    case 'users':
                    case 'customers':
                        response = await apis.userApi.fetchAllForAdmin();
                        break;
                    case 'colors':
                        response = await apis.colorApi.fetchAll2();
                        break;
                    case 'promotions':
                        response = await apis.promotionApi.fetchAll9();
                        break;
                    default:
                        // Return empty data for unknown resources
                        return { data: [], total: 0 };
                }

                console.log(`API response for ${resource}:`, response.data);
                return transformResponse(response.data, resource, true);
            } catch (error) {
                console.error(`Error fetching ${resource}:`, error);
                // Return empty data instead of throwing
                return { data: [], total: 0 };
            }
        },

        getOne: async (resource, params) => {
            try {
                let response;
                const id = Number(params.id);

                switch (resource) {
                    case 'products':
                        response = await apis.productApi.fetchDetailById({ id });
                        break;
                    case 'users':
                    case 'customers':
                        response = await apis.userApi.fetchById2({ id });
                        break;
                    case 'promotions':
                        response = await apis.promotionApi.fetchById4({ id });
                        break;
                    default:
                        // Return mock data for unsupported resources
                        return {
                            data: {
                                id: params.id,
                                name: `${resource} ${params.id}`,
                                ...transformToReactAdmin(resource, { id: params.id })
                            }
                        };
                }

                return transformResponse(response.data, resource, false);
            } catch (error) {
                console.error(`Error fetching ${resource} with id ${params.id}:`, error);
                // Return mock data instead of throwing
                return {
                    data: {
                        id: params.id,
                        name: `${resource} ${params.id}`,
                        ...transformToReactAdmin(resource, { id: params.id })
                    }
                };
            }
        },

        getMany: async (resource, params) => {
            // Return empty data for now
            return { data: [] };
        },

        getManyReference: async (resource, params) => {
            // Return empty data for now
            return { data: [], total: 0 };
        },

        create: async (resource, params) => {
            // For demo purposes, return mock created data
            const mockData = {
                id: Date.now(), // Use timestamp as mock ID
                ...params.data,
                ...transformToReactAdmin(resource, params.data)
            };

            return { data: mockData };
        },

        update: async (resource, params) => {
            // For demo purposes, return mock updated data
            const mockData = {
                ...params.data,
                id: params.id,
                ...transformToReactAdmin(resource, params.data)
            };

            return { data: mockData };
        },

        updateMany: async (resource, params) => {
            // Return the IDs as if they were updated
            return { data: params.ids };
        },

        delete: async (resource, params) => {
            // For demo purposes, just return the deleted ID
            return { data: params.previousData || { id: params.id } };
        },

        deleteMany: async (resource, params) => {
            // Return the IDs as if they were deleted
            return { data: params.ids };
        },
    };
};
