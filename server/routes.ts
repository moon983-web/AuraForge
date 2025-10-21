import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      message: "3D Avatar Creator API is running"
    });
  });

  // Avatar-related endpoints
  app.get("/api/avatars", async (req, res) => {
    try {
      // This would typically fetch from a database
      // For now, return empty array as avatars are stored locally
      res.json([]);
    } catch (error) {
      console.error("Failed to fetch avatars:", error);
      res.status(500).json({ error: "Failed to fetch avatars" });
    }
  });

  // LM Studio proxy endpoint (for CORS if needed)
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Forward request to local LM Studio instance
      const lmStudioUrl = process.env.LM_STUDIO_URL || "http://localhost:1234/v1";
      
      const response = await fetch(`${lmStudioUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "local-model",
          messages: [
            { role: "system", content: context || "You are a helpful AI assistant." },
            { role: "user", content: message }
          ],
          max_tokens: 500,
          temperature: 0.7,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`LM Studio responded with ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        res.json({ response: data.choices[0].message.content.trim() });
      } else {
        res.status(500).json({ error: "No response from AI" });
      }
    } catch (error) {
      console.error("Chat endpoint error:", error);
      if (error instanceof Error && error.message.includes('fetch')) {
        res.status(503).json({ error: "LM Studio is not available. Make sure it's running on localhost:1234" });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Configuration endpoints
  app.get("/api/config", (req, res) => {
    res.json({
      features: {
        speechRecognition: true,
        textToSpeech: true,
        lmStudioIntegration: true
      },
      limits: {
        maxAvatars: 50,
        maxMessageLength: 1000,
        maxChatHistory: 100
      },
      version: "1.0.0"
    });
  });

  // Avatar export/import endpoints (for backup/restore)
  app.post("/api/avatars/export", (req, res) => {
    try {
      const { avatars } = req.body;
      
      if (!Array.isArray(avatars)) {
        return res.status(400).json({ error: "Invalid avatars data" });
      }

      // Validate avatar structure
      const validAvatars = avatars.filter(avatar => 
        avatar && 
        typeof avatar === 'object' && 
        avatar.id && 
        avatar.name && 
        avatar.appearance && 
        avatar.personality && 
        avatar.voice
      );

      res.json({ 
        success: true,
        exportedCount: validAvatars.length,
        data: validAvatars
      });
    } catch (error) {
      console.error("Export endpoint error:", error);
      res.status(500).json({ error: "Failed to export avatars" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
