import { GoogleGenAI, Modality } from "@google/genai";
import { UserProfile, PlanType, PlanItem } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const calculateCaloriesAndAnalysis = async (profile: UserProfile): Promise<{ calories: number; analysis: string }> => {
  const ai = getAiClient();
  
  // Fallback calculation if API key is missing
  if (!ai) {
    let bmr = 0;
    if (profile.gender === 'male') {
      bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
    } else {
      bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
    }

    let multiplier = 1.2;
    // Simple mapping for fallback
    if (profile.activityLevel.includes('Enyhén')) multiplier = 1.375;
    if (profile.activityLevel.includes('Mérsékelten')) multiplier = 1.55;
    if (profile.activityLevel.includes('Nagyon')) multiplier = 1.725;
    if (profile.activityLevel.includes('Extrém')) multiplier = 1.9;

    let tdee = Math.round(bmr * multiplier);
    
    if (profile.goal === 'lose_weight') tdee -= 500;
    if (profile.goal === 'muscle_gain') tdee += 300;

    return {
      calories: tdee,
      analysis: "Az API kulcs hiányában egy standard Harris-Benedict formulát használtunk a számításhoz. Ez egy becsült érték."
    };
  }

  try {
    const prompt = `
      Feladat: Számold ki a napi kalóriaszükségletet és adj rövid elemzést magyar nyelven.
      
      Felhasználó adatai:
      - Kor: ${profile.age}
      - Súly: ${profile.weight} kg
      - Magasság: ${profile.height} cm
      - Nem: ${profile.gender === 'male' ? 'Férfi' : 'Nő'}
      - Aktivitás: ${profile.activityLevel}
      - Cél: ${profile.goal === 'lose_weight' ? 'Fogyás' : profile.goal === 'muscle_gain' ? 'Izomépítés' : 'Szintentartás'}
      - Edzésnapok száma: ${profile.daysAvailable} nap/hét

      Válasz formátum (JSON):
      {
        "calories": (szám, a napi ajánlott kalória),
        "analysis": (string, 2-3 mondat motiváló elemzés magyarul)
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text);
    return {
      calories: Number(result.calories),
      analysis: result.analysis
    };

  } catch (error) {
    console.error("Gemini calculation failed", error);
    return {
      calories: 2000, // Safe fallback
      analysis: "Sajnos nem sikerült kapcsolódni az AI szerverhez, kérlek próbáld újra később."
    };
  }
};

export const generatePlanTemplate = async (type: PlanType, name: string): Promise<PlanItem[]> => {
    const ai = getAiClient();
    if (!ai) return [];

    const prompt = `
    Készíts egy ${type === PlanType.DIET ? 'étrendet' : 'edzéstervet'} táblázatos formában.
    A terv neve: "${name}".
    
    Válasz formátum (JSON Array):
    [
      {
        "day": "pl. Hétfő vagy 1. Étkezés",
        "content": "pl. Csirkemell rizzsel vagy Fekvenyomás",
        "details": "pl. 150g csirke, 50g rizs vagy Lassan engedd le",
        "sets": "3-4" (csak edzésnél, string formátum),
        "reps": "8-12" (csak edzésnél, string formátum)
      }
    ]
    Generálj legalább 4-5 sort.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || "[]");
    } catch (e) {
        console.error(e);
        return [];
    }
}

export const analyzeDietPlan = async (items: PlanItem[]): Promise<{ totalCalories: number, macros: string }> => {
    const ai = getAiClient();
    if (!ai) return { totalCalories: 0, macros: "N/A" };

    const prompt = `
    Elemezd az alábbi étrendet és becsüld meg a teljes napi kalóriát és makrókat.
    Ételek:
    ${JSON.stringify(items)}

    Válasz formátum (JSON):
    {
      "totalCalories": number (becsült összkalória),
      "macros": string (rövid szöveg, pl: "Fehérje: 180g, Szénhidrát: 200g, Zsír: 60g")
    }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const res = JSON.parse(response.text || "{}");
        return {
            totalCalories: Number(res.totalCalories) || 0,
            macros: res.macros || "Nem sikerült elemezni"
        };
    } catch (e) {
        console.error(e);
        return { totalCalories: 0, macros: "Hiba történt" };
    }
}

export const generateLandingImage = async (): Promise<string | null> => {
    const ai = getAiClient();
    if (!ai) return null;

    // Use the designated image generation model
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { text: 'Dark aesthetic modern gym interior with neon pink and cyan lighting strips, atmospheric smoke, cinematic 8k resolution, wide angle, highly detailed, futuristic fitness environment, no people, dark shadows' }
                ]
            },
            config: {
                responseModalities: [Modality.IMAGE]
            }
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.[0];
        if (imagePart && imagePart.inlineData) {
            return `data:image/png;base64,${imagePart.inlineData.data}`;
        }
        return null;
    } catch (error) {
        console.error("Image gen failed", error);
        return null;
    }
}