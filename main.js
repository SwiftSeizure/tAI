import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config(); // Load environment variables

console.log("API Key:", process.env.OPENAI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});

const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
        { role: "system", content: "You are a teaching assistant." },
        { role: "user", content: "how do i perform basic addition" },
    ],
});

console.log(completion.choices[0].message.content);