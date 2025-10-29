import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// ✅ Import routes
import distributorRoutes from './routes/distributorRoutes.js'
import farmerRoutes from './routes/farmerRoutes.js'
import cattleRoutes from './routes/cattleRoutes.js' // 🆕 added

dotenv.config()

const app = express()

// ✅ Enable CORS so frontend can call backend API
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://beautiful-dolphin-b8e9a0.netlify.app', // ✅ Netlify frontend
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// ✅ Parse JSON request bodies
app.use(express.json())

// ✅ Mount routes
app.use('/api/distributors', distributorRoutes)
app.use('/api/farmers', farmerRoutes)
app.use('/api/cattle', cattleRoutes) // 🆕 added

// ✅ Health check route (optional)
app.get('/', (req, res) => {
  res.send('✅ API is running...')
})

// ✅ Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
