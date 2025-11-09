# Todo Application

A full-stack todo application with user authentication, task management, and email notifications.

## Features

- User Authentication (Sign up, Login)
- Task Management (Create, Read, Update, Delete)
- Email notifications for task reminders
- Responsive UI design
- Task scheduling
- Secure API endpoints

## Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- SendGrid (for email notifications)

## Project Structure

```
todo-app/
├── frontend/
│   ├── css/
│   │   ├── auth.css
│   │   ├── homestyle.css
│   │   ├── style.css
│   │   └── todostyle.css
│   ├── js/
│   │   ├── auth.js
│   │   └── todo.js
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   └── todo.html
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authcontroller.js
│   │   └── taskcontroller.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── services/
│   │   ├── emailService.js
│   │   └── schedulerService.js
│   └── server.js
└── package.json
```

## Setup Instructions

1. Clone the repository
   ```bash
   git clone https://github.com/niteshkumar8848/TODO-APP.git
   cd todo-app
   ```

2. Install dependencies
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   ```

3. Environment Setup
   Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   SENDGRID_API_KEY=your_sendgrid_api_key
   ```

4. Run the application
   ```bash
   # From the root directory
   npm run dev
   ```
   This will start both the frontend and backend servers concurrently.

## Available Scripts

- `npm run dev`: Starts both frontend and backend in development mode
- `npm run backend`: Starts only the backend server
- `npm run frontend`: Starts only the frontend server
- `npm start`: Starts the production server

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register a new user
- POST `/api/auth/login` - Login user

### Tasks
- GET `/api/tasks` - Get all tasks for authenticated user
- POST `/api/tasks` - Create a new task
- PUT `/api/tasks/:id` - Update a task
- DELETE `/api/tasks/:id` - Delete a task

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
