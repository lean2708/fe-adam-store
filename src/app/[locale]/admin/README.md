# Adam Store Admin Interface

This is the admin interface for the Adam Store e-commerce platform. It provides comprehensive management capabilities for administrators.

## Features

### 🏠 Dashboard
- **Revenue Analytics**: Monthly revenue charts and statistics
- **Order Summary**: Real-time order counts and revenue totals
- **Top Products**: Best-selling products with performance metrics
- **Quick Stats**: Key performance indicators at a glance

### 👥 User Management
- **User Listing**: Paginated view of all users with search functionality
- **User Creation**: Create new user accounts with role assignments
- **User Editing**: Update user information and roles
- **User Status**: Activate/deactivate user accounts
- **Role Management**: Assign and manage user roles (Admin, User)

### 📦 Product Management
- **Product Catalog**: View all products with filtering and search
- **Product Details**: Comprehensive product information display
- **Inventory Tracking**: Stock levels and variant management
- **Product Status**: Active/inactive product management
- **Image Management**: Product image uploads and management

### 📋 Order Management
- **Order Listing**: View all customer orders with status filtering
- **Order Details**: Complete order information and customer data
- **Status Updates**: Change order status (Pending, Processing, Shipped, Delivered, Cancelled)
- **Order Actions**: Cancel orders and manage order lifecycle

### 📁 File Management
- **Image Gallery**: Visual grid of all uploaded images
- **File Upload**: Multi-file upload with drag-and-drop support
- **File Organization**: Filter by file type (Avatar, Product Images)
- **File Actions**: View, download, copy URLs, and delete files

## Navigation Structure

```
/admin
├── /                    # Dashboard (includes revenue analytics and statistics)
├── /users              # User Management
├── /products           # Product Management (includes product statistics)
├── /orders             # Order Management
├── /files              # File Management
├── /payment-history    # Payment History Management
├── /chat               # Chat Management
├── /sizes              # Size Management
├── /colors             # Color Management
├── /branches           # Branch Management
├── /categories         # Category Management
└── /promotions         # Promotion Management
```

## Authentication & Authorization

- **Admin Access Only**: Routes are protected and require admin role
- **Session Management**: Automatic redirect to login if not authenticated
- **Role Verification**: Checks for admin privileges on all admin routes

## API Integration

The admin interface integrates with the following API endpoints:

### Statistics API
- `GET /v1/admin/statistics/monthly-revenue`
- `GET /v1/admin/statistics/order-revenue-summary`
- `GET /v1/admin/statistics/top-selling-products`

### User Management API
- `GET /v1/admin/users` - Fetch all users
- `POST /v1/admin/users` - Create user
- `PUT /v1/admin/users/{id}` - Update user
- `DELETE /v1/admin/users/{id}` - Delete user
- `PUT /v1/admin/users/{id}/restore` - Restore user

### Product Management API
- `GET /v1/admin/products` - Fetch all products
- `POST /v1/admin/products` - Create product
- `PUT /v1/admin/products/{id}` - Update product
- `DELETE /v1/admin/products/{id}` - Delete product
- `PUT /v1/admin/products/{id}/restore` - Restore product

### Order Management API
- `GET /v1/admin/orders/search` - Search orders
- `GET /v1/private/orders/{id}/details` - Get order details
- `PUT /v1/private/orders/{id}/cancel` - Cancel order
- `DELETE /v1/admin/orders/{id}` - Delete order

### File Management API
- `GET /v1/admin/files/all` - Get all files
- `POST /v1/admin/files/upload/images` - Upload images
- `DELETE /v1/admin/files/delete/{id}` - Delete file

## UI Components

The admin interface uses a consistent design system with:

- **Shadcn/UI Components**: Modern, accessible UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Consistent iconography
- **Responsive Design**: Mobile-friendly layouts
- **Dark Mode Support**: Theme switching capabilities

## Development

### File Structure
```
src/app/admin/
├── layout.tsx                    # Admin layout wrapper
├── page.tsx                      # Dashboard page (includes statistics)
├── users/page.tsx               # User management
├── products/page.tsx            # Product management (includes product statistics)
├── orders/page.tsx              # Order management
├── files/page.tsx               # File management
├── payment-history/page.tsx     # Payment history management
├── chat/page.tsx                # Chat management
├── sizes/page.tsx               # Size management
├── colors/page.tsx              # Color management
├── branches/page.tsx            # Branch management
├── categories/page.tsx          # Category management
└── promotions/page.tsx          # Promotion management

src/components/templates/admin/
├── AdminSidebar.tsx             # Navigation sidebar
├── AdminHeader.tsx              # Top header
├── dashboard/                   # Dashboard components (includes statistics)
├── users/                       # User management components
├── products/                    # Product management components
├── orders/                      # Order management components
├── files/                       # File management components
├── payment-history/             # Payment history components
├── chat/                        # Chat components
├── sizes/                       # Size management components
├── colors/                      # Color management components
├── branches/                    # Branch management components
├── categories/                  # Category management components
└── promotions/                  # Promotion management components

src/actions/
├── userActions.ts               # User management actions
├── productActions.ts            # Product management actions
├── orderActions.ts              # Order management actions
├── fileActions.ts               # File management actions
├── paymentHistoryActions.ts     # Payment history actions
├── sizeActions.ts               # Size management actions
├── colorActions.ts              # Color management actions
├── branchActions.ts             # Branch management actions
├── categoryActions.ts           # Category management actions
├── promotionActions.ts          # Promotion management actions
└── statisticsActions.ts         # Statistics actions (used by dashboard and products)
```

### Key Features
- **Server Actions**: All API calls use Next.js server actions
- **Type Safety**: Full TypeScript integration with API client
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Skeleton loaders and loading indicators
- **Pagination**: Efficient data pagination for large datasets
- **Search & Filtering**: Advanced search and filtering capabilities

## Getting Started

1. Ensure you have admin privileges in your user account
2. Navigate to `/admin` after logging in
3. The dashboard provides an overview of key metrics
4. Use the sidebar navigation to access different management sections

## Security Notes

- All admin routes are protected by authentication middleware
- Role-based access control ensures only admins can access these features
- API calls include proper authentication headers
- Sensitive operations require confirmation dialogs
