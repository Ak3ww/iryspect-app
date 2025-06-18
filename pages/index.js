import React, { useState } from 'react';
import AuthFlow from '../components/AuthFlow';

export default function Home() {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">IRYSPECT</h1>
      <AuthFlow onAuthenticated={setAuthenticatedUser} />

      {authenticatedUser && (
        <div className="mt-10">
          <p className="text-xl">Welcome to IRYSPECT, {authenticatedUser.twitter.displayName} 👑</p>
          {/* Later we'll put ReviewForm and IryspectForm here */}
        </div>
      )}
    </div>
  );
}
