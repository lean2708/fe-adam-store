# OrderResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**orderDate** | **string** |  | [optional] [default to undefined]
**discountAmount** | **number** |  | [optional] [default to undefined]
**totalPrice** | **number** |  | [optional] [default to undefined]
**orderStatus** | **string** |  | [optional] [default to undefined]
**customerName** | **string** |  | [optional] [default to undefined]
**address** | [**AddressResponse**](AddressResponse.md) |  | [optional] [default to undefined]
**orderItems** | [**Array&lt;OrderItemResponse&gt;**](OrderItemResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { OrderResponse } from './api';

const instance: OrderResponse = {
    id,
    orderDate,
    discountAmount,
    totalPrice,
    orderStatus,
    customerName,
    address,
    orderItems,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
