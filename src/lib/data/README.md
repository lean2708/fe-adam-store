# Data Layer - Factory Pattern Implementation

This directory implements the factory pattern for all data operations following the `api-client -> data (transform) -> action` architecture.

## ✅ **Updated Files with Factory Pattern**

All data files have been updated to use the consistent factory pattern and transform functions have been moved to the `transform/` folder.

## Architecture Overview

```
API Client → Data Layer → Actions → UI Components
```

### 1. **Controller Factory** (`src/lib/data/factory-api-client.ts`)
- **Centralized factory** for creating authenticated API controller instances
- **Manages axios instance lifecycle** with singleton pattern
- **Provides individual controller getters** for all API services:
  - StatisticsController, UserController, ProductController
  - OrderController, FileController, RoleController
  - BranchController, CartController, CartItemController, CategoryController
- **Replaces direct axios instance creation** with factory pattern
- **Maintains backward compatibility** with `getAuthenticatedApiClient()`

```typescript
// New Factory Pattern Usage
const userController = await ControllerFactory.getUserController();
const productController = await ControllerFactory.getProductController();
const cartController = await ControllerFactory.getCartController();

// Legacy support still available
const apiClient = await getAuthenticatedApiClient();
```

### 2. **Data Layer Files** (All Updated with Factory Pattern)
- **user.ts** - User management data operations (includes admin functions) ✅
- **product.ts** - Product management data operations (includes admin functions) ✅
- **order.ts** - Order management data operations (includes admin functions) ✅
- **file.ts** - File management data operations ✅
- **statistics.ts** - Statistics and analytics data operations ✅
- **auth.ts** - Authentication operations ✅
- **cart.ts** - Cart operations ✅
- **cartItem.ts** - Cart item operations ✅
- **category.ts** - Category operations ✅
- **branch.ts** - Branch operations ✅

#### Example Data Layer Function:
```typescript
export async function fetchAllUsersForAdmin(
  page: number = 0,
  size: number = 10,
  sort: string[] = ["id,desc"]
): Promise<PageResponseUserResponse> {
  const controller = await ControllerFactory.getUserController();
  const response = await controller.fetchAllForAdmin({ page, size, sort });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to fetch users");
  }

  return response.data.result!;
}
```

### 3. **Actions Layer** (`src/actions/`)
- **userActions.ts** - User management actions (includes admin functions)
- **productActions.ts** - Product management actions (includes admin functions)
- **orderActions.ts** - Order management actions (includes admin functions)
- **fileActions.ts** - File management actions
- **statisticsActions.ts** - Statistics actions
- **Consistent ActionResponse format** for all operations
- **Proper error handling** with user-friendly messages

#### Example Action Function:
```typescript
export async function fetchAllUsersAction(
  page: number = 0,
  size: number = 10,
  sort: string[] = ["id,desc"]
): Promise<ActionResponse<PageResponseUserResponse>> {
  try {
    const data = await fetchAllUsersForAdmin(page, size, sort);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
}
```

### 3. **Transform Layer** (`src/lib/data/transform/`)
- **Centralized transform functions** moved from individual data files
- **Consistent transform patterns** across all data operations
- **Reusable transform utilities** for API response conversion

#### Transform Files:
- **branch.ts** - Branch response transformations ✅
- **cart.ts** - Cart and CartItem response transformations ✅
- **category.ts** - Category response transformations ✅
- **order.ts** - Order response transformations ✅
- **product.ts** - Product response transformations ✅

## Key Changes Made

### 1. **Factory Pattern Implementation**
- **Created `ControllerFactory` class** in `factory-api-client.ts`
- **Added all missing controllers** (Branch, Cart, CartItem, Category)
- **Replaced direct axios instance creation** with factory methods
- **Updated all data files** to use factory pattern
- **Maintained backward compatibility** with `getAuthenticatedApiClient()`

### 2. **Transform Function Organization**
- **Moved all transform functions** to `src/lib/data/transform/` folder
- **Created dedicated transform files** for each domain
- **Updated data files** to import from transform folder
- **Eliminated code duplication** across data files

### 3. **Data Layer Standardization**
- **Updated all data files** to use consistent factory pattern
- **Standardized controller access** through factory methods
- **Improved error handling** with consistent patterns
- **Enhanced type safety** throughout data layer

### 4. **Actions Layer Consolidation**
- **Removed admin-specific actions directory** (`src/actions/admin/`)
- **Updated existing actions** to use new data layer functions
- **Added admin action functions** to existing action files
- **Renamed conflicting functions** (e.g., `deleteProductAdminAction`)

### 5. **Admin UI Updates**
- **Updated all admin TSX files** to use consolidated actions
- **Fixed data structure properties** (items vs content, totalItems vs totalElements)
- **Updated import paths** to use main actions instead of admin-specific ones
- **Maintained type safety** with proper TypeScript integration

## File Structure

```
src/
├── lib/data/
│   ├── factory-api-client.ts     # Controller Factory (All Controllers)
│   ├── user.ts                   # User data (includes admin functions) ✅
│   ├── product.ts                # Product data (includes admin functions) ✅
│   ├── order.ts                  # Order data (includes admin functions) ✅
│   ├── file.ts                   # File data operations ✅
│   ├── statistics.ts             # Statistics data operations ✅
│   ├── auth.ts                   # Authentication ✅
│   ├── cart.ts                   # Cart operations ✅
│   ├── cartItem.ts               # Cart item operations ✅
│   ├── category.ts               # Category operations ✅
│   ├── branch.ts                 # Branch operations ✅
│   ├── transform/                # Transform utilities
│   │   ├── branch.ts             # Branch transformations ✅
│   │   ├── cart.ts               # Cart transformations ✅
│   │   ├── category.ts           # Category transformations ✅
│   │   ├── order.ts              # Order transformations ✅
│   │   └── product.ts            # Product transformations ✅
│   ├── transfer/                 # Legacy transform functions
│   │   └── index.ts              # Color, PaymentHistory, Promotion transforms ✅
│   └── README.md                 # This documentation
├── actions/
│   ├── userActions.ts            # User actions (includes admin)
│   ├── productActions.ts         # Product actions (includes admin)
│   ├── orderActions.ts           # Order actions (includes admin)
│   ├── fileActions.ts            # File actions
│   ├── statisticsActions.ts      # Statistics actions
│   └── ...                      # Other existing actions
└── app/admin/                    # Admin UI (updated to use consolidated actions)
    ├── users/
    ├── products/
    ├── orders/
    └── files/
```

## Benefits

### 1. **Simplified Architecture**
- Single source of truth for data operations
- No duplication between admin and regular functions
- Consistent patterns across all data operations

### 2. **Better Maintainability**
- Easier to add new features
- Centralized error handling
- Consistent factory pattern usage

### 3. **Type Safety**
- Full TypeScript integration throughout
- Consistent error handling with ActionResponse type
- API model types flow through all layers

### 4. **Performance**
- Efficient axios instance management
- Reduced code duplication
- Optimized factory pattern implementation

## Usage Examples

### In UI Components:
```typescript
// Import from consolidated actions
import { fetchAllUsersAction } from "@/actions/userActions";

// Use in component
const result = await fetchAllUsersAction(0, 10);
if (result.success) {
  setUsers(result.data.items || []);
} else {
  toast.error(result.message);
}
```

### Adding New Functionality:

1. **Add to Data Layer**:
   ```typescript
   export async function newDataOperation(): Promise<ResponseType> {
     const controller = await ControllerFactory.getController();
     const response = await controller.operation();
     
     if (response.data.code !== 200) {
       throw new Error(response.data.message || "Operation failed");
     }
     
     return response.data.result!;
   }
   ```

2. **Add to Actions**:
   ```typescript
   export async function newAction(): Promise<ActionResponse<ResponseType>> {
     try {
       const data = await newDataOperation();
       return { success: true, data };
     } catch (error) {
       return {
         success: false,
         message: error instanceof Error ? error.message : "Operation failed",
       };
     }
   }
   ```

This consolidated approach provides a clean, maintainable, and scalable foundation for all data operations in the application.
