Below are the steps to run this project on your local system

1. Clone the Repository on your Machine.
2. After Cloning the repo cd into the Dream_Roots-task.
3. Run the following command after navigating inside the folder: npm i. It will install the necessary node module for running the project.
4. Execute the following command after 3rd step: node app.js. This will run the application on your system.

Below are the APIs :-

1. AddUser Api
   URL:http://localhost:3000/add_user_details //Post Request
   body:{
   "name": "rajat",
   "age": "23",
   "email": "rajat@test.com",
   "city": "chandigarh",
   "phone": "1234567899"
   }

2. Create Admin Api //Post Request
   URL:http://localhost:3000/create_admin
   body:{
   "name":"dreamRoots",
   "email":"dreamRoots@test.com",
   "password":"123456",
   "secret":"DREAMROOTSECRETKEY"
   }

3. Admin Login Api //Post Request
   URL:http://localhost:3000/admin_login
   body:{
   "email": "dreamRoots@test.com",
   "password": "123456"
   }

4. Admin Logout Api //Post Request
   URL: http://localhost:3000/admin_logout
   body:{
   "token": "Your Token",
   "email": "dreamRoots@test.com"
   }

5. Get Users Api //Get Request
   URL:http://localhost:3000/get_users
   body:{
   "token":"Your Token"
   }
