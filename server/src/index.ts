// src/index.ts
import express, { Request, Response } from 'express';
import axios from 'axios';
import { MOCK_TEST, Questions, FeedBack } from './query/query';
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin:'*',
  methods:["GET","POST"]
}))
app.use(express.json());

// Robust JSON extractor that only processes strings
const extractJSON = (text: unknown): any => {
  if (typeof text !== 'string') {
    console.error('extractJSON expects a string but got:', typeof text);
    return null;
  }
  try {
    // This regex extracts the first {...} JSON object found in the string
    const jsonMatch = text.match(/{[\s\S]*}/);
    if (!jsonMatch) throw new Error("No JSON found");
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("JSON extraction failed:", err);
    return null;
  }
};

app.post('/', async (req: Request, res: Response) => {
  const { level, type, count, examName, description } = req.body;

  if (!level || !type || !count || !examName || !description) {
    return res.status(400).json({ message: "All parameters are required." });
  }

  try {
    const prompt = MOCK_TEST({ level, type, count, examName, description });
    const encodedPrompt = encodeURIComponent(prompt);

    const pollinationResponse = await axios.get(`https://text.pollinations.ai/prompt/${encodedPrompt}`);

    console.log('Pollinations response type:', typeof pollinationResponse.data);
    console.log('Pollinations response data:', pollinationResponse.data);

    let cleaned;

    if (typeof pollinationResponse.data === 'string') {
      cleaned = extractJSON(pollinationResponse.data);
    } else if (typeof pollinationResponse.data === 'object') {
      cleaned = pollinationResponse.data; // Already JSON
    } else {
      cleaned = null;
    }

    if (!cleaned) {
      return res.status(502).json({ message: "Invalid response format from Pollinations AI" });
    }

    return res.json(cleaned);

  } catch (error: any) {
    console.error('Pollinations fetch error:', error.message);
    return res.status(500).json({ message: 'Internal server error while processing the mock test.' });
  }
});

app.post("/feedback",async (req:Request,res: Response)=>{
  const {right,wrong}:{right:Questions[]; wrong:Questions[]} = req.body;

  const prompt = FeedBack({right,wrong})
  const encodedPrompt = encodeURIComponent(prompt)
  const pollinationResponse = await axios.get(`https://text.pollinations.ai/prompt/${encodedPrompt}`)
  return res.json({
    result:pollinationResponse.data
  })
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
