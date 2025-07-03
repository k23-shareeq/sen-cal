// Workout: "running", "cycling", "swimming", "walking", "yoga", "strength_training", "stretching", "other"

const MET_VALUES = {
  running: { low: 7, moderate: 9.8, high: 11.5 },
  cycling: { low: 4, moderate: 8, high: 10 },
  swimming: { low: 6, moderate: 8, high: 10 },
  walking: { low: 2.8, moderate: 3.5, high: 4.5 },
  yoga: { low: 2.5, moderate: 3, high: 4 },
  strength_training: { low: 3.5, moderate: 5, high: 6 },
  stretching: { low: 2.3, moderate: 2.8, high: 3.5 },
  other: { low: 3, moderate: 4, high: 5 }
};

const intensityLevels = { 1: "low", 2: "moderate", 3: "high" };

/**
 * Calculate calories burned for a workout.
 * @param {Object} workout - The workout object.
 * @param {string} workout.workout_type - The type of workout.
 * @param {number} workout.duration_minutes - Duration in minutes.
 * @param {number} [workout.intensity] - Intensity level (1=low, 2=moderate, 3=high).
 * @param {number} [workout.weight] - User weight in kg (default 70kg).
 * @returns {{ workoutName: string, caloriesBurned: number }}
 */

const calculateCaloriesBurned = (workout) => {
  const { workout_type, duration_minutes, intensity = 2, weight = 70 } = workout;
  const intensityLabel = intensityLevels[intensity] || "moderate";
  const met = MET_VALUES[workout_type]?.[intensityLabel] || 4;
  // Formula: Calories = MET * weight(kg) * duration(hr)
  const durationHours = duration_minutes / 60;
  const caloriesBurned = +(met * weight * durationHours).toFixed(2);
  return caloriesBurned;
};

module.exports = calculateCaloriesBurned;