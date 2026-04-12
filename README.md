# Drivona - AI-Powered Chat Application

A modern, full-stack chat application built with React Native, Expo, Node.js, Express, and MongoDB. Features real-time messaging, user authentication, and AI-powered conversation mode.

## 📱 Project Overview

Drivona is a WhatsApp-like chat application that allows users to:
- Register and login securely
- Search and connect with other users
- Send and receive messages in real-time
- Toggle AI mode for AI-powered responses
- Manage user profile

---

## 🛠️ Tech Stack

### **Frontend (React Native + Expo)**
- **Framework**: Expo Router (File-based routing)
- **Language**: TypeScript
- **UI Framework**: React Native
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Local Storage**: AsyncStorage
- **Icons**: Expo Icons (Ionicons)
- **Styling**: React Native StyleSheet

### **Backend (Node.js)**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **CORS**: cors package
- **Environment Config**: dotenv

### **Database (MongoDB)**
- **Collections**:
  - `users` - User accounts and profiles
  - `chats` - Chat conversations between users
  - `messages` - Individual messages within chats

---

## 📁 Project Structure

```
AI-Persona/
├── Drivona/                          
│   ├── app/
│   │   ├── _layout.tsx               # Root navigation
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx             # Login screen
│   │   │   └── register.tsx          # Registration screen
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx           # Tab navigation
│   │   │   ├── index.tsx             # Chats list screen
│   │   │   └── profile.tsx           # User profile screen
│   │   ├── chat/
│   │   │   └── [id].tsx              # Individual chat screen
│   │   └── search.tsx                # Search users screen
│   ├── components/
│   │   ├── chat/
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── ChatHeader.tsx
│   │   │   └── ChatInput.tsx
│   │   └── common/
│   │       ├── Avatar.tsx
│   │       └── LoadingSpinner.tsx
│   ├── constants/
│   │   └── colors.js                 # Theme & Colors
│   ├── context/
│   │   └── AuthContext.tsx           # Authentication state
│   ├── services/
│   │   ├── api.js                    # Axios HTTP client
│   │   └── mockApi.js                # Mock data (development)
│   ├── types/
│   │   └── index.js                  # TypeScript interfaces
│   ├── utils/
│   │   └── formatters.js             # Helper functions
│   ├── hooks/
│   ├── app.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   └── README.md
│
└── Drivona-Backend/                  
    ├── src/
    │   ├── models/
    │   │   ├── User.js               # User schema
    │   │   ├── Chat.js               # Chat schema
    │   │   └── Message.js            # Message schema
    │   ├── controllers/
    │   │   ├── authController.js     # Auth logic (register/login)
    │   │   ├── userController.js     # User operations
    │   │   ├── chatController.js     # Chat operations
    │   │   └── messageController.js  # Message operations
    │   ├── routes/
    │   │   ├── authRoutes.js         # /api/auth/*
    │   │   ├── userRoutes.js         # /api/users/*
    │   │   └── chatRoutes.js         # /api/chats/*
    │   ├── middleware/
    │   │   └── auth.js               # JWT verification
    │   ├── services/
    │   │   └── aiService.js          # AI response generation
    │   ├── types/
    │   │   └── index.js              # TypeScript interfaces
    │   ├── utils/
    │   │   └── validators.js         # Input validation
    │   └── index.js                  # Main server file
    ├── dist/                         # Compiled JavaScript
    ├── .env
    ├── package.json
    ├── tsconfig.json
    ├── nodemon.json
    └── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Expo CLI** (`npm install -g expo-cli`)

### Installation

#### **1. Clone the Repository**

```bash
git clone https://github.com/yourusername/drivona.git
cd drivona
```

#### **2. Setup Backend**

```bash
cd Drivona-Backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=3000
MONGODB_URI=mongodb://localhost:27017/drivona
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
CORS_ORIGIN=http://localhost:8081
EOF

# Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest
# OR if MongoDB is installed locally:
mongod

# Start backend server
npm run dev
```

Server will run on `http://localhost:3000`

#### **3. Setup Frontend**

```bash
cd ../Drivona

# Install dependencies
npm install

# Create .env file (optional)
cat > .env << EOF
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EOF

# Start Expo development server
npx expo start

# Press:
# - 'i' for iOS simulator
# - 'a' for Android emulator
# - 'w' for web
```

---

## 📚 API Documentation

### **Authentication Endpoints**

#### Register User
```
POST /api/auth/register

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```
POST /api/auth/login

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Logout
```
POST /api/auth/logout
Headers: Authorization: Bearer <token>
```

---

### **User Endpoints**

#### Search Users
```
GET /api/users/search?email=john
Headers: Authorization: Bearer <token>

Response: User[]
```

#### Get Profile
```
GET /api/users/profile
Headers: Authorization: Bearer <token>

Response: User
```

#### Update Profile
```
PUT /api/users/profile
Headers: Authorization: Bearer <token>

Body:
{
  "name": "Updated Name",
  "avatar": "avatar_url"
}

Response: User
```

---

### **Chat Endpoints**

#### Get All Chats
```
GET /api/chats
Headers: Authorization: Bearer <token>

Response: Chat[]
```

#### Get Chat by ID
```
GET /api/chats/:chatId
Headers: Authorization: Bearer <token>

Response: Chat
```

#### Create Chat
```
POST /api/chats
Headers: Authorization: Bearer <token>

Body:
{
  "participantId": "user_id_of_participant"
}

Response: Chat
```

#### Toggle AI Mode
```
PATCH /api/chats/:chatId/ai-mode
Headers: Authorization: Bearer <token>

Body:
{
  "enabled": true
}

Response: Chat
```

---

### **Message Endpoints**

#### Get Chat Messages
```
GET /api/chats/:chatId/messages?page=1&limit=50
Headers: Authorization: Bearer <token>

Response: Message[]
```

#### Send Message
```
POST /api/chats/:chatId/messages
Headers: Authorization: Bearer <token>

Body:
{
  "content": "Hello!",
  "aiMode": false
}

Response: Message
```

---

## 🔐 Authentication

The application uses **JWT (JSON Web Tokens)** for authentication:

1. User registers/logs in
2. Backend generates JWT token
3. Token stored in AsyncStorage (frontend)
4. Token sent in `Authorization: Bearer <token>` header for protected routes
5. Backend verifies token using `authMiddleware`

**Token Expiry**: 7 days

---

## 🤖 AI Mode

When AI mode is enabled in a chat:

1. User sends a message
2. Backend creates the message
3. AI Service generates an automated response
4. Response is added to the chat as an `isAI: true` message

AI responses are generated by the `aiService.js` file.

---

## 📝 Database Schema

### **User**
```typescript
{
  _id: ObjectId
  name: string (required)
  email: string (required, unique)
  password: string (hashed, required)
  avatar: string (optional)
  createdAt: Date
  updatedAt: Date
}
```

### **Chat**
```typescript
{
  _id: ObjectId
  participants: [ObjectId, ObjectId] (2 user IDs)
  lastMessage: ObjectId (reference to Message)
  aiModeEnabled: boolean (default: false)
  unreadCount: number (default: 0)
  createdAt: Date
  updatedAt: Date
}
```

### **Message**
```typescript
{
  _id: ObjectId
  chatId: ObjectId (reference to Chat)
  senderId: ObjectId (reference to User)
  content: string (required)
  isAI: boolean (default: false)
  createdAt: Date
  updatedAt: Date
}
```

---

## 🧪 Testing

### Test Credentials (Development)

When using mock API (frontend development):
```
Email: test@drivona.com
Password: password
```

Or create a new account via registration.

### Searchable Users (Mock)
```
john@drivona.com
jane@drivona.com
mike@drivona.com
```

---

## 📦 Deployment

### Frontend Deployment (Expo)

```bash
cd Drivona

# Build for production
eas build --platform all

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

### Backend Deployment (Heroku/Railway/Render)

```bash
cd Drivona-Backend

# Build TypeScript
npm run build

# Deploy
git push heroku main
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Make sure MongoDB is running:
docker ps  # Check if MongoDB container is running
docker start mongodb  # Start if stopped
```

### Port Already in Use
```bash
# Change PORT in .env or kill process using port 3000
lsof -i :3000
kill -9 <PID>
```

### CORS Error
```
Update CORS_ORIGIN in backend .env:
CORS_ORIGIN=http://your-frontend-url
```

---

## 📄 Environment Variables

### Frontend (.env)
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### Backend (.env)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/drivona
JWT_SECRET=your_secret_key_here
NODE_ENV=development
CORS_ORIGIN=http://localhost:8081
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Ghanshyam Singh**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: ghanshyam@example.com

---

## 🙏 Acknowledgments

- Expo for the React Native framework
- Express.js for the server framework
- MongoDB for the database
- All contributors and supporters

---

## 📞 Support

For support, open an issue on GitHub or contact the author.

**Happy Coding! 🚀**