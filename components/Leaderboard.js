import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Leaderboard() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('reputation_score', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching leaderboard:', error);
      } else {
        setProfiles(data);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 bg-[#111] p-6 rounded-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-4">IRYSPECT LEADERBOARD</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-4">
          {profiles.map((profile, index) => (
            <li key={profile.id} className="flex items-center space-x-4">
              <span className="text-lg font-bold">{index + 1}.</span>
              <img
                src={profile.twitter_profile_image}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{profile.twitter_display_name}</p>
                <p className="text-gray-400 text-sm">@{profile.twitter_username}</p>
              </div>
              <div className="ml-auto text-lg font-bold text-green-400">
                {profile.reputation_score} 🔥
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
