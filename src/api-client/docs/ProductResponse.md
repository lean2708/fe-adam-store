# ProductResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**isAvailable** | **boolean** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**averageRating** | **number** |  | [optional] [default to undefined]
**soldQuantity** | **number** |  | [optional] [default to undefined]
**totalReviews** | **number** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**images** | [**Array&lt;ImageBasic&gt;**](ImageBasic.md) |  | [optional] [default to undefined]
**variants** | [**Array&lt;ProductVariantResponse&gt;**](ProductVariantResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { ProductResponse } from './api';

const instance: ProductResponse = {
    id,
    isAvailable,
    name,
    description,
    averageRating,
    soldQuantity,
    totalReviews,
    status,
    createdAt,
    images,
    variants,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
