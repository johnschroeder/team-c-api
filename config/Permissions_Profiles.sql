#ADMIN ONLY:
INSERT INTO RoutePermissions VALUES("/EditUser", 3);
INSERT INTO RoutePermissions VALUES("/Login/createUser", 3);
INSERT INTO RoutePermissions VALUES("/getAllUsers", 3);
INSERT INTO RoutePermissions VALUES("/getAllUsersFilterFirstName", 3);
INSERT INTO RoutePermissions VALUES("/getAllUsersFilterLastName", 3);
INSERT INTO RoutePermissions VALUES("/getAllPermissions", 3);
INSERT INTO RoutePermissions VALUES("/getUser", 3);
#Employee and ADMIN:
INSERT INTO RoutePermissions VALUES("/AddInventory", 3),("/AddInventory", 1);
INSERT INTO RoutePermissions VALUES("/GetInventoryLocations", 3),("/GetInventoryLocations", 1);
INSERT INTO RoutePermissions VALUES("/AddProductSize", 3),("/AddProductSize", 1);
INSERT INTO RoutePermissions VALUES("/Carts/AddItemToCart", 3),("/Carts/AddItemToCart", 1);
INSERT INTO RoutePermissions VALUES("/Carts/AddItemToCartGeneral", 3),("/Carts/AddItemToCartGeneral", 1);
INSERT INTO RoutePermissions VALUES("/Carts/CreateCart", 3),("/Carts/CreateCart", 1);
INSERT INTO RoutePermissions VALUES("/Carts/DeleteCart", 3),("/Carts/DeleteCart", 1);
INSERT INTO RoutePermissions VALUES("/Carts/DeleteItemInCart", 3),("/Carts/DeleteItemInCart", 1);
INSERT INTO RoutePermissions VALUES("/Carts/EditCart", 3),("/Carts/EditCart", 1);
INSERT INTO RoutePermissions VALUES("/Carts/EditCartItem", 3),("/Carts/EditCartItem", 1);
INSERT INTO RoutePermissions VALUES("/reSubmit", 3),("/reSubmit", 1);
INSERT INTO RoutePermissions VALUES("/DeleteProductByID", 3),("/DeleteProductByID", 1);
INSERT INTO RoutePermissions VALUES("/EditProduct", 3),("/EditProduct", 1);
INSERT INTO RoutePermissions VALUES("/addPile", 3),("/addPile", 1);
INSERT INTO RoutePermissions VALUES("/addRun", 3),("/addRun", 1);
INSERT INTO RoutePermissions VALUES("/newProductSubmission", 3),("/newProductSubmission", 1);
INSERT INTO RoutePermissions VALUES("/addCustomer", 3),("/addCustomer", 1);
INSERT INTO RoutePermissions VALUES("/removePile", 3),("/removePile", 1);
INSERT INTO RoutePermissions VALUES("/removeRun", 3),("/removeRun", 1);
INSERT INTO RoutePermissions VALUES("/removeCustomersByProductID", 3),("/removeCustomersByProductID", 1);
INSERT INTO RoutePermissions VALUES("/uploadImage", 3),("/uploadImage", 1);
#ADMIN, Acount Manager, Employee
INSERT INTO RoutePermissions VALUES("/checkPermissions", 3),("/checkPermissions", 2),("/checkPermissions", 1);
INSERT INTO RoutePermissions VALUES("/Carts/GetAllCarts", 3),("/Carts/GetAllCarts", 2),("/Carts/GetAllCarts", 1);
INSERT INTO RoutePermissions VALUES("/Carts/GetCartItems", 3),("/Carts/GetCartItems", 2),("/Carts/GetCartItems", 1);
INSERT INTO RoutePermissions VALUES("/Carts/GetCartsByUser", 3),("/Carts/GetCartsByUser", 2),("/Carts/GetCartsByUser", 1);
INSERT INTO RoutePermissions VALUES("/Carts/GetInventoryAvailable", 3),("/Carts/GetInventoryAvailable", 2),("/Carts/GetInventoryAvailable", 1);
INSERT INTO RoutePermissions VALUES("/Carts/GetPossibleAssignees", 3),("/Carts/GetPossibleAssignees", 2),("/Carts/GetPossibleAssignees", 1);
INSERT INTO RoutePermissions VALUES("/Carts/InventoryByProductID", 3),("/Carts/InventoryByProductID", 2),("/Carts/InventoryByProductID", 1);
INSERT INTO RoutePermissions VALUES("/Carts/PutCartModel", 3),("/Carts/PutCartModel", 2),("/Carts/PutCartModel", 1);
INSERT INTO RoutePermissions VALUES("/Carts/GetCartModel", 3),("/Carts/GetCartModel", 2),("/Carts/GetCartModel", 1);
INSERT INTO RoutePermissions VALUES("/Carts/getproductforaddrow", 3),("/Carts/getproductforaddrow", 2),("/Carts/getproductforaddrow", 1);
INSERT INTO RoutePermissions VALUES("/FindAssociatesByProductID", 3),("/FindAssociatesByProductID", 2),("/FindAssociatesByProductID", 1);
INSERT INTO RoutePermissions VALUES("/GetSizeByProductID", 3),("/GetSizeByProductID", 2),("/GetSizeByProductID", 1);
INSERT INTO RoutePermissions VALUES("/GetSizeMapID", 3),("/GetSizeMapID", 2),("/GetSizeMapID", 1);
INSERT INTO RoutePermissions VALUES("/Logging/AddLogViewMapEntry", 3),("/Logging/AddLogViewMapEntry", 2),("/Logging/AddLogViewMapEntry", 1);
INSERT INTO RoutePermissions VALUES("/Login/confirmUser", 3),("/Login/confirmUser", 2),("/Login/confirmUser", 1);
INSERT INTO RoutePermissions VALUES("/Login/login", 3),("/Login/login", 2),("/Login/login", 1),("/Login/login", 0);
INSERT INTO RoutePermissions VALUES("/Login/testLookup", 3),("/Login/testLookup", 2),("/Login/testLookup", 1);
INSERT INTO RoutePermissions VALUES("/associateProductCustomer", 3),("/associateProductCustomer", 2),("/associateProductCustomer", 1);
INSERT INTO RoutePermissions VALUES("/cookieValidator", 3),("/cookieValidator", 2),("/cookieValidator", 1);
INSERT INTO RoutePermissions VALUES("/createLog", 3),("/createLog", 2),("/createLog", 1);
INSERT INTO RoutePermissions VALUES("/customerAutoComplete", 3),("/customerAutoComplete", 2),("/customerAutoComplete", 1);
INSERT INTO RoutePermissions VALUES("/displayInventory", 3),("/displayInventory", 2),("/displayInventory", 1);
INSERT INTO RoutePermissions VALUES("/getCustomers", 3),("/getCustomers", 2),("/getCustomers", 1);
INSERT INTO RoutePermissions VALUES("/getLogs", 3),("/getLogs", 2),("/getLogs", 1);
INSERT INTO RoutePermissions VALUES("/LogFilterMappings", 3),("/LogFilterMappings", 2),("/LogFilterMappings", 1);
INSERT INTO RoutePermissions VALUES("/getUserInfo", 3),("/getUserInfo", 2),("/getUserInfo", 1);
INSERT INTO RoutePermissions VALUES("/itemAutoComplete", 3),("/itemAutoComplete", 2),("/itemAutoComplete", 1);
INSERT INTO RoutePermissions VALUES("/itemDetail", 3),("/itemDetail", 2),("/itemDetail", 1);
INSERT INTO RoutePermissions VALUES("/GetRunsByProduct", 3),("/GetRunsByProduct", 2),("/GetRunsByProduct", 1);
INSERT INTO RoutePermissions VALUES("/redis/GetState", 3),("/redis/GetState", 2),("/redis/GetState", 1);
INSERT INTO RoutePermissions VALUES("/redis/SetState", 3),("/redis/SetState", 2),("/redis/SetState", 1);
INSERT INTO RoutePermissions VALUES("/searchCustomer", 3),("/searchCustomer", 2),("/searchCustomer", 1);
INSERT INTO RoutePermissions VALUES("/searchItem", 3),("/searchItem", 2),("/searchItem", 1);
INSERT INTO RoutePermissions VALUES("/Login/LogOut", 3),("/Login/LogOut", 2),("/Login/LogOut", 1);
INSERT INTO RoutePermissions VALUES("/getAllLogs", 3);

#html Files
INSERT INTO RoutePermissions VALUES("Home.html", 3),("Home.html", 2),("Home.html", 1);
INSERT INTO RoutePermissions VALUES("ViewCarts.html", 3),("ViewCarts.html", 2),("ViewCarts.html", 1);
INSERT INTO RoutePermissions VALUES("PullInventory.html", 3),("PullInventory.html", 1);
INSERT INTO RoutePermissions VALUES("NewProduct.html", 3),("NewProduct.html", 1);
INSERT INTO RoutePermissions VALUES("ManageUsers.html", 3);
INSERT INTO RoutePermissions VALUES("Logs.html", 3),("Logs.html", 2),("Logs.html", 1);
INSERT INTO RoutePermissions VALUES("loginForm.html", 3),("loginForm.html", 2),("loginForm.html", 1),("loginForm.html", 0);
INSERT INTO RoutePermissions VALUES("itemDetailView.html", 3),("itemDetailView.html", 2),("itemDetailView.html", 1);
INSERT INTO RoutePermissions VALUES("indexBody.html", 3),("indexBody.html", 2),("indexBody.html", 1);
INSERT INTO RoutePermissions VALUES("EditProduct.html", 3),("EditProduct.html", 1);
INSERT INTO RoutePermissions VALUES("EditCartItems.html", 3),("EditCartItems.html", 1);
INSERT INTO RoutePermissions VALUES("EditCartData.html", 3),("EditCartData.html", 1);
INSERT INTO RoutePermissions VALUES("DisplayInventory.html", 3),("DisplayInventory.html", 2),("DisplayInventory.html", 1);
INSERT INTO RoutePermissions VALUES("CreateUser.html", 3);
INSERT INTO RoutePermissions VALUES("confirmUser.html", 3),("confirmUser.html", 2),("confirmUser.html", 1),("confirmUser.html", 0);
INSERT INTO RoutePermissions VALUES("AddInventory.html", 3),("AddInventory.html", 1);
INSERT INTO RoutePermissions VALUES("ShowQRCode.html", 3),("ShowQRCode.html", 1);
INSERT INTO RoutePermissions VALUES("AdminLogs.html", 3);
INSERT INTO RoutePermissions VALUES("EditUser.html", 3);