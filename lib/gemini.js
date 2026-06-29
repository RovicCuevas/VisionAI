import * as FileSystem from "expo-file-system/legacy";

const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

export const PROMPTS = {
  academic: `
Act as a university professor.

Looking at this image, provide:

- Objects
- Educational context
- Activities
- One constructive recommendation

Respond ONLY with valid JSON:

{
  "objects": [],
  "context": "",
  "activities": "",
  "recommendations": ""
}
`,

  safety: `
Act as a workplace safety inspector.

Identify:

- Objects
- Safety hazards
- Activities
- One safety recommendation

Respond ONLY with valid JSON:

{
  "objects": [],
  "context": "",
  "activities": "",
  "recommendations": ""
}
`,

  inventory: `
Act as an asset management clerk.

Identify:

- Every visible physical asset
- Context
- Activities
- Inventory recommendation

Respond ONLY with valid JSON:

{
  "objects": [],
  "context": "",
  "activities": "",
  "recommendations": ""
}
`,
};

export async function imageToBase64(uri) {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return base64;
}

export async function analyzeImage(base64Image, prompt = ANALYSIS_PROMPT) {
  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
    }),
  });

  const json = await response.json();

  console.log("Gemini JSON:", JSON.stringify(json, null, 2));

  return json;
}

export { ANALYSIS_PROMPT, GEMINI_KEY };
