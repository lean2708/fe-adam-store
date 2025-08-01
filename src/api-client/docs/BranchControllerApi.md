# BranchControllerApi

All URIs are relative to *https://microservices.appf4.io.vn/adamstore*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create9**](#create9) | **POST** /v1/admin/branches | |
|[**delete11**](#delete11) | **DELETE** /v1/admin/branches/{id} | Soft Delete Branch|
|[**fetchAll4**](#fetchall4) | **GET** /v1/public/branches | Fetch All Branches For User|
|[**fetchAllBranchesForAdmin**](#fetchallbranchesforadmin) | **GET** /v1/admin/branches | Fetch All Branches For Admin|
|[**fetchById**](#fetchbyid) | **GET** /v1/public/branches/{id} | |
|[**restore5**](#restore5) | **PATCH** /v1/admin/branches/{id}/restore | Restore Branch|
|[**update8**](#update8) | **PUT** /v1/admin/branches/{id} | |

# **create9**
> ApiResponseBranchResponse create9(branchRequest)


### Example

```typescript
import {
    BranchControllerApi,
    Configuration,
    BranchRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BranchControllerApi(configuration);

let branchRequest: BranchRequest; //

const { status, data } = await apiInstance.create9(
    branchRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **branchRequest** | **BranchRequest**|  | |


### Return type

**ApiResponseBranchResponse**

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

# **delete11**
> ApiResponseVoid delete11()

Api này để soft delete branch

### Example

```typescript
import {
    BranchControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BranchControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.delete11(
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

# **fetchAll4**
> ApiResponsePageResponseBranchResponse fetchAll4()

API để lấy tất cả Branch (ACTIVE) cho user

### Example

```typescript
import {
    BranchControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BranchControllerApi(configuration);

let page: number; //Zero-based page index (0..N) (optional) (default to 0)
let size: number; //The size of the page to be returned (optional) (default to 10)
let sort: Array<string>; //Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. (optional) (default to undefined)

const { status, data } = await apiInstance.fetchAll4(
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

**ApiResponsePageResponseBranchResponse**

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

# **fetchAllBranchesForAdmin**
> ApiResponsePageResponseBranchResponse fetchAllBranchesForAdmin()

API này để lấy tất cả Branch (cả ACTIVE và INACTIVE) cho admin quản lý

### Example

```typescript
import {
    BranchControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BranchControllerApi(configuration);

let page: number; //Zero-based page index (0..N) (optional) (default to 0)
let size: number; //The size of the page to be returned (optional) (default to 10)
let sort: Array<string>; //Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. (optional) (default to undefined)

const { status, data } = await apiInstance.fetchAllBranchesForAdmin(
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

**ApiResponsePageResponseBranchResponse**

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

# **fetchById**
> ApiResponseBranchResponse fetchById()


### Example

```typescript
import {
    BranchControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BranchControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.fetchById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseBranchResponse**

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

# **restore5**
> ApiResponseBranchResponse restore5()

Api này để khôi phục Branch

### Example

```typescript
import {
    BranchControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BranchControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.restore5(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseBranchResponse**

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

# **update8**
> ApiResponseBranchResponse update8(branchUpdateRequest)


### Example

```typescript
import {
    BranchControllerApi,
    Configuration,
    BranchUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BranchControllerApi(configuration);

let id: number; // (default to undefined)
let branchUpdateRequest: BranchUpdateRequest; //

const { status, data } = await apiInstance.update8(
    id,
    branchUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **branchUpdateRequest** | **BranchUpdateRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseBranchResponse**

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

