# TokenResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**accessToken** | **string** |  | [optional] [default to undefined]
**refreshToken** | **string** |  | [optional] [default to undefined]
**authenticated** | **boolean** |  | [optional] [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**roles** | [**Set&lt;EntityBasic&gt;**](EntityBasic.md) |  | [optional] [default to undefined]

## Example

```typescript
import { TokenResponse } from './api';

const instance: TokenResponse = {
    accessToken,
    refreshToken,
    authenticated,
    email,
    roles,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
