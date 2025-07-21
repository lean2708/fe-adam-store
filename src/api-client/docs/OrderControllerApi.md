# OrderControllerApi

All URIs are relative to *https://microservices.appf4.io.vn/adamstore*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**calculateShippingFee**](#calculateshippingfee) | **POST** /v1/private/shipping/calculate-fee | Calculate Shipping Fee|
|[**cancelOrder**](#cancelorder) | **PUT** /v1/private/orders/{orderId}/cancel | Cancel Order|
|[**create1**](#create1) | **POST** /v1/private/orders | Create Order|
|[**delete7**](#delete7) | **DELETE** /v1/admin/orders/{id} | Delete Order For Admin|
|[**fetchDetailById1**](#fetchdetailbyid1) | **GET** /v1/private/orders/{id}/details | Fetch Order Detail By Id|
|[**getOrdersForUser**](#getordersforuser) | **GET** /v1/private/user/orders | Get Orders for Current User|
|[**pay**](#pay) | **GET** /v1/private/orders/{orderId}/vn-pay | Payment for Order|
|[**payCallbackHandler**](#paycallbackhandler) | **POST** /v1/private/orders/vn-pay-callback | Payment CallBack for Order|
|[**retryPayment**](#retrypayment) | **GET** /v1/private/orders/{orderId}/retry-payment | Retry Payment for Order|
|[**searchOrdersForAdmin**](#searchordersforadmin) | **GET** /v1/admin/orders/search | Search Orders for Admin|
|[**updateAddress**](#updateaddress) | **PUT** /v1/private/orders/{orderId}/address | Update Address for Order|

# **calculateShippingFee**
> ApiResponseShippingFeeResponse calculateShippingFee(shippingRequest)

Api này dùng để tính phí ship của đơn hàng

### Example

```typescript
import {
    OrderControllerApi,
    Configuration,
    ShippingRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderControllerApi(configuration);

let shippingRequest: ShippingRequest; //

const { status, data } = await apiInstance.calculateShippingFee(
    shippingRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **shippingRequest** | **ShippingRequest**|  | |


### Return type

**ApiResponseShippingFeeResponse**

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

# **cancelOrder**
> ApiResponseOrderResponse cancelOrder()

Người dùng hủy đơn hàng nếu khi đang ở trạng thái PENDING hoặc PROCESSING

### Example

```typescript
import {
    OrderControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderControllerApi(configuration);

let orderId: number; // (default to undefined)

const { status, data } = await apiInstance.cancelOrder(
    orderId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderId** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseOrderResponse**

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

# **create1**
> ApiResponseOrderResponse create1(orderRequest)

Api này dùng để tạo đơn hàng

### Example

```typescript
import {
    OrderControllerApi,
    Configuration,
    OrderRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderControllerApi(configuration);

let orderRequest: OrderRequest; //

const { status, data } = await apiInstance.create1(
    orderRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderRequest** | **OrderRequest**|  | |


### Return type

**ApiResponseOrderResponse**

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

# **delete7**
> ApiResponseVoid delete7()

Admin xóa đơn hàng

### Example

```typescript
import {
    OrderControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.delete7(
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

# **fetchDetailById1**
> ApiResponseOrderResponse fetchDetailById1()

Api này dùng để lấy chi tiết đơn hàng

### Example

```typescript
import {
    OrderControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.fetchDetailById1(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseOrderResponse**

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

# **getOrdersForUser**
> ApiResponsePageResponseOrderResponse getOrdersForUser()

Lấy danh sách đơn hàng của người dùng hiện tại, lọc theo trạng thái

### Example

```typescript
import {
    OrderControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderControllerApi(configuration);

let orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'; // (default to undefined)
let page: number; //Zero-based page index (0..N) (optional) (default to 0)
let size: number; //The size of the page to be returned (optional) (default to 10)
let sort: Array<string>; //Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. (optional) (default to undefined)

const { status, data } = await apiInstance.getOrdersForUser(
    orderStatus,
    page,
    size,
    sort
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderStatus** | [**&#39;PENDING&#39; | &#39;PROCESSING&#39; | &#39;SHIPPED&#39; | &#39;DELIVERED&#39; | &#39;CANCELLED&#39;**]**Array<&#39;PENDING&#39; &#124; &#39;PROCESSING&#39; &#124; &#39;SHIPPED&#39; &#124; &#39;DELIVERED&#39; &#124; &#39;CANCELLED&#39;>** |  | defaults to undefined|
| **page** | [**number**] | Zero-based page index (0..N) | (optional) defaults to 0|
| **size** | [**number**] | The size of the page to be returned | (optional) defaults to 10|
| **sort** | **Array&lt;string&gt;** | Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. | (optional) defaults to undefined|


### Return type

**ApiResponsePageResponseOrderResponse**

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

# **pay**
> ApiResponseVNPayResponse pay()

Api này dùng để thanh toán đơn hàng thông qua VNPAY

### Example

```typescript
import {
    OrderControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderControllerApi(configuration);

let orderId: number; // (default to undefined)

const { status, data } = await apiInstance.pay(
    orderId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderId** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseVNPayResponse**

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

# **payCallbackHandler**
> ApiResponseOrderResponse payCallbackHandler(paymentCallbackRequest)

Api này dùng để xử lý sau khi thanh toán đơn hàng

### Example

```typescript
import {
    OrderControllerApi,
    Configuration,
    PaymentCallbackRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderControllerApi(configuration);

let paymentCallbackRequest: PaymentCallbackRequest; //

const { status, data } = await apiInstance.payCallbackHandler(
    paymentCallbackRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **paymentCallbackRequest** | **PaymentCallbackRequest**|  | |


### Return type

**ApiResponseOrderResponse**

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

# **retryPayment**
> ApiResponseVNPayResponse retryPayment()

Api này dùng để thanh toán lại đơn hàng(khi đang trong phần chờ thanh toán)

### Example

```typescript
import {
    OrderControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderControllerApi(configuration);

let orderId: number; // (default to undefined)

const { status, data } = await apiInstance.retryPayment(
    orderId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderId** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseVNPayResponse**

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

# **searchOrdersForAdmin**
> ApiResponsePageResponseOrderResponse searchOrdersForAdmin()

API cho admin lấy danh sách đơn hàng theo khoảng thời gian và trạng thái (tuỳ chọn)

### Example

```typescript
import {
    OrderControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderControllerApi(configuration);

let startDate: string; // (default to undefined)
let endDate: string; // (default to undefined)
let page: number; //Zero-based page index (0..N) (optional) (default to 0)
let size: number; //The size of the page to be returned (optional) (default to 10)
let sort: Array<string>; //Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. (optional) (default to undefined)
let orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'; // (optional) (default to undefined)

const { status, data } = await apiInstance.searchOrdersForAdmin(
    startDate,
    endDate,
    page,
    size,
    sort,
    orderStatus
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
| **orderStatus** | [**&#39;PENDING&#39; | &#39;PROCESSING&#39; | &#39;SHIPPED&#39; | &#39;DELIVERED&#39; | &#39;CANCELLED&#39;**]**Array<&#39;PENDING&#39; &#124; &#39;PROCESSING&#39; &#124; &#39;SHIPPED&#39; &#124; &#39;DELIVERED&#39; &#124; &#39;CANCELLED&#39;>** |  | (optional) defaults to undefined|


### Return type

**ApiResponsePageResponseOrderResponse**

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

# **updateAddress**
> ApiResponseOrderResponse updateAddress(orderAddressRequest)

Cập nhập đia chỉ cho đơn hàng ở trạng thái PENDING hoặc PROCESSING

### Example

```typescript
import {
    OrderControllerApi,
    Configuration,
    OrderAddressRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderControllerApi(configuration);

let orderId: number; // (default to undefined)
let orderAddressRequest: OrderAddressRequest; //

const { status, data } = await apiInstance.updateAddress(
    orderId,
    orderAddressRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderAddressRequest** | **OrderAddressRequest**|  | |
| **orderId** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseOrderResponse**

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

