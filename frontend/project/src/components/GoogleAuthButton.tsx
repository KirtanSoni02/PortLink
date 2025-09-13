// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Chrome } from 'lucide-react';

// interface GoogleAuthButtonProps {
//   mode: 'login' | 'register';
//   onSuccess: (userData: any) => void;
//   disabled?: boolean;
// }

// const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ mode, onSuccess, disabled }) => {
//   const [isLoading, setIsLoading] = useState(false);

//   const handleGoogleAuth = async () => {
//     setIsLoading(true);
    
//     try {
//       // Simulate Google OAuth flow
//       // In a real implementation, you would use Google's OAuth library
//       setTimeout(() => {
//         const mockGoogleUser = {
//           id: `google_${Date.now()}`,
//           email: 'user@gmail.com',
//           name: 'Google User',
//           picture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
//           provider: 'google',
//           role: mode === 'register' ? 'sailor' : undefined, // Default role for new users
//           profileComplete: mode === 'register' ? false : true
//         };

//         onSuccess(mockGoogleUser);
//         setIsLoading(false);
//       }, 2000);
//     } catch (error) {
//       console.error('Google authentication failed:', error);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <motion.button
//       whileHover={{ scale: 1.02 }}
//       whileTap={{ scale: 0.98 }}
//       type="button"
//       onClick={handleGoogleAuth}
//       disabled={disabled || isLoading}
//       className="w-full flex justify-center items-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-slate-700 font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
//     >
//       {isLoading ? (
//         <div className="flex items-center">
//           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-600 mr-2"></div>
//           Connecting with Google...
//         </div>
//       ) : (
//         <div className="flex items-center">
//           <img src="../../images/google.png" alt="Google Logo" className="w-5 h-5 mr-2" />
//           {mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}
//         </div>
//       )}
//     </motion.button>
//   );
// };

// export default GoogleAuthButton;



















// src/components/GoogleAuthButton.tsx
import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

interface GoogleAuthButtonProps {
  mode: 'register' | 'login';
  onSuccess: (userData: any) => void;
  onError?: (error: any) => void;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ 
  mode, 
  onSuccess, 
  onError 
}) => {
  const handleGoogleSuccess = async (tokenResponse: any) => {
  try {
    console.log('Google Token Response:', tokenResponse);
    
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/google`, 
      {
        token: tokenResponse.access_token,
        mode: mode,
      }
    );

    console.log('Backend Response:', response);
    console.log('Response Data:', response.data);
    
    // Check if the response has the expected structure
    if (response.data && response.data.success) {
      onSuccess(response.data);
    } else {
      throw new Error('Invalid response format from server');
    }
    
  } catch (error: any) {
    console.error('Google authentication failed:', error);
    console.error('Error response:', error.response?.data);
    
    if (onError) {
      onError(error);
    } else {
      alert('Google authentication failed. Please check console for details.');
    }
  }
};

  const handleGoogleFailure = (error: any) => {
    console.error('Google login failed:', error);
    if (onError) {
      onError(error);
    } else {
      alert('Google login failed. Please try again.');
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleFailure,
    scope: 'profile email',
  });

  return (
    <button
      onClick={() => login()}
      className="w-full flex justify-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-slate-700 font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-300"
    >
      <div className="flex items-center">
        {/* <Chrome className="h-5 w-5 mr-2 text-slate-500" /> */}
        <img src="../images/google.png" alt="Google Logo" className="w-5 h-5 mr-2" />
        Continue with Google
      </div>
    </button>
  );
};

export default GoogleAuthButton;