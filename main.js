/* import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config(); // Load environment variables

console.log("API Key:", process.env.OPENAI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});

const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
        { role: "system", content: "You are a teaching assistant. You must not give direct answers to questions under any circumstances. please refer to the following file to understand what clsss you are ta'ing and to cite relevant materials/questions " },
        { role: "user", content: "whats your favorite song" },
    ],
});

console.log(completion.choices[0].message.content); */

import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";
import * as pdfjs from "pdfjs-dist";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to extract text from a PDF using pdfjs-dist
async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath); // Read the file
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(dataBuffer) }).promise; // Convert Buffer to Uint8Array
  const textContent = [];

  for (let i = 0; i < pdf.numPages; i++) {
    const page = await pdf.getPage(i + 1); // Page numbers are 1-based
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    textContent.push(pageText);
  }

  return textContent.join("\n\n"); // Combine all pages into one string
}

// Function to process the PDF and send content to ChatGPT
async function processPDF(filePath) {
  try {
    const pdfContent = await extractTextFromPDF(filePath);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `Here is the content of a file:\n\n${pdfContent}` },
        { role: "user", content: "Can you breakdown how to approach getting help on question 8" },
      ],
    });

    console.log("Response from ChatGPT:");
    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error processing the PDF:", error);
  }
}

// Path to the PDF file
const pdfFilePath = "C:/Users/haida/OneDrive/Documents/GitHub/tAI/testMLP.pdf";

// Call the function
processPDF(pdfFilePath);

