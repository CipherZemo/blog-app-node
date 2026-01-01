This is a simple Blog application where you can post images and users can like or post comments. This is a basic MERN application that supports all CRUD functions related to a blog. This application has very limited features compared to real world blog apps because i made this for beginners to learn how backend works and hence reduced the complextity.Backend is very strong with high secuirity for users and real time authentication for every single operations.


The frontend is made using HTML,EJS,bootstrap CSS, backend is made using NodeJS and MongoDB. Here we can post only photos, and they are stored locally using multer. This project basically has on strong backend that focuses on only CRUD operations, hence several features such as account management, video posting, multiple posts together etc. are not implemented.


You can run this locally, just pull this repo to your working directory using the link or dwld the zip. After that just visit package.json and install all the dependencies that are listed there(devdependencies are also needed). Now got to terminal and use npm run to execute the app.(the commands are there in package.json under scripts, run in dev mode so that it restarts the server for every changes).Before running you need to create 2 folders, an "uploads" for storing images and an .env file that has your running PORT, DB_URI, JWT_SECRET(jwt secret key).


There is also an admin dashboard feature, where admin has all CRUD controls over posts.Initially there is no admin, so there is a seeder.js file which runs only in terminal and not along app to create an admin. You can change the admin credentials as per your need in that seeder file and run it in terminal(node seeder.js).
