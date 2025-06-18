import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProfileAndReviews = async () => {
      setLoading(true);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        setProfile(null);
        setReviews([]);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('score, review_text, created_at')
        .eq('target_id', id)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
        setReviews([]);
      } else {
        setReviews(reviewsData);
      }

      setLoading(false);
    };

    fetchProfileAndReviews();
  }, [id]);

  if (loading) return <div className="text-white text-center mt-20">Loading profile...</div>;
  if (!profile) return <div className="text-white text-center mt-20">Profile not found</div>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <img src={profile.twitter_profile_image} alt="profile" className="w-24 h-24 rounded-full mb-4" />
      <h1 className="text-3xl font-bold">{profile.twitter_display_name}</h1>
      <p className="text-gray-400 mb-4">@{profile.twitter_username}</p>
      <p className="text-2xl font-semibold text-green-400 mb-8">Reputation: {profile.reputation_score}</p>

      <div className="w-full max-w-lg bg-[#111] p-6 rounded-lg border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Received Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review, index) => (
              <li key={index} className="p-4 bg-[#222] rounded">
                <p className="text-lg">
                  {review.score === 1 && '👍 Positive'}
                  {review.score === 0 && '😐 Neutral'}
                  {review.score === -1 && '👎 Negative'}
                </p>
                {review.review_text && (
                  <p className="mt-2 text-gray-300">{review.review_text_
