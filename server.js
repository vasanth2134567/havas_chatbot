import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";

import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

const foods = JSON.parse(
  fs.readFileSync("foods.json")
);

app.post("/chat", async (req, res) => {

  const userMessage = req.body.message;

  const prompt = `
  You are Havas Foods & Beverages AI Assistant.

  Food Database:
  ${JSON.stringify(foods)}

  User Question:
  ${userMessage}

  Give short attractive responses.
  `;

  try {

    const result = await model.generateContent(prompt);

    const response =
      result.response.text();

    res.json({
      reply: response
    });

  } catch (error) {

    res.json({
      reply: "Server Error"
    });

  }

});

app.listen(3000, () => {
  console.log("Server Running at http://localhost:3000");
});
