## Admin Module - Quick Reference Guide

### Accessing Admin Features

1. **Login as Admin User**
   - Use an account with `role = 'admin'` in database
   - Or change existing user's role via direct DB query:
   ```sql
   UPDATE users SET role = 'admin' WHERE id = 1;
   ```

2. **Admin Navigation**
   - Open drawer menu (hamburger icon)
   - Scroll down to see admin sections:
     - Admin Dashboard
     - Products Management
     - Orders Management
     - Users Management

---

## Admin Dashboard

**Location**: Drawer → "Admin Dashboard"

**Displays**:
- Total Products Count
- Total Orders Count
- Total Revenue (sum of all order totals)
- Low Stock Products (stock = 0)
- Quick Action buttons

**Features**:
- Read-only metrics display
- Auto-calculated from database
- Real-time data fetch on screen load

---

## Products Management

**Location**: Drawer → "Products Management"

### View All Products
- **Table Shows**: Name, Price, Stock, Actions
- **Sort**: Click column headers (currently: manual pagination)
- **Pagination**: 10 items per page
- **Total Count**: Shows at bottom

### Search Products
```
Search Input Box
- Type product name or SKU
- Results filter in real-time
- Search is case-insensitive
```

### Filter by Platform
```
Filter Buttons: [All] [iOS] [ANDROID]
- Click to filter products by platform
- Works in combination with search
```

### Add New Product
1. Click "Add New Product" button (Green button with + icon)
2. Fill form fields:
   - **Product Name*** (required)
   - **Description** (optional)
   - **Price*** (required, decimal)
   - **Stock*** (required, whole number)
   - **SKU** (optional)
   - **Platform** (iOS or Android - select one)
3. Click "Save"
4. Product added to database and table updates

### Edit Product
1. Find product in table
2. Click blue "Edit" icon button
3. Modal opens with form pre-filled
4. Modify any field
5. Click "Save"
6. Product updated in database and table refreshes

### Delete Product
1. Find product in table
2. Click red "Delete" icon button
3. Confirmation dialog appears
4. Click "Delete" to confirm
5. Product removed from database and table updates

### Stock Status Indicators
- **Green Text**: In Stock (stock > 0)
- **Red Text**: Out of Stock (stock = 0)

---

## Users Management

**Location**: Drawer → "Users Management"

### View All Users
- **Table Shows**: Name, Email, Role, Actions
- **Pagination**: 10 items per page
- **Total Count**: Shows at bottom

### Search Users
```
Search Input Box
- Type user name or email
- Results filter in real-time
- Search is case-insensitive
```

### Filter by Role
```
Filter Buttons: [All] [USER] [ADMIN]
- Click to filter users by role
- Works in combination with search
```

### Edit User
1. Find user in table
2. Click blue "Edit" icon button
3. Modal opens with user details
4. **Name**: Read-only display
5. **Email**: Read-only (cannot change)
6. **Role**: Select from [USER] [ADMIN] buttons
7. Click "Save"
8. User role updated in database and table refreshes

### Delete User
1. Find user in table
2. Click red "Delete" icon button
3. Confirmation dialog appears: "Are you sure you want to delete [Name]?"
4. Click "Delete" to confirm
5. User removed from database and table updates

### Role Indicators
- **Green Badge**: User (customer)
- **Orange Badge**: Admin (administrator)

---

## Orders Management

**Location**: Drawer → "Orders Management"

### View All Orders
- **Table Shows**: Order ID, Customer, Total, Status, Actions
- **Pagination**: 10 items per page
- **Total Count**: Shows at bottom

### Search Orders
```
Search Input Box
- Type order ID (numbers) or customer name
- Results filter in real-time
```

### Filter by Status
```
Filter Buttons: [All] [Pending] [Processing] [Shipped] [Delivered] [Cancelled]
- Click to filter orders by current status
- Works in combination with search
```

### Update Order Status
1. Find order in table
2. Click blue "Edit" icon button
3. Modal opens showing:
   - Order Details (Customer, Total, Items, Date)
   - Item List (Products in order with qty and price)
   - Status Update Buttons
4. Click desired status: [Pending] [Processing] [Shipped] [Delivered] [Cancelled]
5. Click "Save"
6. Order status updated in database and table refreshes

### View Order Details
1. In update modal, see:
   - Customer name
   - Order total
   - Number of items
   - Order creation date
   - Detailed item list with:
     - Product name
     - Quantity ordered
     - Price per unit

### Delete Order
1. Find order in table
2. Click red "Delete" icon button
3. Confirmation dialog appears: "Are you sure you want to delete order #[ID]?"
4. Click "Delete" to confirm
5. Order removed from database and table updates

### Status Color Codes
- **Orange**: Pending, Processing (Action needed)
- **Blue**: Shipped (In transit)
- **Green**: Delivered (Complete)
- **Red**: Cancelled (Closed)

---

## Common Actions

### Adding Items (Products/Orders/Users)
1. Look for "Add New [Item Type]" button
2. Button is usually green with + icon
3. Click to open form modal
4. Fill all required fields (marked with *)
5. Click "Save"
6. Item appears in table immediately

### Editing Items
1. Find item in table
2. Click blue "Edit" icon
3. Form modal opens with current values
4. Modify fields as needed
5. Click "Save"
6. Table updates immediately

### Deleting Items
1. Find item in table
2. Click red "Delete" icon
3. Confirm in dialog
4. Item removed from table and database

### Searching
- Type in search box
- Results filter in real-time
- Pagination resets to page 1
- Clear search to show all items

### Filtering
- Use filter buttons (like status, role, platform)
- Can combine with search
- Pagination resets when filter changes
- Shows remaining count in pagination info

### Pagination
- Shows "Page X of Y" at bottom
- "Previous" button disabled on page 1
- "Next" button disabled on last page
- Jump to page by clicking Previous/Next

---

## Error Handling

### Common Errors & Solutions

**Error**: "Failed to load [items]"
- **Cause**: API request failed
- **Solution**: Click item to refresh or go back and return

**Error**: "Error saving [item]"
- **Cause**: Validation error or server issue
- **Solution**: Check required fields are filled, retry operation

**Error**: "Failed to delete [item]"
- **Cause**: Item may be in use or server error
- **Solution**: Refresh page and try again, check server logs

**Validation**:
- All fields marked with * are required
- Price must be a valid decimal number
- Stock must be a whole number
- Email must be valid format (for users)
- Form won't submit if validation fails

---

## Tips & Tricks

### Efficient Searching
1. Search by name for products/users
2. Search by ID for orders
3. Partial text works (e.g., "iph" finds "iPhone")

### Efficient Filtering
1. Filter by status first (narrows results)
2. Then search if needed
3. Use multiple filters for better results

### Bulk Operations (Not Yet Implemented)
- Currently can only edit/delete one item at a time
- Select items and bulk delete coming soon

### Sorting
- Currently sorted by ID (descending)
- Click column headers in future updates

### Mobile Responsive
- Table scrolls horizontally on small screens
- Touch-friendly buttons
- Modal forms optimize for mobile

---

## API Endpoints Being Used

### Products Management Uses:
```
GET    /admin/products           - Load table
POST   /admin/products           - Add new product
PUT    /admin/products/{id}      - Edit product
DELETE /admin/products/{id}      - Delete product
```

### Users Management Uses:
```
GET    /admin/users              - Load table
PUT    /admin/users/{id}         - Change user role
DELETE /admin/users/{id}         - Delete user
```

### Orders Management Uses:
```
GET    /admin/orders             - Load table
GET    /admin/orders/{id}        - Load order details
PUT    /admin/orders/{id}        - Update order status
DELETE /admin/orders/{id}        - Delete order
```

---

## Database Access (For Admins)

If needing direct database access:

```sql
-- Check admin users
SELECT id, name, email, role FROM users WHERE role = 'admin';

-- Make user admin
UPDATE users SET role = 'admin' WHERE id = 1;

-- View all products
SELECT id, name, price, stock, platform FROM products;

-- View all orders
SELECT id, total_amount, status, created_at FROM orders;

-- Check low stock products
SELECT id, name, stock FROM products WHERE stock = 0;
```

---

## Security Notes

- Only users with `role = 'admin'` can access admin routes
- Admin middleware checks user role on every request
- All admin endpoints require authentication token
- Passwords not visible in user management
- Changes logged server-side (implement audit logs)
- Sensitive operations require confirmation

---

## Performance Tips

- Table loads 10 items per page for better performance
- Search/filter happens on client-side (instant)
- Pagination prevents loading large datasets
- Use pagination buttons to navigate
- Close modals to refresh table faster

---

## Troubleshooting

### Table Not Loading
1. Check network connection
2. Ensure you're logged in as admin
3. Try refreshing the page
4. Check backend is running

### Can't Edit/Delete Items
1. Item might be deleted elsewhere
2. Refresh page to sync
3. Check user permissions
4. Try again after refresh

### Search Not Working
1. Try clearing search field
2. Refresh page
3. Check spelling
4. Try searching different field

### Modal Not Closing
1. Click outside modal
2. Click X button in top right
3. Try "Cancel" button
4. Refresh page

---

## Contact & Support

For issues or feature requests:
1. Check this guide first
2. Review error messages
3. Check backend logs
4. Document the issue with steps to reproduce

---

**Last Updated**: Phase 3 Completion
**Admin Module Version**: 1.0
**Status**: Production Ready ✅
