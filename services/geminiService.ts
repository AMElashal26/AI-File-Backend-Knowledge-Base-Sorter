import { GoogleGenAI, Type } from "@google/genai";
import { UploadedFile, CategorizationResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const fileToGenerativePart = (file: UploadedFile) => {
  if (file.type.startsWith('text/')) {
    return { text: `File Content:\n\`\`\`\n${file.content}\n\`\`\`` };
  }
  if (file.type.startsWith('image/')) {
    return {
      inlineData: {
        mimeType: file.type,
        data: file.content,
      },
    };
  }
  throw new Error('Unsupported file type');
};

export const categorizeFile = async (
  file: UploadedFile,
  projects: string[],
  tags: string[]
): Promise<CategorizationResult> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const filePart = fileToGenerativePart(file);

    const systemInstruction = `You are an intelligent knowledge base assistant. Your task is to analyze the provided file and suggest a categorization.

Analyze the file's content, name, and type. If the file is an image (like a screenshot or document), analyze any text within it.

File Name: ${file.name}

You MUST suggest exactly one project from the provided project list that best fits the file.
You MUST suggest one or more relevant tags from the provided tag list. If no tags seem relevant, return an empty array for tags.

Strictly adhere to the provided JSON schema for your response. Only use the projects and tags from the lists below.

Available Projects:
${projects.join(', ')}

Available Tags:
${tags.join(', ')}
`;

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [filePart] },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            project: {
              type: Type.STRING,
              description: `The single most relevant project for the file, chosen exclusively from this list: [${projects.join(', ')}]`,
            },
            tags: {
              type: Type.ARRAY,
              description: `An array of relevant tags for the file, chosen exclusively from this list: [${tags.join(', ')}]`,
              items: {
                type: Type.STRING,
              },
            },
          },
          required: ["project", "tags"],
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as CategorizationResult;
    
    // Filter result to ensure it only contains valid projects and tags
    const validProject = projects.includes(result.project) ? result.project : 'Uncategorized';
    const validTags = result.tags.filter(tag => tags.includes(tag));

    return { project: validProject, tags: validTags };

  } catch (error) {
    console.error("Error categorizing file with Gemini API:", error);
    throw new Error("Failed to get categorization from the AI model. Please check your API key and network connection.");
  }
};