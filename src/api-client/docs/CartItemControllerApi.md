# CartItemControllerApi

All URIs are relative to *https://microservices.appf4.io.vn/adamstore*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create2**](#create2) | **POST** /v1/private/cart-items | |
|[**delete1**](#delete1) | **DELETE** /v1/private/cart-items/{id} | |
|[**fetchById6**](#fetchbyid6) | **GET** /v1/private/cart-items/{id} | |
|[**update2**](#update2) | **PUT** /v1/private/cart-items/{id} | |

# **create2**
> ApiResponseCartItemResponse create2(cartItemRequest)

API thêm sản phẩm vào giỏ hàng

### Example

```typescript
import {
    CartItemControllerApi,
    Configuration,
    CartItemRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CartItemControllerApi(configuration);

let cartItemRequest: CartItemRequest; //

const { status, data } = await apiInstance.create2(
    cartItemRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **cartItemRequest** | **CartItemRequest**|  | |


### Return type

**ApiResponseCartItemResponse**

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

# **delete1**
> ApiResponseVoid delete1()


### Example

```typescript
import {
    CartItemControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartItemControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.delete1(
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

# **fetchById6**
> ApiResponseCartItemResponse fetchById6()


### Example

```typescript
import {
    CartItemControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartItemControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.fetchById6(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseCartItemResponse**

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

# **update2**
> ApiResponseCartItemResponse update2(cartItemUpdateRequest)


### Example

```typescript
import {
    CartItemControllerApi,
    Configuration,
    CartItemUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CartItemControllerApi(configuration);

let id: number; // (default to undefined)
let cartItemUpdateRequest: CartItemUpdateRequest; //

const { status, data } = await apiInstance.update2(
    id,
    cartItemUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **cartItemUpdateRequest** | **CartItemUpdateRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseCartItemResponse**

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

