
export enum ActivityLevel {
    SEDENTARY = 'Ülőmunka (kevés mozgás)',
    LIGHTLY_ACTIVE = 'Enyhén aktív (heti 1-3 edzés)',
    MODERATELY_ACTIVE = 'Mérsékelten aktív (heti 3-5 edzés)',
    VERY_ACTIVE = 'Nagyon aktív (heti 6-7 edzés)',
    EXTRA_ACTIVE = 'Extrém aktív (fizikai munka + edzés)'
  }
  
  export enum PlanType {
    DIET = 'DIET',
    WORKOUT = 'WORKOUT'
  }
  
  export interface WeightEntry {
      date: string;
      weight: number;
  }

  export interface CompetitionScores {
      leanness: number; // 1-10
      muscle: number;   // 1-10
      weightLoss: number; // 1-10
      total: number;
  }
  
  export interface UserProfile {
    age: number;
    weight: number; // current weight
    startWeight: number; // Weight at registration
    height: number; // cm
    gender: 'male' | 'female';
    activityLevel: ActivityLevel;
    goal: 'lose_weight' | 'muscle_gain' | 'maintenance';
    daysAvailable: number; // Days per week available for training
    calculatedCalories?: number;
    aiAnalysis?: string;
    isLocked?: boolean; // If true, basic stats cannot be edited
    weightHistory: WeightEntry[];
    photos: {
        before?: string; // Base64 data url
        after?: string;  // Base64 data url
    };
  }
  
  export interface PlanItem {
    day: string; // e.g., "Hétfő" or "1. Nap" or "Reggeli"
    content: string; // Workout: Exercise Name, Diet: Food Name
    details: string; // Workout: Notes, Diet: Portion/details
    // Workout specific
    sets?: string; // e.g. "3-4"
    reps?: string; // e.g. "8-12"
  }
  
  export interface Plan {
    id: string;
    name: string;
    type: PlanType;
    items: PlanItem[];
    description: string;
    calculatedStats?: {
        totalCalories: number;
        macros: string; // e.g. "P: 150g, C: 200g, F: 60g"
    };
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    profile?: UserProfile;
    assignedDietId?: string;
    assignedWorkoutId?: string;
    registeredAt: Date;
    competitionScores?: CompetitionScores;
    isWinner?: boolean;
  }
