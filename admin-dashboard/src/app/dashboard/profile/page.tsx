'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  UserIcon, 
  EnvelopeIcon, 
  ShieldCheckIcon, 
  CameraIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/hooks/useAuth';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle profile form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password form change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    // In a real app, this would call an API to update the user profile
    console.log('Updating profile:', formData);
    
    // Simulate API call with delay
    setTimeout(() => {
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    }, 800);
  };

  // Handle password update
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('All password fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    // In a real app, this would call an API to update the password
    console.log('Updating password');
    
    // Simulate API call with delay
    setTimeout(() => {
      setSuccess('Password updated successfully');
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }, 800);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <DashboardLayout title="Profile">
        <Card>
          <div className="p-6 text-center">
            <p>You need to be logged in to view this page.</p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => router.push('/auth/login')}
            >
              Go to Login
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Profile">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="md:col-span-1">
          <Card>
            <div className="p-6 flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary-800 text-2xl font-medium">
                    {user.name ? user.name.substring(0, 1).toUpperCase() : 'U'}
                  </span>
                </div>
                <button 
                  className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border border-gray-300 hover:bg-gray-100"
                  title="Change profile picture"
                >
                  <CameraIcon className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mt-2">{user.name}</h2>
              
              <div className="mt-2">
                <span className="px-3 py-1 inline-flex text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                  {user.role}
                </span>
              </div>
              
              <div className="mt-4 text-gray-600">
                <div className="flex items-center justify-center">
                  <EnvelopeIcon className="h-5 w-5 mr-2" />
                  <span>{user.email}</span>
                </div>
              </div>

              <div className="mt-6 w-full">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="light"
                  fullWidth
                  className="mt-2"
                  onClick={() => setIsChangingPassword(true)}
                >
                  Change Password
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  className="mt-4"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Profile Details */}
        <div className="md:col-span-2">
          {isEditing ? (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Profile</h3>
                
                {error && (
                  <div className="mb-4 p-2 bg-red-50 border-l-4 border-red-500 text-red-700">
                    <p>{error}</p>
                  </div>
                )}
                
                {success && (
                  <div className="mb-4 p-2 bg-green-50 border-l-4 border-green-500 text-green-700">
                    <p>{success}</p>
                  </div>
                )}
                
                <form onSubmit={handleProfileUpdate}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                      <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                    </div>
                    
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        id="role"
                        value={user.role}
                        disabled
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                      <p className="mt-1 text-xs text-gray-500">Role can only be changed by an administrator</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button
                      variant="light"
                      type="button"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          ) : isChangingPassword ? (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                
                {error && (
                  <div className="mb-4 p-2 bg-red-50 border-l-4 border-red-500 text-red-700">
                    <p>{error}</p>
                  </div>
                )}
                
                {success && (
                  <div className="mb-4 p-2 bg-green-50 border-l-4 border-green-500 text-green-700">
                    <p>{success}</p>
                  </div>
                )}
                
                <form onSubmit={handlePasswordUpdate}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                      <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters</p>
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button
                      variant="light"
                      type="button"
                      onClick={() => setIsChangingPassword(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                    >
                      Update Password
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                      <p className="mt-1 flex items-center">
                        <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                        {user.name || 'Not set'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Email Address</h4>
                      <p className="mt-1 flex items-center">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Role & Permissions</h4>
                    <p className="mt-1 flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-2" />
                      {user.role}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-500">Account Security</h4>
                    <div className="mt-2 flex items-center">
                      <KeyIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm">Password</p>
                        <p className="text-xs text-gray-500">Last changed: Never</p>
                      </div>
                      <Button
                        variant="light"
                        size="sm"
                        className="ml-auto"
                        onClick={() => setIsChangingPassword(true)}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Activity Card */}
          <Card className="mt-6">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              
              <div className="text-center py-8 text-gray-500">
                <p>No recent activity to display.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage; 
 
 
 
 