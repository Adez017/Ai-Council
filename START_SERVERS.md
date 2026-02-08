# Start AI Council Application

## Quick Start - Two Terminal Windows

### Terminal 1: Start Backend Server

```powershell
cd backend
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Backend will be available at:**
- API: http://localhost:8000/api/v1
- API Docs: http://localhost:8000/api/v1/docs
- WebSocket: ws://localhost:8000/ws

---

### Terminal 2: Start Frontend Server

```powershell
cd frontend
npm run dev
```

**Expected Output:**
```
> frontend@0.1.0 dev
> next dev

   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
   - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

**Frontend will be available at:**
- Application: http://localhost:3000

---

## Testing the Application

### 1. Landing Page
Open your browser to: **http://localhost:3000**

You should see:
- Hero section with "AI Council" branding
- Features section explaining multi-agent orchestration
- Demo query interface
- "Get Started" and "Try Demo" buttons

### 2. Register a New Account
1. Click "Get Started" button
2. Fill in the registration form:
   - Email: test@example.com
   - Password: TestPassword123
   - Name: Test User
3. Click "Register"
4. You'll be redirected to the API Key Wizard

### 3. API Key Wizard (Optional - Can Skip)
1. Welcome screen explains why API keys are needed
2. Select providers (OpenAI, Groq, Together, etc.)
3. Enter API keys or click "Skip for Now"
4. Complete wizard

### 4. Chat Interface
1. You'll land on the chat page at http://localhost:3000/chat
2. Type a query: "Explain the benefits of renewable energy"
3. Select execution mode: FAST, BALANCED, or BEST_QUALITY
4. Click Submit
5. Watch real-time orchestration progress
6. View the final response

### 5. Other Pages to Test

**Dashboard**: http://localhost:3000/dashboard
- View your usage statistics
- See request history
- Check cost breakdown

**History**: http://localhost:3000/history
- Browse past requests
- Search and filter
- View detailed responses

**Settings**: http://localhost:3000/settings
- Update profile
- Manage API keys
- Change theme

**Admin** (if first user): http://localhost:3000/admin
- View all users
- Monitor system health
- Check provider status

---

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```powershell
# Find and kill the process using port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Database connection error:**
- Check if DATABASE_URL in backend/.env is correct
- Verify Supabase project is running
- Try using the Pooler connection string

**Module not found errors:**
```powershell
cd backend
poetry install --no-root
```

### Frontend Issues

**Port 3000 already in use:**
```powershell
# Use a different port
npm run dev -- -p 3001
```

**API connection error:**
- Make sure backend is running first
- Check NEXT_PUBLIC_API_URL in frontend/.env.local
- Verify CORS_ORIGINS in backend/.env includes frontend URL

**Module not found errors:**
```powershell
cd frontend
npm install
```

### Redis Issues (Optional)

Redis is optional for basic functionality. If you see Redis connection errors:

**Option 1: Install Redis with Docker**
```powershell
docker run -d -p 6379:6379 redis:alpine
```

**Option 2: Use Upstash (Cloud)**
1. Go to https://upstash.com
2. Create a free Redis database
3. Update REDIS_URL in backend/.env

**Option 3: Disable Redis features**
Comment out Redis-dependent code in backend/app/core/redis.py

---

## Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Landing page loads at http://localhost:3000
- [ ] Can register a new account
- [ ] Can log in with credentials
- [ ] API Key Wizard appears (can skip)
- [ ] Chat interface loads
- [ ] Can submit a query
- [ ] Real-time progress updates work
- [ ] Response displays correctly
- [ ] Can view history
- [ ] Can access dashboard
- [ ] Can update settings

---

## API Documentation

Once the backend is running, visit:
**http://localhost:8000/api/v1/docs**

This provides interactive API documentation where you can:
- View all available endpoints
- Test API calls directly
- See request/response schemas
- Try authentication flows

---

## Stopping the Servers

Press **CTRL+C** in each terminal window to stop the servers gracefully.

---

## Next Steps

1. **Add Real API Keys**: Update backend/.env with your actual API keys from:
   - Groq: https://console.groq.com
   - Together AI: https://api.together.xyz
   - OpenRouter: https://openrouter.ai
   - Hugging Face: https://huggingface.co/settings/tokens

2. **Test Full Flow**: Try submitting queries with different execution modes

3. **Explore Features**: Test all pages and functionality

4. **Check Monitoring**: View admin dashboard for system health

5. **Review Logs**: Check terminal output for any errors or warnings

---

## Development Tips

### Hot Reload
Both servers support hot reload:
- **Backend**: Changes to Python files automatically reload the server
- **Frontend**: Changes to React components automatically refresh the browser

### Debugging
- **Backend logs**: Check the terminal running uvicorn
- **Frontend logs**: Check browser console (F12)
- **Network requests**: Use browser DevTools Network tab
- **WebSocket**: Use browser DevTools to inspect WebSocket connections

### Database
- **View data**: Use Supabase dashboard or a PostgreSQL client
- **Run migrations**: `cd backend && poetry run alembic upgrade head`
- **Create migration**: `cd backend && poetry run alembic revision --autogenerate -m "description"`

---

**Happy Testing! 🚀**
