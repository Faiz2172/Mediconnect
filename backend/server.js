import express from "express";
import cors from "cors";
import "dotenv/config.js"
import { Resend } from 'resend';
import { ENV } from "./src/config/env.js";
import { db } from "./src/config/database.js";
import blogRoutes from "./src/routes/blogs.js";
import job from "./src/config/cron.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Start cron job in production
if (ENV.NODE_ENV === "production") job.start();

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "MediConnect API is running",
    timestamp: new Date().toISOString()
  });
});

// Emergency Alert Endpoint
app.post('/api/send-emergency-alert', async (req, res) => {
  try {
    const { services, location, address } = req.body;
    
    const emergencyServices = {
      police: {
        email: "shaalu5050@gmail.com",
        icon: "🚓",
        label: "Police"
      },
      ambulance: {
        email: "chakrabortysouma20@gmail.com",
        icon: "🚑",
        label: "Ambulance"
      },
      firebrigade: {
        email: "faizshaikh29086@gmail.com",
        icon: "🚒",
        label: "Fire Brigade"
      }
    };
    
    const mapsLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    
    // Create and send emails
    const emailPromises = services.map(service => {
      const serviceInfo = emergencyServices[service];
      
      return resend.emails.send({
        from: 'Emergency Alert System <alerts@yourdomain.com>', // Replace with your verified domain
        to: [serviceInfo.email],
        subject: `EMERGENCY ALERT: ${serviceInfo.label} needed`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h1 style="color: #d32f2f; text-align: center;">URGENT HELP NEEDED!</h1>
            <div style="text-align: center; font-size: 24px; margin: 20px 0;">
              🚨 ${serviceInfo.icon} ${serviceInfo.label} Emergency Alert 🚨
            </div>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #333;">Location Details:</h3>
              <p style="margin-bottom: 5px;"><strong>Latitude:</strong> ${location.latitude}</p>
              <p style="margin-bottom: 5px;"><strong>Longitude:</strong> ${location.longitude}</p>
              ${address ? `<p style="margin-bottom: 5px;"><strong>Address:</strong> ${address}</p>` : ''}
            </div>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${mapsLink}" style="display: inline-block; padding: 12px 24px; background-color: #d32f2f; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">View on Google Maps</a>
            </div>
            
            <p style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
              Sent from MediConnect Emergency Response System
            </p>
          </div>
        `
      });
    });
    
    await Promise.all(emailPromises);
    
    res.status(200).json({ success: true, message: "Emergency alerts sent successfully" });
  } catch (error) {
    console.error("Error sending emergency alert:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// API Routes
app.use('/api/blogs', blogRoutes);

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  res.status(500).json({ 
    success: false,
    error: "Something went wrong",
    message: ENV.NODE_ENV === "development" ? error.message : "Internal server error"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: "Route not found" 
  });
});

app.listen(PORT, () => {
  console.log("MediConnect Server is running on PORT:", PORT);
  console.log(`Environment: ${ENV.NODE_ENV || 'development'}`);
  console.log(`Database connected: ${ENV.DATABASE_URL ? 'Yes' : 'No'}`);
});