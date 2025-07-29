# StatisticsControllerApi

All URIs are relative to *https://microservices.appf4.io.vn/adamstore*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**exportOrderRevenueToExcel**](#exportorderrevenuetoexcel) | **GET** /v1/admin/statistics/orders/revenue-by-date/export | Export order revenue report to Excel|
|[**getMonthlyRevenue**](#getmonthlyrevenue) | **GET** /v1/admin/statistics/revenues/monthly | Fetched monthly revenue data|
|[**getTopSellingProducts**](#gettopsellingproducts) | **GET** /v1/admin/statistics/products/top-selling | Fetched top selling products|

# **exportOrderRevenueToExcel**
> exportOrderRevenueToExcel()

API này dùng để xuất dữ liệu doanh thu của các đơn hàng ra file Excel (yyyy-MM-dd)

### Example

```typescript
import {
    StatisticsControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StatisticsControllerApi(configuration);

let startDate: string; // (default to undefined)
let endDate: string; // (default to undefined)

const { status, data } = await apiInstance.exportOrderRevenueToExcel(
    startDate,
    endDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **startDate** | [**string**] |  | defaults to undefined|
| **endDate** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMonthlyRevenue**
> ApiResponseListRevenueByMonthDTO getMonthlyRevenue()

API này dùng để ấy doanh thu theo tháng trong khoảng (startDate (yyyy-MM-dd) đến endDate (yyyy-MM-dd))

### Example

```typescript
import {
    StatisticsControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StatisticsControllerApi(configuration);

let startDate: string; // (default to undefined)
let endDate: string; // (default to undefined)

const { status, data } = await apiInstance.getMonthlyRevenue(
    startDate,
    endDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **startDate** | [**string**] |  | defaults to undefined|
| **endDate** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseListRevenueByMonthDTO**

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

# **getTopSellingProducts**
> ApiResponseListTopSellingDTO getTopSellingProducts()

API này dùng để lấy các sản phẩm bán chạy (yyyy-MM-dd)

### Example

```typescript
import {
    StatisticsControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StatisticsControllerApi(configuration);

let startDate: string; // (default to undefined)
let endDate: string; // (default to undefined)

const { status, data } = await apiInstance.getTopSellingProducts(
    startDate,
    endDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **startDate** | [**string**] |  | defaults to undefined|
| **endDate** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseListTopSellingDTO**

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

