# Notes.io - AI-Powered Multilingual Exam Notes Generator

An intelligent, AI-driven platform that generates comprehensive, exam-specific study notes for Indian competitive and board examinations. Built with modern technologies to help students create structured, multilingual notes tailored to their exam requirements.

## 🎯 Project Overview

Notes.io is a specialized AI application designed to generate high-quality study notes for various Indian examinations including:
- **JEE Main** - Joint Entrance Examination Main
- **JEE Advanced** - Joint Entrance Examination Advanced
- **Class 10 Board Exams** - CBSE, ICSE, State Boards
- **Class 12 Board Exams** - CBSE, ICSE, State Boards
- And more Indian competitive/board examinations

The platform uses advanced AI models with Retrieval-Augmented Generation (RAG) capabilities to produce structured, exam-focused notes that align with specific exam patterns, syllabi, and requirements.

## 🏗️ Architecture

This is a **Turborepo monorepo** containing multiple packages and applications:

```
├── apps/
│   ├── frontend/          # Next.js 16 frontend application
│   └── backend/           # Express.js backend API server
├── packages/
│   ├── db/                # Prisma database package with shared schema
│   ├── schemas/           # Shared Zod validation schemas
│   ├── ui/                # Shared UI components
│   ├── eslint-config/     # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configurations
└── scripts/               # Build and deployment scripts
```

### Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI components
- Framer Motion
- React Hook Form + Zod

**Backend:**
- Express.js 5
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- AI SDK (Vercel AI SDK)
- Groq AI Models

**AI/ML:**
- Groq API (`openai/gpt-oss-20b`)
- RAG (Retrieval-Augmented Generation)
- Vector embeddings for document search
- Custom prompt engineering for exam-specific content

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm 9.0.0 (recommended package manager)
- PostgreSQL database
- Groq API key (for AI generation)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd newfile
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create `.env` files in the appropriate directories:

   **Backend** (`apps/backend/.env`):
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/notes_db"
   JWT_SECRET="your-jwt-secret-key"
   # For local development:
   FRONTEND_URL="http://localhost:3000"
   # For production (Vercel):
   # FRONTEND_URL="https://notes-io-frontend.vercel.app"
   GROQ_API_KEY="your-groq-api-key"
   PORT=3001

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   # For local development:
   GOOGLE_CALLBACK_URL="http://localhost:3001/api/v1/auth/google/callback"
   # For production (Render):
   # GOOGLE_CALLBACK_URL="https://notes-io-ocei.onrender.com/api/v1/auth/google/callback"
   ```

   **Frontend** (`apps/frontend/.env.local`):
   ```env
   NEXT_PUBLIC_BACKEND_URL="http://localhost:3001"
   ```

4. **Set up the database**
   ```bash
   cd packages/db
   pnpm prisma generate
   pnpm prisma migrate dev
   ```

5. **Build the project**
   ```bash
   pnpm build
   ```

### Running the Application

**Development Mode:**
```bash
# Run all apps (frontend + backend)
pnpm dev

# Or run specific apps
pnpm dev --filter=frontend
pnpm dev --filter=backend
```

**Production Mode:**
```bash
# Build all packages
pnpm build

# Start backend
cd apps/backend
pnpm start

# Start frontend (in another terminal)
cd apps/frontend
pnpm start
```

## 📁 Project Structure

### Frontend (`apps/frontend/`)

- `app/` - Next.js app router pages
  - `dashboard/c/[chatRoomId]/` - Chat interface pages
  - `signin/`, `signup/` - Authentication pages
- `components/` - React components
  - `chat-interface.tsx` - Main chat UI component
  - `notes-sidebar.tsx` - Chat history sidebar
  - `notesCanvas.tsx` - Notes display canvas
  - `ui/` - Reusable UI components (Radix UI based)
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and helpers

### Backend (`apps/backend/`)

- `src/index.ts` - Express server entry point
- `src/routes/` - API route handlers
- `src/services/` - Business logic services
  - `ai-service.ts` - AI response generation
  - `ai/rag.ts` - RAG implementation
  - `ai/generateTitle.ts` - Chat title generation
  - `prompt.ts` - System prompt builder
  - `memory.ts` - Message history management
  - `vector/vectorSearch.ts` - Vector similarity search
- `src/middleware.ts` - Authentication middleware
- `src/types.ts` - Type definitions and Zod schemas

### Database (`packages/db/`)

- `prisma/schema.prisma` - Prisma schema definitions
  - `User` - User accounts
  - `ChatRoom` - Conversation rooms
  - `Message` - Chat messages
  - `Document` - Generated notes/documents
  - `DocumentEmbedding` - Vector embeddings for RAG

## 🔑 Key Features

### 1. Exam-Specific Note Generation
- AI generates notes tailored to specific exam patterns (JEE Main, JEE Advanced, Board exams)
- Structured format matching exam requirements
- Multilingual support (English, Hindi, and more)

### 2. Chat-Based Interface
- Interactive chat UI for generating notes
- Conversation history and context management
- Streaming responses for real-time generation

### 3. Document Management
- Save and organize generated notes
- Vector embeddings for semantic search
- RAG-powered context retrieval

### 4. User Authentication
- Secure JWT-based authentication
- User profiles and preferences
- Multi-room chat support

### 5. Smart Features
- Auto-generated chat titles
- Recent message context (last 10 messages)
- Background processing for non-blocking operations

## 🛠️ Development

### Available Scripts

```bash
# Build all packages
pnpm build

# Development mode (watch mode)
pnpm dev

# Lint code
pnpm lint

# Format code
pnpm format

# Type checking
pnpm check-types

# Run specific package
pnpm --filter=backend dev
pnpm --filter=frontend dev
```

### Database Management

```bash
# Generate Prisma client
cd packages/db
pnpm prisma generate

# Create migration
pnpm prisma migrate dev --name migration_name

# Reset database
pnpm prisma migrate reset

# View database
pnpm prisma studio
```

## 🔧 Configuration

### AI Model Configuration

The AI model and prompts are configured in:
- `apps/backend/src/services/ai-service.ts` - Model selection and streaming
- `apps/backend/src/services/prompt.ts` - System prompt generation

Current model: `groq("openai/gpt-oss-20b")`

### Exam-Specific Prompts

The system detects exam types from user queries and generates appropriate prompts. Exam-specific contexts are handled in the prompt builder to ensure:
- Relevant syllabus coverage
- Appropriate difficulty level
- Format matching exam requirements
- Language preferences

## 📝 API Endpoints

### Authentication
- `POST /api/v1/signup` - User registration
- `POST /api/v1/signin` - User login
- `GET /api/v1/me` - Get current user (protected)

### Chat Management
- `GET /api/v1/getAllChatRooms` - Get user's chat rooms (protected)
- `GET /api/v1/getRooms` - Get most recent chat room (protected)
- `POST /api/v1/createChatRoom` - Create new chat room (protected)
- `POST /api/v1/chat/:chatRoomId` - Send message (protected, streaming)
- `GET /api/v1/chat/:chatRoomId/messages` - Get chat messages (protected)

### Health
- `GET /api/v1/health` - Health check

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify `DATABASE_URL` in `.env`
   - Ensure PostgreSQL is running
   - Run `pnpm prisma generate` and `pnpm prisma migrate dev`

2. **AI Generation Not Working**
   - Check `GROQ_API_KEY` is set correctly
   - Verify API quota/limits
   - Check backend logs for errors

3. **Frontend Can't Connect to Backend**
   - Verify `NEXT_PUBLIC_BACKEND_URL` matches backend port
   - Check CORS configuration in backend
   - Ensure backend is running

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

[Specify your license here]

## 🙏 Acknowledgments

- Built with [Turborepo](https://turborepo.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- AI capabilities powered by [Groq](https://groq.com/)
- Database management with [Prisma](https://www.prisma.io/)

## 📧 Contact

[Add your contact information or project maintainer details]

---

**Note:** This project is actively being refined, especially the AI model prompts for better exam-specific note generation. Contributions and feedback are welcome!
