import { supabase } from '../lib/supabase';

// Simple initial scoring model (MVP V1)
export const calculateReputation = async (profileId) => {
  let score = 0;

  // 1️⃣ Sum of reviews
  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('score')
    .eq('target_id', profileId);

  if (reviewsError) {
    console.error('Reviews fetch error:', reviewsError);
    return score;
  }

  reviews.forEach(review => {
    score += review.score;
  });

  // 2️⃣ Sum of iryspects (weight boost)
  const { data: iryspects, error: iryspectsError } = await supabase
    .from('iryspects')
    .select('amount_locked')
    .eq('target_id', profileId)
    .eq('is_active', true);

  if (iryspectsError) {
    console.error('Iryspects fetch error:', iryspectsError);
    return score;
  }

  iryspects.forEach(iryspect => {
    score += parseFloat(iryspect.amount_locked) * 2; // simple weight multiplier
  });

  return score;
};

// Update profile reputation score directly
export const updateReputation = async (profileId) => {
  const newScore = await calculateReputation(profileId);

  const { error } = await supabase
    .from('profiles')
    .update({ reputation_score: newScore })
    .eq('id', profileId);

  if (error) {
    console.error('Failed to update reputation score:', error);
  }
};
