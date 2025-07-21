# ProductVariantControllerApi

All URIs are relative to *https://microservices.appf4.io.vn/adamstore*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**delete5**](#delete5) | **DELETE** /v1/admin/product-variants/{id} | Delete product variant|
|[**findByProductAndColorAndSize**](#findbyproductandcolorandsize) | **GET** /v1/private/product-variants/{productId}/{colorId}/{sizeId} | Fetch product variant by product, color, size|
|[**restore3**](#restore3) | **PATCH** /v1/admin/product-variants/{id}/restore | Restore product variant|
|[**updatePriceAndQuantity**](#updatepriceandquantity) | **PUT** /v1/admin/product-variants/{id} | Update price and quantity for a product variant|

# **delete5**
> ApiResponseVoid delete5()

API để xóa ProductVariant

### Example

```typescript
import {
    ProductVariantControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductVariantControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.delete5(
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

# **findByProductAndColorAndSize**
> ApiResponseProductVariantResponse findByProductAndColorAndSize()

API để tìm kiếm Product-Variant theo product, color, size

### Example

```typescript
import {
    ProductVariantControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductVariantControllerApi(configuration);

let productId: number; // (default to undefined)
let colorId: number; // (default to undefined)
let sizeId: number; // (default to undefined)

const { status, data } = await apiInstance.findByProductAndColorAndSize(
    productId,
    colorId,
    sizeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **productId** | [**number**] |  | defaults to undefined|
| **colorId** | [**number**] |  | defaults to undefined|
| **sizeId** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseProductVariantResponse**

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

# **restore3**
> ApiResponseProductVariantResponse restore3()

API để khôi phục ProductVariant

### Example

```typescript
import {
    ProductVariantControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductVariantControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.restore3(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseProductVariantResponse**

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

# **updatePriceAndQuantity**
> ApiResponseProductVariantResponse updatePriceAndQuantity(variantUpdateRequest)

API để cập nhật giá và số lượng cho ProductVariant

### Example

```typescript
import {
    ProductVariantControllerApi,
    Configuration,
    VariantUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductVariantControllerApi(configuration);

let id: number; // (default to undefined)
let variantUpdateRequest: VariantUpdateRequest; //

const { status, data } = await apiInstance.updatePriceAndQuantity(
    id,
    variantUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **variantUpdateRequest** | **VariantUpdateRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseProductVariantResponse**

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

