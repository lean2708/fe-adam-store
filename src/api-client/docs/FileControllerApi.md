# FileControllerApi

All URIs are relative to *https://microservices.appf4.io.vn/adamstore*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**delete8**](#delete8) | **DELETE** /v1/admin/files/delete/{id} | |
|[**getAllFiles**](#getallfiles) | **GET** /v1/admin/files/all | |
|[**uploadImage**](#uploadimage) | **POST** /v1/admin/files/upload/images | |

# **delete8**
> ApiResponseVoid delete8()


### Example

```typescript
import {
    FileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FileControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.delete8(
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

# **getAllFiles**
> ApiResponsePageResponseFileResponse getAllFiles()


### Example

```typescript
import {
    FileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FileControllerApi(configuration);

let fileType: 'AVATAR' | 'PRODUCT_IMAGE'; // (default to undefined)
let page: number; //Zero-based page index (0..N) (optional) (default to 0)
let size: number; //The size of the page to be returned (optional) (default to 10)
let sort: Array<string>; //Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. (optional) (default to undefined)

const { status, data } = await apiInstance.getAllFiles(
    fileType,
    page,
    size,
    sort
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **fileType** | [**&#39;AVATAR&#39; | &#39;PRODUCT_IMAGE&#39;**]**Array<&#39;AVATAR&#39; &#124; &#39;PRODUCT_IMAGE&#39;>** |  | defaults to undefined|
| **page** | [**number**] | Zero-based page index (0..N) | (optional) defaults to 0|
| **size** | [**number**] | The size of the page to be returned | (optional) defaults to 10|
| **sort** | **Array&lt;string&gt;** | Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. | (optional) defaults to undefined|


### Return type

**ApiResponsePageResponseFileResponse**

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

# **uploadImage**
> ApiResponseListFileResponse uploadImage()

API upload hình ảnh (có thể tải nhiều ảnh lên)

### Example

```typescript
import {
    FileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FileControllerApi(configuration);

let files: Array<File>; // (default to undefined)

const { status, data } = await apiInstance.uploadImage(
    files
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **files** | **Array&lt;File&gt;** |  | defaults to undefined|


### Return type

**ApiResponseListFileResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

