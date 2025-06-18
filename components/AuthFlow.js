import React, { useEffect, useState } from 'react';
import { privy } from '../lib/privy';
import { supabase } from '../lib/supabase';

export default function AuthFlow({ onAuthenticated }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const privyUser = await privy.login();
      setUser(privyUser);

      // Insert profile into Supabase (if new)
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: privyUser.id,  // Privy UID = Supabase UID
          wallet_address: privyUser.wallet.address,
          twitter_user_id: privyUser.twitter.userId,
          twitter_username: privyUser.twitter.username,
          twitter_display_name: privyUser.twitter.displayName,
          twitter_profile_image: privyUser.twitter.profileImageUrl,
          reputation_score: 0,
          iryspect_power: 0,
        });

      if (error) console.error('Supabase insert error:', error);

      if (onAuthenticated) onAuthenticated(privyUser);
    } catch (err) {
      console.error('Login error:', err);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await privy.logout();
    setUser(null);
  };

  useEffect(() => {
    // Check if already logged in
    const checkSession = async () => {
      const privyUser = await privy.getUser();
      if (privyUser) {
        setUser(privyUser);
        if (onAuthenticated) onAuthenticated(privyUser);
      }
    };
    checkSession();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      {!user ? (
        <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 text-white rounded">
          Connect Wallet & Twitter
        </button>
      ) : (
        <div className="flex flex-col items-center">
          <img src={user.twitter.profileImageUrl} alt="profile" className="rounded-full w-24 h-24 mb-4" />
          <p className="text-lg font-semibold mb-2">{user.twitter.displayName}</p>
          <p className="text-gray-500">@{user.twitter.username}</p>
          <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
