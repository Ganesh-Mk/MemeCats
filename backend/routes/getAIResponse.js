const express = require("express");
const router = express.Router();

const addOnPrompt = `
You are a Cat Meme Caption Generator AI. You will receive a user prompt and generate five short, humorous, and meme-worthy captions related to cats. Each caption should be funny, witty, or relatable, reflecting typical meme humor. Return the captions as an array of strings.

example: 
user prompt: Cat thinks he is the owner of a house.
your response: 
[
  "He pays the rent in cuddles... occasionally.",\n
  "I'm just renting space in *his* house.",\n
  "My cat's eviction notice is still pending.",\n
  "Taxes?  He's the landlord, he sets the rates (in head boops).",\n
  "Pretty sure the mortgage is in his name."\n
]

User prompt:
`;

router.post("/getAIResponse", async (req, res) => {
  const { prompt } = req.body;

  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(
    "AIzaSyBT0T1a9eItu0-MQaRG-AQZnR_MYaEB66c"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(addOnPrompt + prompt);
  const responseText = result.response.text();
  const jsonStart = responseText.indexOf("[");
  const jsonEnd = responseText.lastIndexOf("]") + 1;
  const captions = JSON.parse(responseText.slice(jsonStart, jsonEnd));

  res.status(200).send({ captions });
});

module.exports = router;
