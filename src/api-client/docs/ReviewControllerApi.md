# ReviewControllerApi

All URIs are relative to *https://microservices.appf4.io.vn/adamstore*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**_delete**](#_delete) | **DELETE** /v1/private/reviews/{id} | |
|[**create**](#create) | **POST** /v1/private/reviews | Product Review|
|[**update1**](#update1) | **PUT** /v1/private/reviews/{id} | |

# **_delete**
> ApiResponseVoid _delete()


### Example

```typescript
import {
    ReviewControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReviewControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance._delete(
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

# **create**
> ApiResponseReviewResponse create(reviewRequest)

API này dùng để đánh giá sản phẩm

### Example

```typescript
import {
    ReviewControllerApi,
    Configuration,
    ReviewRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ReviewControllerApi(configuration);

let reviewRequest: ReviewRequest; //

const { status, data } = await apiInstance.create(
    reviewRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reviewRequest** | **ReviewRequest**|  | |


### Return type

**ApiResponseReviewResponse**

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

# **update1**
> ApiResponseReviewResponse update1(reviewUpdateRequest)


### Example

```typescript
import {
    ReviewControllerApi,
    Configuration,
    ReviewUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ReviewControllerApi(configuration);

let id: number; // (default to undefined)
let reviewUpdateRequest: ReviewUpdateRequest; //

const { status, data } = await apiInstance.update1(
    id,
    reviewUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reviewUpdateRequest** | **ReviewUpdateRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseReviewResponse**

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

