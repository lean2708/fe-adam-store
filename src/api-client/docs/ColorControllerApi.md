# ColorControllerApi

All URIs are relative to *https://microservices.appf4.io.vn/adamstore*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create7**](#create7) | **POST** /v1/admin/colors | |
|[**delete9**](#delete9) | **DELETE** /v1/admin/colors/{id} | |
|[**fetchAll2**](#fetchall2) | **GET** /v1/public/colors | |
|[**update6**](#update6) | **PUT** /v1/admin/colors/{id} | |

# **create7**
> ApiResponseColorResponse create7(colorRequest)


### Example

```typescript
import {
    ColorControllerApi,
    Configuration,
    ColorRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ColorControllerApi(configuration);

let colorRequest: ColorRequest; //

const { status, data } = await apiInstance.create7(
    colorRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **colorRequest** | **ColorRequest**|  | |


### Return type

**ApiResponseColorResponse**

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

# **delete9**
> ApiResponseVoid delete9()


### Example

```typescript
import {
    ColorControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ColorControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.delete9(
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

# **fetchAll2**
> ApiResponsePageResponseColorResponse fetchAll2()


### Example

```typescript
import {
    ColorControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ColorControllerApi(configuration);

let page: number; //Zero-based page index (0..N) (optional) (default to 0)
let size: number; //The size of the page to be returned (optional) (default to 10)
let sort: Array<string>; //Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. (optional) (default to undefined)

const { status, data } = await apiInstance.fetchAll2(
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

**ApiResponsePageResponseColorResponse**

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

# **update6**
> ApiResponseColorResponse update6(colorRequest)


### Example

```typescript
import {
    ColorControllerApi,
    Configuration,
    ColorRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ColorControllerApi(configuration);

let id: number; // (default to undefined)
let colorRequest: ColorRequest; //

const { status, data } = await apiInstance.update6(
    id,
    colorRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **colorRequest** | **ColorRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseColorResponse**

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

