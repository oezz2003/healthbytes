'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  PlusIcon, PencilIcon, TrashIcon, ExclamationCircleIcon, 
  EnvelopeIcon, PhoneIcon, UserIcon, InformationCircleIcon, EyeIcon
} from '@heroicons/react/24/outline';
import { User, UserRole } from '@/types';
import { useRouter } from 'next/navigation';

// إنشاء معرف فريد أكثر موثوقية
const generateUniqueId = () => {
  return `user-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

// User form component
const UserForm = ({ 
  user, 
  onSubmit, 
  onCancel 
}: { 
  user?: User | null, 
  onSubmit: (userData: any, isNewUser: boolean) => Promise<boolean>, 
  onCancel: () => void 
}) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [role, setRole] = useState<UserRole>(user?.role || 'Customer');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!name || !email || !phone || !role) {
        throw new Error('Please fill all required fields');
      }

      // If new user, validate password
      if (!user) {
        if (!password) {
          throw new Error('Password is required');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
      }

      const userData = {
        name,
        email,
        phone,
        role,
        address,
        ...(user ? {} : { password }),
        ...(profileImage ? { profileImage } : {})
      };

      await onSubmit(userData, !user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const availableRoles: UserRole[] = ['Admin', 'Super Admin', 'Operation Manager', 'Accounting Manager', 'Sales Manager', 'Customer', 'Staff'];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{user ? 'Edit User' : 'Add New User'}</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-50 border-l-4 border-red-500 text-red-700">
          <div className="flex items-center">
            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="John Doe"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="email@example.com"
              disabled={!!user} // Disable email editing for existing users
              required
            />
            {user && (
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed after account creation</p>
            )}
          </div>
        </div>

        {!user && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="••••••••"
                required={!user}
                minLength={6}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="••••••••"
                required={!user}
              />
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="+1 (123) 456-7890"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              {availableRoles.map((roleOption) => (
                <option key={roleOption} value={roleOption}>{roleOption}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="123 Main St, City, State, Zip"
            rows={2}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
          <div className="flex items-center space-x-4">
            {profileImage && (
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button
            variant="light"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={loading}
          >
            {user ? 'Update User' : 'Add User'}
          </Button>
        </div>
      </form>
    </div>
  );
};

const UsersPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        
        // Fetch users from API
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to load users');
        }
        
        setUsers(data.data || []);
        setFilteredUsers(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load users'));
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Filter users when search term or selected role changes
  useEffect(() => {
    let result = [...users];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term)
      );
    }
    
    // Filter by role
    if (selectedRole) {
      result = result.filter(user => user.role === selectedRole);
    }
    
    setFilteredUsers(result);
  }, [users, searchTerm, selectedRole]);

  // Handle adding a new user
  const handleAddUser = async (userData: any) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to add user');
      }
      
      // Add the new user to the state
      setUsers(prevUsers => [...prevUsers, data.data]);
      
      setIsFormModalOpen(false);
      return true;
    } catch (err) {
      console.error('Error adding user:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to add user.');
    }
  };

  // Handle updating a user
  const handleUpdateUser = async (userData: any) => {
    try {
      if (!editingUser) return false;
      
      const response = await fetch(`/api/users?id=${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update user');
      }
      
      // Update the user in the state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...data.data } 
            : user
        )
      );
      
      setIsFormModalOpen(false);
      setEditingUser(null);
      return true;
    } catch (err) {
      console.error('Error updating user:', err);
      throw new Error('Failed to update user.');
    }
  };

  // Handle form submission (add or update)
  const handleFormSubmit = async (userData: any, isNewUser: boolean) => {
    if (isNewUser) {
      return handleAddUser(userData);
    } else {
      return handleUpdateUser(userData);
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async () => {
    try {
      if (!userToDelete) return false;
      
      const response = await fetch(`/api/users?id=${userToDelete.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete user');
      }
      
      // Remove the user from the state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
      
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      return true;
    } catch (err) {
      console.error('Error deleting user:', err);
      return false;
    }
  };

  // Extract unique roles from users for the filter buttons
  const roles = React.useMemo(() => {
    const uniqueRoles = new Set<UserRole>();
    users.forEach(user => {
      if (user.role) {
        uniqueRoles.add(user.role);
      }
    });
    return Array.from(uniqueRoles);
  }, [users]);

  return (
    <DashboardLayout title="Users">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all users in the system
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<PlusIcon className="h-5 w-5" />}
          className="mt-4 sm:mt-0"
          onClick={() => {
            setEditingUser(null);
            setIsFormModalOpen(true);
          }}
        >
          Add New User
        </Button>
      </div>

      {/* Search and filter */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Role filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedRole === undefined ? 'primary' : 'light'}
            size="sm"
            onClick={() => setSelectedRole(undefined)}
          >
            All Roles
          </Button>
          {roles.map((role) => (
            <Button
              key={role}
              variant={selectedRole === role ? 'primary' : 'light'}
              size="sm"
              onClick={() => setSelectedRole(role)}
            >
              {role}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <Card className="bg-red-50 border-red-200">
          <p className="text-red-600">{error.message}</p>
        </Card>
      ) : (
        <>
          {/* Users Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          {user.profileImage ? (
                            <img 
                              src={user.profileImage} 
                              alt={user.name} 
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <UserIcon className="h-5 w-5 text-primary-600" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div 
                            className="text-sm font-medium text-gray-900 cursor-pointer hover:text-primary-600"
                            onClick={() => router.push(`/dashboard/users/${user.id}`)}
                          >
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-500" />
                        {user.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-1 text-gray-500" />
                        {user.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${user.role === 'Admin' || user.role === 'Super Admin' 
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'Operation Manager' || user.role === 'Accounting Manager' || user.role === 'Sales Manager'
                          ? 'bg-blue-100 text-blue-800'
                          : user.role === 'Staff'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => router.push(`/dashboard/users/${user.id}`)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => {
                            setEditingUser(user);
                            setIsFormModalOpen(true);
                          }}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => {
                            setUserToDelete(user);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {filteredUsers.length === 0 && !loading && (
        <Card className="bg-gray-50 border-gray-200">
          <div className="py-12 text-center">
            <div className="flex justify-center mb-4">
              <PlusIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No users found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {selectedRole
                ? `No users found with the "${selectedRole}" role.`
                : searchTerm 
                  ? `No users matching "${searchTerm}".`
                  : 'Get started by adding a new user.'}
            </p>
            <div className="mt-6">
              <Button
                variant="primary"
                leftIcon={<PlusIcon className="h-5 w-5" />}
                onClick={() => {
                  setEditingUser(null);
                  setIsFormModalOpen(true);
                }}
              >
                Add New User
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* User Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
              </div>
              <div className="p-6">
            <UserForm 
              user={editingUser} 
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsFormModalOpen(false);
                setEditingUser(null);
              }}
            />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative w-full max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
              </div>
              <div className="p-6">
                <p className="mb-4">Are you sure you want to delete "{userToDelete?.name}"?</p>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setUserToDelete(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={handleDeleteUser}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UsersPage; 