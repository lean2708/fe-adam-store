# PromotionControllerApi

All URIs are relative to *https://microservices.appf4.io.vn/adamstore*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create5**](#create5) | **POST** /v1/admin/promotions | |
|[**delete3**](#delete3) | **DELETE** /v1/admin/promotions/{id} | Soft delete Promotion|
|[**fetchAll9**](#fetchall9) | **GET** /v1/admin/promotions | Fetch All Promotions For Admin|
|[**fetchById4**](#fetchbyid4) | **GET** /v1/private/promotions/{id} | |
|[**restore1**](#restore1) | **PATCH** /v1/admin/promotions/{id}/restore | Restore Promotion|
|[**update4**](#update4) | **PUT** /v1/admin/promotions/{id} | |

# **create5**
> ApiResponsePromotionResponse create5(promotionRequest)


### Example

```typescript
import {
    PromotionControllerApi,
    Configuration,
    PromotionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PromotionControllerApi(configuration);

let promotionRequest: PromotionRequest; //

const { status, data } = await apiInstance.create5(
    promotionRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promotionRequest** | **PromotionRequest**|  | |


### Return type

**ApiResponsePromotionResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete3**
> ApiResponseVoid delete3()


### Example

```typescript
import {
    PromotionControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromotionControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.delete3(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseVoid**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **fetchAll9**
> ApiResponsePageResponsePromotionResponse fetchAll9()


### Example

```typescript
import {
    PromotionControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromotionControllerApi(configuration);

let page: number; //Zero-based page index (0..N) (optional) (default to 0)
let size: number; //The size of the page to be returned (optional) (default to 10)
let sort: Array<string>; //Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. (optional) (default to undefined)

const { status, data } = await apiInstance.fetchAll9(
    page,
    size,
    sort
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Zero-based page index (0..N) | (optional) defaults to 0|
| **size** | [**number**] | The size of the page to be returned | (optional) defaults to 10|
| **sort** | **Array&lt;string&gt;** | Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. | (optional) defaults to undefined|


### Return type

**ApiResponsePageResponsePromotionResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **fetchById4**
> ApiResponsePromotionResponse fetchById4()


### Example

```typescript
import {
    PromotionControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromotionControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.fetchById4(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponsePromotionResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **restore1**
> ApiResponsePromotionResponse restore1()

Api này để khôi phục Promotion

### Example

```typescript
import {
    PromotionControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromotionControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.restore1(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponsePromotionResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update4**
> ApiResponsePromotionResponse update4(promotionUpdateRequest)


### Example

```typescript
import {
    PromotionControllerApi,
    Configuration,
    PromotionUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PromotionControllerApi(configuration);

let id: number; // (default to undefined)
let promotionUpdateRequest: PromotionUpdateRequest; //

const { status, data } = await apiInstance.update4(
    id,
    promotionUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promotionUpdateRequest** | **PromotionUpdateRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponsePromotionResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

