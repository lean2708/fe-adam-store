# ChatMessageControllerApi

All URIs are relative to *https://microservices.appf4.io.vn/adamstore*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteMessage**](#deletemessage) | **DELETE** /v1/private/messages/{messageId} | Delete message by id|
|[**getMessages**](#getmessages) | **GET** /v1/private/messages | Fetch all messages for conversationId|
|[**searchMessages**](#searchmessages) | **GET** /v1/private/messages/search | Search messages in a conversation by keyword|

# **deleteMessage**
> ApiResponseVoid deleteMessage()


### Example

```typescript
import {
    ChatMessageControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatMessageControllerApi(configuration);

let messageId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteMessage(
    messageId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **messageId** | [**string**] |  | defaults to undefined|


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

# **getMessages**
> ApiResponseListChatMessageResponse getMessages()

Lấy danh sách tin nhắn  trong một cuộc trò chuyện

### Example

```typescript
import {
    ChatMessageControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatMessageControllerApi(configuration);

let conversationId: string; // (default to undefined)

const { status, data } = await apiInstance.getMessages(
    conversationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **conversationId** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseListChatMessageResponse**

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

# **searchMessages**
> ApiResponseListChatMessageResponse searchMessages()


### Example

```typescript
import {
    ChatMessageControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatMessageControllerApi(configuration);

let conversationId: string; // (default to undefined)
let keyword: string; // (default to undefined)

const { status, data } = await apiInstance.searchMessages(
    conversationId,
    keyword
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **conversationId** | [**string**] |  | defaults to undefined|
| **keyword** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseListChatMessageResponse**

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

