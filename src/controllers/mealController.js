const foodService = require("../services/foodService");
const mealService = require("../services/mealService");
const userService = require("../services/userService");
const calculateDailyNutritionGoals = require("../utils/calculateDailyNutririonGoals");
const { validateMeal } = require("../validators/mealValidator");

class MealController {
  async getMeals(req, res) {
    const user_id = req.user.id;
    const date = req.query.date;
    if (!date) {
      return res
        .status(400)
        .json({ error: "Date query parameter is required" });
    }
    const meals = await mealService.getMealsByUserAndDate(user_id, date);
    res.json({ meals });
  }

  async getMealsForToday(req, res) {
    const user_id = req.user.id;
    const meals = await mealService.getMealsForToday(user_id);
    res.json({ meals });
  }

  async createMeal(req, res) {
    const user_id = req.user.id;
    console.log("User is: ", user_id);
    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { error } = validateMeal(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Find User Goal
    const userGoal = await userService.findUserGoal(user_id);
    const caloriesGoal = calculateDailyNutritionGoals(userGoal);
    const mealsSummary = await mealService.getMealSummaryForUserToday(user_id);

    console.log("Calories Goal: ", caloriesGoal);
    console.log("Meals Summary: ", mealsSummary?.total_calories);

    if (mealsSummary?.total_calories >= caloriesGoal?.calories) {
      return res.status(400).json({
        error: true,
        message: "You have already reached your daily calorie goal!",
      });
    }

    if (
      mealsSummary?.total_protein >= caloriesGoal?.protein ||
      mealsSummary?.total_carbs >= caloriesGoal?.carbs ||
      mealsSummary?.total_fiber >= caloriesGoal?.goal_fiber ||
      mealsSummary?.total_sugar >= caloriesGoal?.sugar ||
      mealsSummary?.total_fat >= caloriesGoal?.fat
    ) {
      return res
        .status(400)
        .json({
          error: true,
          message:
            "You have already reached your daily goal for your micros!",
        });
    }

    // Find the food item
    const food = await foodService.searchFoods(req.body.meal_name);
    console.log("Found Food: ", food[0]);
    if (!food || !food?.length) {
      const requestedMeal = {
        meal_type: req.body.meal_type,
        meal_name: req.body.meal_name,
        meal_quantity: req.body.meal_quantity,
        meal_serving_size: req.body.meal_serving_size,
        notes: req.body.notes,
      };
      const genMeal = await mealService.generateMeal(requestedMeal);
      const data = genMeal?.client_response;
      if (!data || !data?.isValid) {
        return res
          .status(400)
          .json({ error: true, message: "Enter Valid Meal Options!" });
      }
      if (!data?.resultFound) {
        return res.status(400).json({
          error: true,
          message:
            "Could Not Determine the Macros! Try a different Meal (more generic)",
        });
      }
      // Create Food
      const foodsList = genMeal?.database_entries;
      console.log("food Lists:", foodsList);
      if (!foodsList || !foodsList?.length) {
        return res
          .status(400)
          .json({ error: true, message: "Could Not Determine the Macros!" });
      }
      console.log(data);
      // Create Meal
      const mealToStore = {
        meal_type: req.body.meal_type,
        name: data?.corrected_meal || req.body.meal_name,
        user_id: user_id,
        total_calories: data?.nutrition?.calories,
        total_protein: data?.nutrition?.protein,
        total_carbs: data?.nutrition?.carbs,
        total_fat: data?.nutrition?.fat,
        total_fiber: data?.nutrition?.fiber,
        total_sugar: data?.nutrition?.sugar,
        confidence_level: data?.confidence * 100,
      };
      const meal = await mealService.createMeal(mealToStore);

      for (let i = 0; i < foodsList?.length; i++) {
        const curr = foodsList[i];
        const foodItem = {
          name: curr?.meal_name,
          serving_unit: curr?.measuring_unit,
          serving_generic_unit: curr?.generic_unit,
          serving_size: curr?.serving_size,
          calories_per_serving: curr?.calories,
          protein_per_serving: curr?.protein,
          carbs_per_serving: curr?.carbs,
          fat_per_serving: curr?.fat,
          fiber_per_serving: curr?.fiber,
          sugar_per_serving: curr?.sugar,
          category: curr?.meal_category,
          confidence_level: curr?.confidence,
        };
        await foodService.createFood(foodItem);
      }

      res
        .status(201)
        .json({ message: "Meal created successfully", meal, hit: false });
    } else {
      // Conversion
      let scaleFactor = 1;
      if (
        (food[0].serving_unit == "g" && req.body.meal_serving_size == "kg") ||
        (food[0].serving_unit == "ml" && req.body.meal_serving_size == "l")
      ) {
        scaleFactor = (req.body.meal_quantity * 1000) / food[0].serving_size;
      } else if (food[0].serving_unit == req.body.meal_serving_size) {
        scaleFactor = req.body.meal_quantity / food[0].serving_size;
      }
      console.log("Scale Factor of: ", scaleFactor);
      // Create Meal
      const mealToStore = {
        meal_type: req.body.meal_type,
        name: req.body.meal_name,
        user_id,
        total_calories: food[0].calories_per_serving * scaleFactor,
        total_protein: food[0].protein_per_serving * scaleFactor,
        total_carbs: food[0].carbs_per_serving * scaleFactor,
        total_fat: food[0].fat_per_serving * scaleFactor,
        total_fiber: food[0].fiber_per_serving * scaleFactor,
        total_sugar: food[0].sugar_per_serving * scaleFactor,
        confidence_level: food[0]?.confidence_level || 0,
      };
      const meal = await mealService.createMeal(mealToStore);

      res
        .status(201)
        .json({ message: "Meal created successfully", meal, hit: true });
    }
  }

  async updateMeal(req, res) {
    const meal = await mealService.getMealById(req.params.id);
    if (!meal || meal.user_id !== req.user.id) {
      return res.status(404).json({ error: "Meal not found" });
    }
    const { error } = validateMeal(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const updated = await mealService.updateMeal(req.params.id, req.body);
    res.json({ message: "Meal updated successfully", meal: updated });
  }

  async deleteMeal(req, res) {
    const meal = await mealService.getMealById(req.params.id);
    if (!meal || meal.user_id !== req.user.id) {
      return res.status(404).json({ error: "Meal not found" });
    }
    await mealService.deleteMeal(req.params.id);
    res.json({ message: "Meal deleted successfully" });
  }

  async getMealById(req, res) {
    const meal = await mealService.getMealById(req.params.id);
    if (!meal || meal.user_id !== req.user.id) {
      return res.status(404).json({ error: "Meal not found" });
    }
    res.json({ meal });
  }

  async getMealsSummary(req, res) {
    const user_id = req.user.id;
    const meals = await mealService.getMealSummaryForUserToday(user_id);
    const userGoal = await userService.findUserGoal(user_id);
    const caloriesGoal = calculateDailyNutritionGoals(userGoal);

    res.json({
      curr_calories: meals?.total_calories,
      curr_protein: meals?.total_protein,
      curr_carbs: meals?.total_carbs,
      curr_fiber: meals?.total_fiber,
      curr_sugar: meals?.total_sugar,
      curr_fat: meals?.total_fat,
      goal_calories: caloriesGoal?.calories,
      goal_protein: caloriesGoal?.protein,
      goal_carbs: caloriesGoal?.carbs,
      goal_fiber: caloriesGoal?.goal_fiber,
      goal_sugar: caloriesGoal?.sugar,
    });
  }
}

module.exports = new MealController();
