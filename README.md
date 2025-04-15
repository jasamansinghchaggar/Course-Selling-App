# Course Selling App

A Node.js and Express-based backend for a course selling platform. It supports user and admin authentication, course management, and purchase tracking using MongoDB.

## Features

- User signup and login (JWT-based authentication)
- Admin signup and login (JWT-based authentication)
- Admin can create, update, delete, and view their own courses
- Users can view all courses, purchase courses, and view their purchased courses
- MongoDB for data storage (Mongoose ODM)
- Input validation using Zod
- Password hashing with bcrypt
- Express routing and middleware for clean structure

## Project Structure

```
├── db.js                # Mongoose models and schemas
├── index.js             # Entry point, Express app setup
├── jwt.config.js        # JWT secret config (uses dotenv)
├── middlewares/
│   ├── admin.middleware.js
│   └── user.middleware.js
├── routes/
│   ├── admin.routes.js
│   ├── courses.routes.js
│   └── user.routes.js
├── package.json
├── .env.example         # Example environment variables
└── README.md
```

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment variables**
   - Copy `.env.example` to `.env` and fill in your MongoDB URI and JWT secrets.
4. **Start the server**
   ```bash
   npm run dev
   # or
   npm start
   ```

## API Endpoints

### User Routes (`/user`)
- `POST /signup` — Register a new user
- `POST /signin` — Login as user, returns JWT
- `GET /purchases` — Get user's purchased courses (requires JWT)

### Admin Routes (`/admin`)
- `POST /signup` — Register a new admin
- `POST /signin` — Login as admin, returns JWT
- `POST /course` — Create a new course (requires JWT)
- `PUT /course` — Update a course (requires JWT)
- `DELETE /course` — Delete a course (requires JWT)
- `GET /course` — List admin's created courses (requires JWT)

### Course Routes (`/courses`)
- `GET /` — List all courses
- `POST /purchase` — Purchase a course (requires JWT)

## Models
- **User**: email, password, firstName, lastName
- **Admin**: email, password, firstName, lastName
- **Course**: title, description, price, imageUrl, creatorId
- **Purchase**: userId, courseId

## Good to Haves (Not Implemented)
- Use cookies instead of JWT for auth
- Add a rate limiting middleware
- Frontend in EJS or React

---

Feel free to contribute or extend the project!