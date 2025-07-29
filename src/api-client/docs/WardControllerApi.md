# WardControllerApi

All URIs are relative to *https://microservices.appf4.io.vn/adamstore*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**fetchAll5**](#fetchall5) | **GET** /v1/private/wards | |
|[**fetchById1**](#fetchbyid1) | **GET** /v1/private/wards/{code} | |

# **fetchAll5**
> ApiResponsePageResponseWardResponse fetchAll5()


### Example

```typescript
import {
    WardControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WardControllerApi(configuration);

let page: number; //Zero-based page index (0..N) (optional) (default to 0)
let size: number; //The size of the page to be returned (optional) (default to 10)
let sort: Array<string>; //Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. (optional) (default to undefined)

const { status, data } = await apiInstance.fetchAll5(
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

**ApiResponsePageResponseWardResponse**

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

# **fetchById1**
> ApiResponseWardResponse fetchById1()


### Example

```typescript
import {
    WardControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WardControllerApi(configuration);

let code: string; // (default to undefined)

const { status, data } = await apiInstance.fetchById1(
    code
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **code** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseWardResponse**

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

