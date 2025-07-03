const { hfClient, hfProvider, hfModel, hfRole } = require("./config");

const parseResponse = async (llmResponse) => {
  const cleanedContent = llmResponse.trim();
  // Find the first '{' and the last '}'
  const firstBrace = cleanedContent.indexOf("{");
  const lastBrace = cleanedContent.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    throw new Error("No valid JSON object found in LLM response");
  }
  const jsonString = cleanedContent.substring(firstBrace, lastBrace + 1);
  return JSON.parse(jsonString);
};

const generateResponse = async (meal) => {
  const prompt = `
<s>[INST] You are a nutrition expert and food analyzer. Your task is to:
1. Validate if the input is a real food item (not plastic, metal, or non-food items)
2. Analyze the meal name for spelling errors and correct them
3. Evaluate if the unit is appropriate for the meal type
4. Only correct quantity/unit if they are completely inappropriate for the food type
5. Calculate nutritional information if valid food is provided

Meal: ${meal.meal_name}
Quantity: ${meal.meal_quantity}
Unit: ${meal.meal_serving_size}

Instructions:
- First check if the meal is a real food item that can be consumed
- If it's not food (plastic, metal, chemicals, etc.), set isValid to false
- If there are spelling mistakes in the meal name, correct them
- Preferred generic units: "bowl", "plate", "glass", "cup", "piece", "slice", "serving"
- Measuring units: "g" (grams), "ml" (milliliters) - use ONLY these two
- Only correct unit/quantity if completely wrong (e.g., "1 litre of biryani" → "1 plate of biryani")
- Do NOT correct reasonable quantities even if they seem large
- Calculate nutrition for the exact requested quantity
- Provide nutrition per 100g/100ml for database storage
- Return confidence score based on how common/well-known the food is

Unit Selection Rules:
- Solid foods: Use "g" for measuring unit
- Liquids/beverages: Use "ml" for measuring unit
- Generic units: Choose the most appropriate from bowl, plate, glass, cup, piece, slice, serving

Respond ONLY with this exact JSON structure:

{
  "client_response": {
    "isValid": true,
    "resultFound": true,
    "original_meal": "biryani",
    "corrected_meal": "chicken biryani",
    "original_quantity": 1,
    "original_unit": "kg",
    "corrected_quantity": 1,
    "corrected_unit": "plate",
    "correction_applied": true,
    "correction_reason": "Changed kg to plate as it's more appropriate for serving biryani",
    "nutrition": {
      "calories": 460,
      "protein": 14.25,
      "carbs": 39.1,
      "fat": 27.4,
      "fiber": 1.6,
      "sugar": 3.05
    },
    "confidence": 0.85
  },
  "database_entries": [
    {
      "meal_name": "chicken biryani", 
      "generic_unit": "plate",
      "measuring_unit": "g",
      "serving_size": 100,
      "calories": 184,
      "protein": 5.7,
      "carbs": 15.64,
      "fat": 10.96,
      "fiber": 0.64,
      "sugar": 1.22,
      "meal_category": "rice dish",
      "confidence": 0.85
    }
  ]
}

Boolean field guidelines:
- isValid: true if meal is a real food item, false if it's non-food (plastic, metal, chemicals, gibberish)
- resultFound: true if you can provide nutritional information, false if the food exists but you don't have nutritional data

Error handling examples:
- "1kg of plastic xyz" → isValid: false, resultFound: false
- "1kg of some_unknown_exotic_food" → isValid: true, resultFound: false
- "1kg of biryani" → isValid: true, resultFound: true

Guidelines:
- Only correct obviously wrong units (metric weights for serving sizes, etc.)
- Generic units: bowl, plate, glass, cup, piece, slice, serving
- Measuring units: g (for solids), ml (for liquids) - ONLY these two
- Always provide realistic nutritional values when resultFound is true
- Protein, carbs, fat, fiber, sugar all in grams
- Be very conservative with corrections - only fix clear errors
- If meal name is too vague, specify the most common type
- serving_size in database_entries should always be 100 (representing per 100g or per 100ml)
- Only provide the json response, no explanation, no extra text, no notes, the response will be directly parsed to json, so nothing except raw json

Replace all example values with actual data for the given meal. [/INST]
`;
  const chatCompletion = await hfClient.chatCompletion({
    provider: hfProvider,
    model: hfModel,
    messages: [
      {
        role: hfRole,
        content: prompt,
      },
    ],
  });
  const response = chatCompletion?.choices[0]?.message?.content;
  // console.log("Response Recieved: ", response)
  const parsedResponse = await parseResponse(response);
  console.log("Parsed Response: ", parsedResponse)
  return parsedResponse;
};

module.exports = {
  generateResponse,
};
