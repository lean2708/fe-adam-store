# AddressControllerApi

All URIs are relative to *https://microservices.appf4.io.vn/adamstore*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create3**](#create3) | **POST** /v1/private/addresses | Create New Address|
|[**delete12**](#delete12) | **DELETE** /v1/admin/addresses/{id} | Soft Delete Address|
|[**fetchAllForAdmin1**](#fetchallforadmin1) | **GET** /v1/admin/addresses | Fetch All Addresses For Admin|
|[**fetchById7**](#fetchbyid7) | **GET** /v1/private/addresses/{id} | |
|[**hideAddress**](#hideaddress) | **PATCH** /v1/private/addresses/{id}/hide | Hide User Address|
|[**restore6**](#restore6) | **PATCH** /v1/admin/addresses/{id}/restore | Restore Address|
|[**update3**](#update3) | **PUT** /v1/private/addresses/{id} | |

# **create3**
> ApiResponseAddressResponse create3(addressRequest)

Api dùng để tạo địa chỉ mới

### Example

```typescript
import {
    AddressControllerApi,
    Configuration,
    AddressRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AddressControllerApi(configuration);

let addressRequest: AddressRequest; //

const { status, data } = await apiInstance.create3(
    addressRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **addressRequest** | **AddressRequest**|  | |


### Return type

**ApiResponseAddressResponse**

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

# **delete12**
> ApiResponseVoid delete12()

API để Admin xóa mềm address

### Example

```typescript
import {
    AddressControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AddressControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.delete12(
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

# **fetchAllForAdmin1**
> ApiResponsePageResponseAddressResponse fetchAllForAdmin1()

API này để lấy tất cả address bên trong hệ thống (page bắt đầu từ 0)

### Example

```typescript
import {
    AddressControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AddressControllerApi(configuration);

let page: number; //Zero-based page index (0..N) (optional) (default to 0)
let size: number; //The size of the page to be returned (optional) (default to 10)
let sort: Array<string>; //Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. (optional) (default to undefined)

const { status, data } = await apiInstance.fetchAllForAdmin1(
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

**ApiResponsePageResponseAddressResponse**

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

# **fetchById7**
> ApiResponseAddressResponse fetchById7()


### Example

```typescript
import {
    AddressControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AddressControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.fetchById7(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseAddressResponse**

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

# **hideAddress**
> ApiResponseVoid hideAddress()

Api này cho phép user xóa địa chỉ của chính user đó trong giao diện người dùng

### Example

```typescript
import {
    AddressControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AddressControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.hideAddress(
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

# **restore6**
> ApiResponseAddressResponse restore6()

Api này để khôi phục Address

### Example

```typescript
import {
    AddressControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AddressControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.restore6(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseAddressResponse**

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

# **update3**
> ApiResponseAddressResponse update3(addressRequest)

API để update địa chỉ

### Example

```typescript
import {
    AddressControllerApi,
    Configuration,
    AddressRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AddressControllerApi(configuration);

let id: number; // (default to undefined)
let addressRequest: AddressRequest; //

const { status, data } = await apiInstance.update3(
    id,
    addressRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **addressRequest** | **AddressRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseAddressResponse**

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

