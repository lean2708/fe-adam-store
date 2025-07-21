# OrderRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**addressId** | **number** |  | [default to undefined]
**orderItems** | [**Array&lt;OrderItemRequest&gt;**](OrderItemRequest.md) |  | [default to undefined]
**promotionId** | **number** |  | [optional] [default to undefined]
**shippingFee** | **number** |  | [default to undefined]
**paymentMethod** | **string** |  | [default to undefined]

## Example

```typescript
import { OrderRequest } from './api';

const instance: OrderRequest = {
    addressId,
    orderItems,
    promotionId,
    shippingFee,
    paymentMethod,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
