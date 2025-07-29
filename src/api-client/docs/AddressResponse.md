# AddressResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**isDefault** | **boolean** |  | [optional] [default to undefined]
**isVisible** | **boolean** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**phone** | **string** |  | [optional] [default to undefined]
**streetDetail** | **string** |  | [optional] [default to undefined]
**ward** | [**WardBasic**](WardBasic.md) |  | [optional] [default to undefined]
**district** | [**EntityBasic**](EntityBasic.md) |  | [optional] [default to undefined]
**province** | [**EntityBasic**](EntityBasic.md) |  | [optional] [default to undefined]

## Example

```typescript
import { AddressResponse } from './api';

const instance: AddressResponse = {
    id,
    isDefault,
    isVisible,
    status,
    phone,
    streetDetail,
    ward,
    district,
    province,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
