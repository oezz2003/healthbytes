'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  Cog6ToothIcon,
  UserIcon,
  BellIcon,
  LockClosedIcon,
  BuildingStorefrontIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

// Tab interface
interface Tab {
  name: string;
  key: string;
  icon: React.ElementType;
}

// Tabs for settings
const tabs: Tab[] = [
  { name: 'General', key: 'general', icon: Cog6ToothIcon },
  { name: 'Account', key: 'account', icon: UserIcon },
  { name: 'Notifications', key: 'notifications', icon: BellIcon },
  { name: 'Security', key: 'security', icon: LockClosedIcon },
  { name: 'Restaurant', key: 'restaurant', icon: BuildingStorefrontIcon },
  { name: 'Billing', key: 'billing', icon: CreditCardIcon },
  { name: 'Terms & Privacy', key: 'terms', icon: DocumentTextIcon },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Restaurant Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure general settings for your restaurant.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700">
                    Restaurant Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="restaurantName"
                      id="restaurantName"
                      defaultValue="HealthyBites Restaurant"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Contact Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      defaultValue="contact@foodapp.com"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      defaultValue="+1 (555) 123-4567"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                    Timezone
                  </label>
                  <div className="mt-1">
                    <select
                      id="timezone"
                      name="timezone"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      defaultValue="America/New_York"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="America/Anchorage">Alaska Time (AKT)</option>
                      <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="address"
                      id="address"
                      defaultValue="123 Main St, Anytown, ST 12345"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Restaurant Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                      defaultValue="Delicious food delivered to your doorstep."
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Brief description of your restaurant for customers.
                  </p>
                </div>
              </div>

              <div className="pt-5 border-t border-gray-200">
                <div className="flex justify-end">
                  <Button
                    variant="light"
                    type="button"
                    className="mr-3"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    isLoading={isSaving}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </form>
        );
      
      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account information.
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-5 space-y-6">
              <div>
                <h4 className="text-base font-medium text-gray-800">Personal Information</h4>
                <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        defaultValue="John"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        defaultValue="Doe"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        defaultValue="john.doe@example.com"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        defaultValue="+1 (555) 987-6543"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                        defaultValue="Restaurant manager with 5+ years of experience."
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description for your profile.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-base font-medium text-gray-800">Profile Picture</h4>
                <div className="mt-4 flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-300">
                        <span className="text-2xl font-medium text-gray-600">JD</span>
                      </div>
                      <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Change
                    </button>
                    <p className="mt-1 text-xs text-gray-500">
                      JPG, GIF or PNG. 1MB max.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-base font-medium text-gray-800">Account Preferences</h4>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Email Digest</span>
                      <p className="text-xs text-gray-500">Receive a weekly digest of your account activity</p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
                      <p className="text-xs text-gray-500">Enable two-factor authentication for additional security</p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-base font-medium text-gray-800">Language & Region</h4>
                <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 gap-x-4">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                      Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      defaultValue="en"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                      Date Format
                    </label>
                    <select
                      id="dateFormat"
                      name="dateFormat"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      defaultValue="mdy"
                    >
                      <option value="mdy">MM/DD/YYYY</option>
                      <option value="dmy">DD/MM/YYYY</option>
                      <option value="ymd">YYYY/MM/DD</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="pt-5 border-t border-gray-200">
                <div className="flex justify-end">
                  <Button
                    variant="light"
                    type="button"
                    className="mr-3"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="button"
                    onClick={handleSubmit}
                    isLoading={isSaving}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
              <p className="mt-1 text-sm text-gray-500">
                Configure how you receive notifications.
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-5 space-y-6">
              <div>
                <h4 className="text-base font-medium text-gray-800">Email Notifications</h4>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Order Updates</span>
                      <p className="text-xs text-gray-500">Receive emails about new orders and status changes</p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Inventory Alerts</span>
                      <p className="text-xs text-gray-500">Get notified when inventory items are running low</p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">System Updates</span>
                      <p className="text-xs text-gray-500">Get notified about system updates and maintenance</p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-base font-medium text-gray-800">In-App Notifications</h4>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Show Order Notifications</span>
                      <p className="text-xs text-gray-500">Display notifications for new orders</p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Sound Alerts</span>
                      <p className="text-xs text-gray-500">Play sound when new notifications arrive</p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Show Desktop Notifications</span>
                      <p className="text-xs text-gray-500">Allow browser notifications when the app is in background</p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-base font-medium text-gray-800">Notification Preferences</h4>
                <div className="mt-4 grid grid-cols-1 gap-y-4">
                  <div>
                    <label htmlFor="notification-frequency" className="block text-sm font-medium text-gray-700">
                      Notification Frequency
                    </label>
                    <select
                      id="notification-frequency"
                      name="notification-frequency"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      defaultValue="immediate"
                    >
                      <option value="immediate">Immediate</option>
                      <option value="hourly">Hourly Digest</option>
                      <option value="daily">Daily Digest</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="quiet-hours" className="block text-sm font-medium text-gray-700">
                      Quiet Hours
                    </label>
                    <div className="mt-1 grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="quiet-start" className="block text-xs text-gray-500">From</label>
                        <input
                          type="time"
                          id="quiet-start"
                          name="quiet-start"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          defaultValue="22:00"
                        />
                      </div>
                      <div>
                        <label htmlFor="quiet-end" className="block text-xs text-gray-500">To</label>
                        <input
                          type="time"
                          id="quiet-end"
                          name="quiet-end"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          defaultValue="07:00"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-5 border-t border-gray-200">
                <div className="flex justify-end">
                  <Button
                    variant="light"
                    type="button"
                    className="mr-3"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="button"
                    onClick={handleSubmit}
                    isLoading={isSaving}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your security preferences.
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-5 space-y-6">
              <div>
                <h4 className="text-base font-medium text-gray-800">Change Password</h4>
                <div className="mt-4 grid grid-cols-1 gap-y-6">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="current-password"
                        id="current-password"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="new-password"
                        id="new-password"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        placeholder="••••••••"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 8 characters and include a number and a special character.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="confirm-password"
                        id="confirm-password"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <Button
                      variant="primary"
                      type="button"
                      className="w-full sm:w-auto"
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-base font-medium text-gray-800">Two-Factor Authentication</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Add an extra layer of security to your account by requiring both your password and a verification code from your mobile phone.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
                    <p className="text-xs text-gray-500">Currently: <span className="text-red-600 font-medium">Disabled</span></p>
                  </div>
                  <div className="ml-4">
                    <Button
                      variant="secondary"
                      type="button"
                    >
                      Enable
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-base font-medium text-gray-800">Login Sessions</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your active login sessions.
                </p>
                <div className="mt-4 border border-gray-200 rounded-md overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-700">Current Session</div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Started: Today, 10:23 AM | Browser: Chrome on Windows
                    </div>
                  </div>

                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-700">Mobile App</div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Started: Yesterday, 5:34 PM | Device: iPhone 13
                    </div>
                  </div>

                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-700">Home Computer</div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Started: 4 days ago | Browser: Firefox on Mac
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="danger"
                    type="button"
                  >
                    Logout of All Other Sessions
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-base font-medium text-gray-800">Security Log</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Recent security-related activities on your account.
                </p>
                <div className="mt-4 border border-gray-200 rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Login successful</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Today, 10:23 AM</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Riyadh, Saudi Arabia</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Password changed</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">5 days ago</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Riyadh, Saudi Arabia</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">New device logged in</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">1 week ago</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Jeddah, Saudi Arabia</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="pt-5 border-t border-gray-200">
                <div className="flex justify-end">
                  <Button
                    variant="light"
                    type="button"
                    className="mr-3"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="button"
                    onClick={handleSubmit}
                    isLoading={isSaving}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'restaurant':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Restaurant Profile</h3>
              <p className="mt-1 text-sm text-gray-500">
                Update your restaurant's profile information.
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-5 space-y-6">
              <div>
                <h4 className="text-base font-medium text-gray-800">Basic Information</h4>
                <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label htmlFor="restaurant-name" className="block text-sm font-medium text-gray-700">
                      Restaurant Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="restaurant-name"
                        id="restaurant-name"
                        defaultValue="HealthyBites Restaurant"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="restaurant-type" className="block text-sm font-medium text-gray-700">
                      Restaurant Type
                    </label>
                    <div className="mt-1">
                      <select
                        id="restaurant-type"
                        name="restaurant-type"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        defaultValue="fastfood"
                      >
                        <option value="fastfood">Fast Food</option>
                        <option value="casual">Casual Dining</option>
                        <option value="finedining">Fine Dining</option>
                        <option value="cafe">Café</option>
                        <option value="buffet">Buffet</option>
                        <option value="foodtruck">Food Truck</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                        defaultValue="Delicious food delivered to your doorstep. We offer a wide variety of meals prepared by our expert chefs using only the freshest ingredients."
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description of your restaurant for customers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-base font-medium text-gray-800">Restaurant Logo</h4>
                <div className="mt-4 flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-300">
                        <span className="text-3xl font-medium text-gray-600">FA</span>
                      </div>
                      <div className="absolute inset-0 rounded-lg shadow-inner" aria-hidden="true"></div>
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Change
                    </button>
                    <p className="mt-1 text-xs text-gray-500">
                      JPG, GIF or PNG. 1MB max. Recommended size: 200x200px.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-base font-medium text-gray-800">Contact Information</h4>
                <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="contact-email"
                        id="contact-email"
                        defaultValue="contact@healthybites.com"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="tel"
                        name="contact-phone"
                        id="contact-phone"
                        defaultValue="+1 (555) 123-4567"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                      Website
                    </label>
                    <div className="mt-1">
                      <input
                        type="url"
                        name="website"
                        id="website"
                        defaultValue="https://healthybites.com"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="social-media" className="block text-sm font-medium text-gray-700">
                      Social Media Handle
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="social-media"
                        id="social-media"
                        defaultValue="@healthybites"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-base font-medium text-gray-800">Location</h4>
                <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        defaultValue="123 Main St, Anytown, ST 12345"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        defaultValue="Anytown"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State/Province
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="state"
                        id="state"
                        defaultValue="ST"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                      ZIP / Postal Code
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="zip"
                        id="zip"
                        defaultValue="12345"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <div className="mt-1">
                      <select
                        id="country"
                        name="country"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        defaultValue="US"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="MX">Mexico</option>
                        <option value="SA">Saudi Arabia</option>
                        <option value="AE">United Arab Emirates</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-base font-medium text-gray-800">Business Hours</h4>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-700">Monday</div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        name="monday-open"
                        id="monday-open"
                        defaultValue="09:00"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md p-1 border"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        name="monday-close"
                        id="monday-close"
                        defaultValue="21:00"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md p-1 border"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-700">Tuesday</div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        name="tuesday-open"
                        id="tuesday-open"
                        defaultValue="09:00"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md p-1 border"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        name="tuesday-close"
                        id="tuesday-close"
                        defaultValue="21:00"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md p-1 border"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-700">Wednesday</div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        name="wednesday-open"
                        id="wednesday-open"
                        defaultValue="09:00"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md p-1 border"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        name="wednesday-close"
                        id="wednesday-close"
                        defaultValue="21:00"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md p-1 border"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-700">Thursday</div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        name="thursday-open"
                        id="thursday-open"
                        defaultValue="09:00"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md p-1 border"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        name="thursday-close"
                        id="thursday-close"
                        defaultValue="21:00"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md p-1 border"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-700">Friday</div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        name="friday-open"
                        id="friday-open"
                        defaultValue="09:00"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md p-1 border"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        name="friday-close"
                        id="friday-close"
                        defaultValue="22:00"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md p-1 border"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-700">Saturday</div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        name="saturday-open"
                        id="saturday-open"
                        defaultValue="10:00"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md p-1 border"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        name="saturday-close"
                        id="saturday-close"
                        defaultValue="22:00"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md p-1 border"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-700">Sunday</div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        name="sunday-open"
                        id="sunday-open"
                        defaultValue="10:00"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md p-1 border"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        name="sunday-close"
                        id="sunday-close"
                        defaultValue="21:00"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md p-1 border"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-5 border-t border-gray-200">
                <div className="flex justify-end">
                  <Button
                    variant="light"
                    type="button"
                    className="mr-3"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="button"
                    onClick={handleSubmit}
                    isLoading={isSaving}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Billing Settings</h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your billing information and payment methods.
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-5 space-y-6">
              <div>
                <h4 className="text-base font-medium text-gray-800">Subscription Plan</h4>
                <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Current Plan:</span>
                      <span className="ml-2 text-sm font-bold text-primary-600">Premium Plan</span>
                    </div>
                    <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">Active</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <p>Billing cycle: Monthly</p>
                      <p>Next billing date: June 15, 2023</p>
                    </div>
                    <div className="text-sm font-medium text-primary-600">$49.99/month</div>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      type="button"
                      className="mr-3"
                    >
                      Change Plan
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-base font-medium text-gray-800">Payment Methods</h4>
                <div className="mt-4 space-y-4">
                  <div className="bg-white border border-gray-200 rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-16 bg-gray-200 rounded flex items-center justify-center">
                          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Visa ending in 4242</div>
                          <div className="text-sm text-gray-500">Expires 12/2025</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs font-medium text-primary-800 bg-primary-100 rounded-full">Primary</span>
                        <button className="text-sm text-gray-500 hover:text-gray-700">Edit</button>
                        <button className="text-sm text-red-500 hover:text-red-700">Remove</button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-16 bg-gray-200 rounded flex items-center justify-center">
                          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Mastercard ending in 5555</div>
                          <div className="text-sm text-gray-500">Expires 08/2024</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-sm text-gray-500 hover:text-gray-700">Set as primary</button>
                        <button className="text-sm text-gray-500 hover:text-gray-700">Edit</button>
                        <button className="text-sm text-red-500 hover:text-red-700">Remove</button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full"
                    >
                      <span className="flex items-center justify-center">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add New Payment Method
                      </span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-base font-medium text-gray-800">Billing Information</h4>
                <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="billing-name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="billing-name"
                        id="billing-name"
                        defaultValue="John Doe"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="billing-email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="billing-email"
                        id="billing-email"
                        defaultValue="john.doe@example.com"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="billing-address" className="block text-sm font-medium text-gray-700">
                      Billing Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="billing-address"
                        id="billing-address"
                        defaultValue="123 Billing St, Suite 100"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="billing-city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="billing-city"
                        id="billing-city"
                        defaultValue="San Francisco"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="billing-state" className="block text-sm font-medium text-gray-700">
                      State / Province
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="billing-state"
                        id="billing-state"
                        defaultValue="CA"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="billing-zip" className="block text-sm font-medium text-gray-700">
                      ZIP / Postal Code
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="billing-zip"
                        id="billing-zip"
                        defaultValue="94103"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-base font-medium text-gray-800">Billing History</h4>
                <div className="mt-4 border border-gray-200 rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">#INV-2023-005</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">May 15, 2023</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">$49.99</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900">Download</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">#INV-2023-004</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">April 15, 2023</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">$49.99</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900">Download</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">#INV-2023-003</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">March 15, 2023</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">$49.99</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900">Download</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="pt-5 border-t border-gray-200">
                <div className="flex justify-end">
                  <Button
                    variant="light"
                    type="button"
                    className="mr-3"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="button"
                    onClick={handleSubmit}
                    isLoading={isSaving}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'terms':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Terms & Privacy</h3>
              <p className="mt-1 text-sm text-gray-500">
                Review and update your terms of service and privacy policy.
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-5 space-y-6">
              <div>
                <h4 className="text-base font-medium text-gray-800">Terms of Service</h4>
                <p className="mt-2 text-sm text-gray-500">
                  These terms will be displayed to users when they sign up for your service.
                </p>
                <div className="mt-4">
                  <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                    <div className="mb-4 flex items-center justify-between">
                      <h5 className="text-sm font-medium text-gray-700">Current Version: 1.2</h5>
                      <span className="text-xs text-gray-500">Last updated: May 10, 2023</span>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-500">
                      <p>
                        Welcome to HealthyBites! These Terms of Service govern your use of our website and services.
                        By accessing or using our service, you agree to be bound by these Terms.
                      </p>
                      <h6 className="text-sm font-medium text-gray-700 mt-2">1. Use of Service</h6>
                      <p>
                        You agree to use the service only for lawful purposes and in accordance with these Terms.
                        You are responsible for maintaining the confidentiality of your account information.
                      </p>
                      <h6 className="text-sm font-medium text-gray-700 mt-2">2. User Content</h6>
                      <p>
                        You retain all rights to any content you submit, post or display on or through the service.
                        By submitting content, you grant us a worldwide, non-exclusive license to use, reproduce, and distribute such content.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="terms-editor" className="block text-sm font-medium text-gray-700">
                      Edit Terms of Service
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="terms-editor"
                        name="terms-editor"
                        rows={8}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                        defaultValue="Welcome to HealthyBites! These Terms of Service govern your use of our website and services. By accessing or using our service, you agree to be bound by these Terms.

1. Use of Service
You agree to use the service only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account information.

2. User Content
You retain all rights to any content you submit, post or display on or through the service. By submitting content, you grant us a worldwide, non-exclusive license to use, reproduce, and distribute such content."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-base font-medium text-gray-800">Privacy Policy</h4>
                <p className="mt-2 text-sm text-gray-500">
                  This privacy policy explains how we collect, use, and share user data.
                </p>
                <div className="mt-4">
                  <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                    <div className="mb-4 flex items-center justify-between">
                      <h5 className="text-sm font-medium text-gray-700">Current Version: 1.3</h5>
                      <span className="text-xs text-gray-500">Last updated: May 15, 2023</span>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-500">
                      <p>
                        This Privacy Policy describes how HealthyBites collects, uses, and discloses your personal information.
                      </p>
                      <h6 className="text-sm font-medium text-gray-700 mt-2">1. Information We Collect</h6>
                      <p>
                        We collect information you provide directly to us, such as your name, email address, and payment information.
                        We also automatically collect certain information when you use our service.
                      </p>
                      <h6 className="text-sm font-medium text-gray-700 mt-2">2. How We Use Your Information</h6>
                      <p>
                        We use the information we collect to provide, maintain, and improve our services,
                        process transactions, send communications, and for other purposes described in this policy.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="privacy-editor" className="block text-sm font-medium text-gray-700">
                      Edit Privacy Policy
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="privacy-editor"
                        name="privacy-editor"
                        rows={8}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                        defaultValue="This Privacy Policy describes how HealthyBites collects, uses, and discloses your personal information.

1. Information We Collect
We collect information you provide directly to us, such as your name, email address, and payment information. We also automatically collect certain information when you use our service.

2. How We Use Your Information
We use the information we collect to provide, maintain, and improve our services, process transactions, send communications, and for other purposes described in this policy."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-base font-medium text-gray-800">Cookie Policy</h4>
                <p className="mt-2 text-sm text-gray-500">
                  Configure how cookies are used on your website.
                </p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Essential Cookies</span>
                      <p className="text-xs text-gray-500">Required for the website to function properly</p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked disabled className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Analytics Cookies</span>
                      <p className="text-xs text-gray-500">Help us improve our website by collecting anonymous information</p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Marketing Cookies</span>
                      <p className="text-xs text-gray-500">Used to track visitors across websites for marketing purposes</p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-5 border-t border-gray-200">
                <div className="flex justify-end">
                  <Button
                    variant="light"
                    type="button"
                    className="mr-3"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="button"
                    onClick={handleSubmit}
                    isLoading={isSaving}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="Settings">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your application settings and preferences
        </p>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">Settings saved successfully!</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                    activeTab === tab.key
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 ${
                    activeTab === tab.key ? 'text-primary-500' : 'text-gray-500'
                  }`} />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card>
            {renderTabContent()}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage; 