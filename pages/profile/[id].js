import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [id]);

  if (loading) return <div className="text-white text-center mt-20">Loading profile...</div>;
  if (!profile) return <div className="text-white text-center mt-20">Profile not found</div>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <img src={profile.twitter_profile_image} alt="profile" className="w-24 h-24 rounded-full mb-4" />
      <h1 className="text-3xl font-bold">{profile.twitter_display_name}</h1>
      <p className="text-gray-40
