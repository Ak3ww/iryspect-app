import React, { useState } from 'react';
import AuthFlow from '../components/AuthFlow';
import ReviewForm from '../components/ReviewForm';
import IryspectForm from '../components/IryspectForm';

export default function Home() {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">IRYSPECT</h1>
      <AuthFlow onAuthenticated={setAuthenticatedUser} />

      {authenticatedUser && (
        <div className="mt-10 space-y-10">
          <p className="text-xl mb-4">Welcome, {authenticatedUser.twitter.displayName} 👑</p>

          {/* For testing — review yourself */}
          <ReviewForm reviewerId={authenticatedUser.id} targetId={authenticatedUser.id} />

          {/* For testing — iryspect yourself */}
          <IryspectForm iryspectorId={authenticatedUser.id} targetId={authenticatedUser.id} />
        </div>
      )}
    </div>
  );
}
