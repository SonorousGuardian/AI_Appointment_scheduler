# Quick Installation Guide

This project uses **Node.js** (not Python), so dependencies are managed via `package.json` instead of `requirements.txt`.

## ⚡ Quick Start (Automated)

### Windows:

```powershell
powershell -ExecutionPolicy Bypass -File install.ps1
```

### Linux/Mac:

```bash
chmod +x install.sh
./install.sh
```

## 📦 Manual Installation

If you prefer to install manually:

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Backend Setup

```bash
cd server
npm install      # Install all backend dependencies
npm run build    # Compile TypeScript
npm start        # Start backend server (port 3000)
```

### Frontend Setup

```bash
cd client
npm install      # Install all frontend dependencies
npm run dev      # Start development server (port 5173)
```

## 📋 What Gets Installed

### Backend Dependencies (21 packages)

**Production:**

- express 5.2.1 - Web framework
- cors 2.8.5 - CORS handling
- tesseract.js 7.0.0 - OCR engine
- chrono-node 2.9.0 - Date/time parsing
- date-fns-tz 3.2.0 - Timezone handling
- multer 2.0.2 - File uploads
- express-rate-limit 7.1.5 - Rate limiting
- express-validator 7.0.1 - Input validation

**Development:**

- typescript 5.9.3
- jest 29.7.0
- ts-jest 29.1.1
- nodemon 3.1.11
- And type definitions...

### Frontend Dependencies (13 packages)

**Production:**

- react 18.3.1
- react-dom 18.3.1
- tailwindcss 3.4.17
- framer-motion 11.15.0
- lucide-react 0.468.0
- axios 1.7.9
- clsx 2.1.1

**Development:**

- vite 6.0.7
- typescript 5.6.2
- @vitejs/plugin-react 4.3.4
- And type definitions...

## 🧪 Running Tests

```bash
cd server
npm test              # Run all 61 tests
npm run test:coverage # Generate coverage report
```

## 🚀 After Installation

**Backend runs on:** http://localhost:3000  
**Frontend runs on:** http://localhost:5173

**API Endpoint:**

```
POST http://localhost:3000/api/v1/parse
```

## ❓ Troubleshooting

**"npm: command not found"**

- Install Node.js from https://nodejs.org/

**"Module not found" errors**

- Run `npm install` again
- Delete `node_modules` and run `npm install`

**Port already in use**

- Stop other servers on ports 3000 or 5173
- Or change ports in the config

**TypeScript errors**

- Run `npm run build` in server directory

## 📚 More Info

See `REQUIREMENTS.md` for detailed dependency information.

---

**Total Installation Time:** ~3-5 minutes (depending on internet speed)

**Disk Space Required:** ~500MB (including node_modules)
