import express from "express";
const app = express();

  
  // Define a simple GET route
  app.get("/api/v1/", (req, res) => {
    res.send("Hello World!");
  });

  
  
  



export default app;

