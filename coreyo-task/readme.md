Below are the steps to run this project on your local system

1. Clone the Repository on your Machine.
2. After Cloning the repo cd into the coreyo-task.
3. Run the following command after navigating inside the folder: npm i. It will install the necessary node module for running the project.
4. Execute the following command after 3rd step: node app.js. This will run the application on your system.

Below are the APIs :-

1. Signup Api
   URL:http://localhost:3000/signup
   body:{
   "name":"rajat",
   "email":"rajat@gmail.com",
   "password":"rajatchoudhary"
   }

2. Login Api
   URL:http://localhost:3000/login
   body:{
   "email": "rajat@gmail.com",
   "password": "rajatchoudhary"
   }

3. News Api
   URL:http://localhost:3000/news?search=bitcoin //You have to login before accessing this api.
   body:{
   token:"Token generated" //Token will be provided after login.
   }

4. Weather Api
   URL: http://localhost:3000/weather

5. Logout Api
   URL:http://localhost:3000/logout
   body:{
   token:"Token generated" //Token will be provided after login.
   email:"rajat@gmail.com"
   }
