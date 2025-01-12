'use client';
 
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useState } from 'react';
import { adduser, sendEmail } from '@/app/lib/actions';
 
export default function AddUserForm() {


  // Add state of the new user submit
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Add state to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

   // State for form inputs
   const [username, setUserName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
       // add new user to database
        const result = await adduser(username, email, password);
        if (result.success) {
            setSuccess(`new user ${username} added!`);
            setError('');  
            
            } else {
                setError(result.message || 'Failed to add new user.');
            }
        } catch (err) {
            setError('An error occured. Please try again.')
            if (err instanceof Error){
              console.log(err.message)
            } 
            console.log( 'adding new user threw error')
        } 

        try {
            // send an auto email to the user giving them the new log in and password
            const result = await sendEmail(username, email, password);
            } catch (err) {
                if (err instanceof Error){
                  console.log(err.message)
                } 
                console.log( 'sending new user notification email threw error')
            } 


    };


 
  return (
    //<form action={formAction} className="space-y-3">
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        {/* //<h1 className={`${lusitana.className} mb-3 text-2xl`}> */}
        <h1 className={` mb-3 text-2xl`}>
          Please enter new user default info
        </h1>
        <div className="w-full">
        <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="username"
            >
              Name
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="username"
                type="username"
                name="username"
                placeholder="Enter the user's name (first last)"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              {/* <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
            </div>
          </div>

          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type={showPassword ? 'text' : 'password'} // Toggle input type
                name="password"
                placeholder="Enter default password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                {/* Add eye icon to toggle password visibility */}
                <button
                    type="button" // Prevent form submission
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)} // Toggle state
                >
                    {showPassword ? (
                    <EyeIcon className="h-5 w-5" />
                    ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                    )}
                </button>   
            
            
            </div>
          </div>
        </div>
        <Button className="mt-4 w-full" >
          Submit <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {/* {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )} */}

        {error && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{error}</p>
            </>
         )}
        
        
        {success && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{success}</p>
            </>
         )} 

        </div>
      </div>
    </form>
  );
}