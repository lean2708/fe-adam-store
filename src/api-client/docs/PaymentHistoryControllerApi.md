# PaymentHistoryControllerApi

All URIs are relative to *https://microservices.appf4.io.vn/adamstore*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**delete6**](#delete6) | **DELETE** /v1/admin/payment-histories/{id} | |
|[**searchPaymentHistories**](#searchpaymenthistories) | **GET** /v1/admin/payment-histories/search | |

# **delete6**
> ApiResponseVoid delete6()


### Example

```typescript
import {
    PaymentHistoryControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentHistoryControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.delete6(
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

# **searchPaymentHistories**
> ApiResponsePageResponsePaymentHistoryResponse searchPaymentHistories()

Api này dùng để tìm kiếm Payment-History

### Example

```typescript
import {
    PaymentHistoryControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentHistoryControllerApi(configuration);

let startDate: string; // (default to undefined)
let endDate: string; // (default to undefined)
let page: number; //Zero-based page index (0..N) (optional) (default to 0)
let size: number; //The size of the page to be returned (optional) (default to 10)
let sort: Array<string>; //Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. (optional) (default to undefined)
let paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED' | 'CANCELED' | 'FAILED'; // (optional) (default to undefined)

const { status, data } = await apiInstance.searchPaymentHistories(
    startDate,
    endDate,
    page,
    size,
    sort,
    paymentStatus
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **startDate** | [**string**] |  | defaults to undefined|
| **endDate** | [**string**] |  | defaults to undefined|
| **page** | [**number**] | Zero-based page index (0..N) | (optional) defaults to 0|
| **size** | [**number**] | The size of the page to be returned | (optional) defaults to 10|
| **sort** | **Array&lt;string&gt;** | Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. | (optional) defaults to undefined|
| **paymentStatus** | [**&#39;PAID&#39; | &#39;PENDING&#39; | &#39;REFUNDED&#39; | &#39;CANCELED&#39; | &#39;FAILED&#39;**]**Array<&#39;PAID&#39; &#124; &#39;PENDING&#39; &#124; &#39;REFUNDED&#39; &#124; &#39;CANCELED&#39; &#124; &#39;FAILED&#39;>** |  | (optional) defaults to undefined|


### Return type

**ApiResponsePageResponsePaymentHistoryResponse**

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

