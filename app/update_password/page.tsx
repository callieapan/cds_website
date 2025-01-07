'use client'
import { useState } from 'react';
//import { useRouter } from 'next/navigation';
import { useRouter as useNextRouter } from 'next/navigation';
import { updatePassword} from '@/app/lib/actions'

import {
    EyeIcon,
    EyeSlashIcon,
  } from '@heroicons/react/24/outline';
export default function Page () {
    
    const [email, setEmail] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    //const router = useRouter();
    const router = useNextRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError ('New pasword do not match.');
            return;
        }

        try {
            // need to change the function
            const result = await updatePassword(email, currentPassword, newPassword);
            if (result.success) {
                setSuccess('Password updated successfully!');
                setError('');
                setTimeout( () => {
                    router.push('/interviews_table'); //Redirect to view intervews, not homepage after success
                }, 2000);    
                
                } else {
                    setError(result.message || 'Failed to update password.');
                }
            } catch (err) {
                setError('An error occured. Please try again.')
                console.log(err.message || 'updatePassword result threw an error')
            } 
        };  

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Update Password</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="relative">
                    <input
                    //type="password"
                    type = {showCurrentPassword ? 'text' : 'password'} // Toggle input type
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    />
                    {/* Add eye icon to toggle password visibility */}
                    <button
                        type="button" // Prevent form submission
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 focus:outline-none"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)} // Toggle state
                    >
                        {showCurrentPassword ? (
                        <EyeIcon className="h-5 w-5" />
                        ) : (
                        <EyeSlashIcon className="h-5 w-5" />
                        )}
                    </button>
                </div>   
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                    <input
                    type = {showNewPassword ? 'text' : 'password'} // Toggle input type
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={6}
                    />
                    {/* Add eye icon to toggle password visibility */}
                    <button
                        type="button" // Prevent form submission
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 focus:outline-none"
                        onClick={() => setShowNewPassword(!showNewPassword)} // Toggle state
                    >
                        {showNewPassword ? (
                        <EyeIcon className="h-5 w-5" />
                        ) : (
                        <EyeSlashIcon className="h-5 w-5" />
                        )}
                    </button>
                </div>
                
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                    <input
                    type = {showConfirmPassword ? 'text' : 'password'} // Toggle input type
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={6}
                    />
                {/* Add eye icon to toggle password visibility */}
                <button
                        type="button" // Prevent form submission
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 focus:outline-none"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle state
                    >
                        {showConfirmPassword ? (
                        <EyeIcon className="h-5 w-5" />
                        ) : (
                        <EyeSlashIcon className="h-5 w-5" />
                        )}
                    </button>    
                </div>
                
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      );
    }