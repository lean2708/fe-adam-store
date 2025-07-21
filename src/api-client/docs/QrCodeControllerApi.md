# QrCodeControllerApi

All URIs are relative to *https://microservices.appf4.io.vn/adamstore*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**generateQRCode**](#generateqrcode) | **GET** /v1/public/qrcode | |

# **generateQRCode**
> Array<string> generateQRCode()


### Example

```typescript
import {
    QrCodeControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QrCodeControllerApi(configuration);

let text: string; // (default to undefined)

const { status, data } = await apiInstance.generateQRCode(
    text
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **text** | [**string**] |  | defaults to undefined|


### Return type

**Array<string>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: image/png


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

