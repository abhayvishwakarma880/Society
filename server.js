import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config()
import cors from 'cors'
import appRoute from './routes/route.js'
import connectDB from './config/db.js'

const app = express()

const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors({
  origin: "*",
  credentials: true
}))

app.use(cookieParser())
app.use('/api', appRoute)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(port, () => {
  connectDB()
  console.log(`server is running on http://localhost:${port}`)
})