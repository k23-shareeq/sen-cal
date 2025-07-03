/**
 * Calculate daily nutrition goals based on calorie target
 * Based on standard nutritional guidelines and recommendations
 * 
 * @param {number} dailyCalorieGoal - Target daily calories
 * @param {object} options - Optional customization parameters
 * @returns {object} Daily nutrition targets in grams
 */
function calculateDailyNutritionGoals(dailyCalorieGoal, options = {}) {
  // Default percentages based on dietary guidelines
  const defaults = {
    proteinPercent: 20,    // 15-25% of calories
    fatPercent: 30,        // 25-35% of calories  
    carbPercent: 50,       // 45-65% of calories
    fiberPerKcal: 14,      // 14g per 1000 calories (FDA recommendation)
    sugarLimitPercent: 10  // <10% of calories (WHO recommendation)
  };
  
  // Merge with custom options
  const config = { ...defaults, ...options };
  
  // Validate input
  if (!dailyCalorieGoal || dailyCalorieGoal <= 0) {
    throw new Error('Daily calorie goal must be a positive number');
  }
  
  // Calorie conversion factors
  const PROTEIN_CALORIES_PER_GRAM = 4;
  const FAT_CALORIES_PER_GRAM = 9;
  const CARB_CALORIES_PER_GRAM = 4;
  
  // Calculate macronutrients in grams
  const proteinCalories = (dailyCalorieGoal * config.proteinPercent) / 100;
  const fatCalories = (dailyCalorieGoal * config.fatPercent) / 100;
  const carbCalories = (dailyCalorieGoal * config.carbPercent) / 100;
  
  const proteinGrams = Math.round(proteinCalories / PROTEIN_CALORIES_PER_GRAM);
  const fatGrams = Math.round(fatCalories / FAT_CALORIES_PER_GRAM);
  const carbGrams = Math.round(carbCalories / CARB_CALORIES_PER_GRAM);
  
  // Calculate fiber (14g per 1000 calories)
  const fiberGrams = Math.round((dailyCalorieGoal / 1000) * config.fiberPerKcal);
  
  // Calculate sugar limit (max 10% of calories)
  const sugarLimitCalories = (dailyCalorieGoal * config.sugarLimitPercent) / 100;
  const sugarLimitGrams = Math.round(sugarLimitCalories / CARB_CALORIES_PER_GRAM);
  
  return {
    calories: dailyCalorieGoal,
    protein: proteinGrams,      // grams
    fat: fatGrams,              // grams  
    carbs: carbGrams,           // grams
    fiber: fiberGrams,          // grams
    sugar: sugarLimitGrams,     // grams (max recommended)
    
    // Additional breakdown for reference
    breakdown: {
      proteinPercent: config.proteinPercent,
      fatPercent: config.fatPercent,
      carbPercent: config.carbPercent,
      proteinCalories: Math.round(proteinCalories),
      fatCalories: Math.round(fatCalories),
      carbCalories: Math.round(carbCalories)
    }
  };
}