import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const App: React.FC = () => {
  const handleGoogleLogin = async (response: any) => {
    console.log(response);
}

  return (
    <GoogleOAuthProvider clientId={String(import.meta.env.VITE_GOOGLE_CLIENT_ID)}>
      <div>
        <h2>Login with Google</h2>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => console.log('Google authentication failed. Please try again or use email login.')}
          useOneTap
          size="large"
          width="100%"
          text="signin_with"
          shape="rectangular"
          logo_alignment="center"
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
