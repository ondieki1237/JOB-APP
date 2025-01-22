# service
# Blue Collar Backend

## Project Overview
This project serves as the backend for the Blue Collar application. It is built with Node.js and Express, with MongoDB as the database. The application handles user authentication, file uploads, and more.

---

## Prerequisites
Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [Yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/atlas/database) (Atlas or local setup)

---

## Project Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd blue-collar-backend
```

### 2. Install Dependencies
Use Yarn to install project dependencies:
```bash
yarn install
```

### 3. Environment Variables
Create a `.env` file in the root of your project and add the following environment variables:

```env
PORT=5000
DB_URI=mongodb+srv://evans:eVANCE%3F1997@ogola.jtdv4.mongodb.net/
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> **Note:** Ensure special characters in the MongoDB connection string are properly escaped.

### 4. Update MongoDB Connection (`db.js`)
The database connection file (`src/config/db.js`) should look like this:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected...');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
```

---

## Running the Project

### Development Mode
To start the server in development mode using `nodemon`:
```bash
yarn dev
```

### Production Mode
To start the server normally:
```bash
yarn start
```

---

## Project Structure
```
blue-collar-backend/
├── src/
│   ├── config/
│   │   └── db.js          # Database connection setup
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Middleware functions
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── index.js           # Main entry point
├── .env                   # Environment variables
├── package.json           # Project dependencies and scripts
└── README.md              # Project documentation
```

---

## MongoDB Setup

### Using MongoDB Atlas
1. Sign up for [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Create a new cluster.
3. Configure the cluster with IP whitelist and create a database user.
4. Use the following connection string (modify with your credentials):

```plaintext
mongodb+srv://<username>:<password>@<cluster-address>/<dbname>
```

### Escaping Special Characters
If your password contains special characters (e.g., `?`, `@`), replace them with percent-encoded equivalents. For example:
- `?` becomes `%3F`
- `@` becomes `%40`

Example:
```plaintext
mongodb+srv://evans:eVANCE%3F1997@ogola.jtdv4.mongodb.net/
```

---

## Common Errors & Debugging

### Error: `Command "dev" not found`
Ensure your `package.json` includes the following scripts:
```json
"scripts": {
  "start": "node src/index.js",
  "dev": "nodemon src/index.js"
}
```
Run:
```bash
yarn install
```

### Error: `Password contains unescaped characters`
Escape special characters in your MongoDB connection string as explained above.

### Debugging Tips
- Check your `.env` file for accuracy.
- Use `console.log` to debug variables in `db.js` or other files.
- Restart the server after every code change in production mode.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Contributors
- Evans Ogola (Developer)
- Open to Contributions

