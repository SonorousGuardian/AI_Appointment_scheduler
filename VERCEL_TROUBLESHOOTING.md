# Vercel Deployment Troubleshooting

## Error Received

```
404: NOT_FOUND
Code: NOT_FOUND
ID: bom1::f86hw-1768505201052-efba9b725982
```

## Common Causes & Solutions

### 1. Frontend Deployment (Most Likely)

If you deployed the **client** (frontend):

**Problem**: Wrong build directory or missing files

**Solution**:

```bash
cd client

# Ensure vercel.json exists
cat vercel.json

# Try deploying with explicit config
vercel --prod
```

**Correct Settings:**

- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 2. Backend Deployment

If you deployed the **server** (backend):

**Problem**: Serverless functions not set up correctly

**Fix the server structure:**

Create `server/api/index.ts`:

```typescript
import app from "../src/app";

// Export the Express app as a serverless function
export default app;
```

Update `server/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.ts"
    }
  ]
}
```

### 3. Root Directory Issue

**If you deployed from root** (not client or server):

Vercel might not know which directory to build.

**Solution**: Deploy from specific directories:

```bash
# For frontend
cd client && vercel

# For backend
cd server && vercel
```

## Quick Fix Steps

### For Frontend:

```bash
cd client
rm -rf .vercel  # Clear Vercel config
vercel --prod
```

### For Backend:

```bash
cd server
npm run build   # Ensure build works
vercel --prod
```

## Check Deployment Logs

1. Go to: https://vercel.com/dashboard
2. Find your deployment
3. Click on it
4. Check "Build Logs" and "Function Logs"
5. Look for errors

## What to Check

- [ ] Are you in the right directory? (client or server)
- [ ] Did build succeed? (check build logs)
- [ ] Is `dist/` folder created?
- [ ] Are routes configured correctly?
- [ ] Did you install dependencies?

## Next Steps

Tell me:

1. Which folder did you deploy from? (root, client, or server)
2. What command did you use?
3. Can you share the build logs from Vercel dashboard?

This will help me give you the exact fix!
