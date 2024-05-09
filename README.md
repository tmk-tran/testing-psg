# Preferred Savings Guide (co-op project, Dec 2023 - May 2024)
This application is a continuation of our client project developed in the Koss cohort at Emerging Digital Academy. This second version aims to enhance the existing platform by providing a comprehensive solution for coupon development, management, and sales. The key objectives of this project include:

 - Coupon Development Platform: Enable administrators to create, manage, and publish coupons, facilitating the entire lifecycle from initial design to consumer availability.

 - Task Tracking System: Implement a task management feature for administrators to track, create, update, and complete tasks. This feature also enables communication with graphic designers for coupon development and facilitates communication with merchants.

 - Seller Organization: Provide tools to organize sellers associated with organizations. This includes tracking metrics such as books sold, due, sales data, and other relevant information.

 - Unique Seller URLs: Generate and assign unique URLs to sellers, allowing them to sell coupon books for their fundraisers effectively.

 - PayPal Integration: Integrate PayPal payment gateway to facilitate secure transactions within the application.

This project aims to streamline the coupon management process, enhance seller organization, and improve overall user experience for both administrators and sellers.

## Additional objectives:
In addition to the main objectives, various enhancements provided our team with the opportunity to further expand the application's functionality, incorporating:

 - Active Campaign API Integration: Implement the Active Campaign API to automate email communication with users. This integration allows for user management tasks such as assigning new users to the application and facilitating password reset processes.

 - Enhanced User Management: Develop a feature for application administrators to manage user information more effectively. This includes editing usernames, assigning coupon books to users, and removing users from the application as needed.


# PSG Admin Dashboard (client project, Nov 2023)

The first version of this project was developed as an admin dashboard for the Preferred Savings Guide based in Fargo, ND. Admin users will be able to log in, add, delete, and edit organizations and groups that host fundraisers. The fundraisers track the books requested, sold, checked back in, as well as money received and outstanding balance. This is the first step in a bigger project to digitize part of their coupon book to cut costs and be less paper waste for the enviorment.

### Authors

Joe Colago, Alyssa Nichols, and T Mark Schisel

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. This project should be able to run in your favorite IDE. I used VS code while building it.

### Prerequisites

Before you get started, make sure you have the following software installed on your computer:

- [Node.js](https://nodejs.org/en/)

### Installation

1. Fork the repository
2. Copy the SSH key in your new repository
3. In your terminal type... `git clone {paste SSH link}`
4. Navigate into the repository's folder in your terminal
5. Open VS Code (or editor of your choice) and open the folder
6. In the terminal of VS Code run `npm install` to install all dependencies
7. Create a `.env` file at the root of the project and paste this line into the file:

```
SERVER_SESSION_SECRET=superDuperSecret
```

While you're in your new `.env` file, take the time to replace `superDuperSecret` with some long random string like `imArandomString12345changeMe` to keep your application secure. Here's a site that can help you: [https://passwordsgenerator.net/](https://passwordsgenerator.net/). If you don't do this step, create a secret with less than eight characters, or leave it as `superDuperSecret`, you will get a warning. 8. Create a database named `psg_project` in PostgresSQL
-If you would like to name your database something else, you will need to change `psg_project` to the name of your new database name in `server/modules/pool.js` 9. The queries in the database.sql file are set up to create all the necessary tables that you need, as well as mock data to test the app. Copy and paste those queries in the SQL query of the database. If this is going to production, leave out the mock data. 10. Start postgres if not running already by using `brew services start postgresql` 11. Run `npm run server` in your VS Code terminal 12. Open a second terminal and run `npm run client` 13. Navigate to `localhost:3000`

## Database Configuration

- For this project, we created a database using Postico 2
- If you would like to create a database using mock data, please review the database.sql file

## Built With

- VS Code <a href="https://code.visualstudio.com/"><img src="https://github.com/devicons/devicon/blob/master/icons/vscode/vscode-original-wordmark.svg" height="30px" width="30px" /></a>
- Css <a href="https://www.w3schools.com/w3css/defaulT.asp"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" height="30px" width="30px" /></a>
- Html <a href="https://www.w3schools.com/html/"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg" height="30px" width="30px" /></a>
- Javascript <a href="https://www.w3schools.com/js/default.asp"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" height="30px" width="30px" /></a>
- Postgres <a href="https://www.postgresql.org/"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" height="30px" width="30px" /></a>
- React <a href="https://reactjs.org/"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" height="30px" width="30px" /></a>
- Redux <a href="https://redux.js.org/"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redux/redux-original.svg" height="30px" width="30px" /></a>
- Material UI <a href="https://material-ui.com/"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/materialui/materialui-original.svg" height="30px" width="30px" /></a>
- Node JS <a href="https://nodejs.org/en/"><img src="https://github.com/devicons/devicon/blob/master/icons/nodejs/nodejs-plain.svg" height="30px" width="30px" /></a>
- FuseJs <a href="https://fusejs.io/"><img src="https://github.com/devicons/devicon/blob/master/icons/fusejs/fusejs-plain.svg" height="30px" width="30px" alt="Fuse.js"></a>
- Sweet Alerts <a href="https://sweetalert2.github.io/"><img src="https://raw.githubusercontent.com/sweetalert2/sweetalert2/master/assets/sweetalert2.png" height="30px" width="30px" alt="SweetAlert2"></a>

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Thanks to Emerging Digital Academy for teaching us the skills to complete this project

- Thank you to our clients, Chris and Wendy from the Preferred Savings Guide

- A big thanks to Anthony at Devii for providing us with a client, and for your support throughout the project

- Thanks to Ann, for guiding us through to project completion
