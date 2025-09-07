EventPortal Client

A React.js frontend for the Campus Event Management Portal.

The app has two types of users:

Admin – can add, edit, and manage events.

Student – can browse events and register for them.

The data is stored in a MySQL database.


Features

Secure login and registration

Admin dashboard to manage events

Student event browsing and registration

Profile management

Responsive design for desktop and mobile


Setup
Prerequisites

Node.js v16+

npm or yarn

MySQL database

Installation

Clone the repository:

git clone https://github.com/SaiSatvikGootyKase/Webknot.git
cd Webknot


Install dependencies:

npm install
# or
yarn install


Create a .env file in the root:

REACT_APP_API_URL=http://localhost:5000/api


Start the development server:

npm start
# or
yarn start


The app will run at: http://localhost:3000

Build for Production
npm run build
# or
yarn build


This will generate a build/ folder ready to deploy.

Project Structure
src/
├── components/        # Reusable UI components
├── contexts/          # Authentication and other contexts
├── pages/             # Pages: Login, Register, Dashboard, Events, etc.
├── utils/             # API and helper functions
├── App.js             # Main component
├── index.js           # Entry point
└── index.css          # Global styles


Usage

Admin: Log in → Add or manage events → View reports and dashboards.

Student: Log in → Browse events → Register → View personal registrations.

Notes

Make sure the MySQL server is running and backend API is configured correctly.

Admin and student roles are handled on the backend for proper access control.
