// src/components/pages/MissingPages.tsx

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Download, Building, User, IndianRupee, Settings as SettingsIcon, HelpCircle, Plus, Edit, Trash2, X, Save, Eye, EyeOff, Mail, Phone, MessageCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define interfaces
interface School {
  id: string;
  name: string;
  students: number;
  status: 'Active' | 'Inactive';
  revenue: string;
  location: string;
  contact: string;
}

interface NewSchoolForm {
  name: string;
  location: string;
  contact: string;
  students: string;
  status: 'Active' | 'Inactive';
}

interface UserProfile {
  name: string;
  email: string;
  role: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ShowPasswords {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

interface AppSettings {
  emailNotifications: boolean;
  smsAlerts: boolean;
  autoRefresh: boolean;
  darkMode: boolean;
}

interface GatewaySettings {
  apiKey: string;
  pgKey: string;
  schoolId: string;
}

interface ContactForm {
  subject: string;
  message: string;
  priority: string;
}

interface FAQ {
  question: string;
  answer: string;
}

// Analytics Page with Working Export
export const Analytics: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('');

  const handleExport = async (format: string): Promise<void> => {
    setIsExporting(true);
    setExportFormat(format);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create and download file
    const data = `Analytics Report - ${new Date().toLocaleDateString()}\n\nTotal Revenue: ₹2,45,680\nTransactions: 1,234\nSuccess Rate: 98.5%\nActive Schools: 89`;
    
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
    alert(`Analytics report exported as ${format.toUpperCase()} successfully!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Payment insights and performance metrics
          </p>
        </div>
        <div className="relative">
          <button 
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Download className={`w-4 h-4 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
            {isExporting ? `Exporting ${exportFormat.toUpperCase()}...` : 'Export Report'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: '₹2,45,680', icon: DollarSign, color: 'green', change: '+12.5%' },
          { title: 'Transactions', value: '1,234', icon: BarChart3, color: 'blue', change: '+8.2%' },
          { title: 'Success Rate', value: '98.5%', icon: TrendingUp, color: 'purple', change: '-0.3%' },
          { title: 'Active Schools', value: '89', icon: Users, color: 'orange', change: '+2.4%' }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} vs last month
                  </p>
                </div>
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                  <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Export Options</h2>
          <div className="space-y-3">
            <button 
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              className="w-full text-left p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
            >
              <div className="font-medium text-gray-900 dark:text-white">Export as CSV</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Comma-separated values for Excel</div>
            </button>
            <button 
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="w-full text-left p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
            >
              <div className="font-medium text-gray-900 dark:text-white">Export as PDF</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Printable PDF report</div>
            </button>
            <button 
              onClick={() => handleExport('json')}
              disabled={isExporting}
              className="w-full text-left p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
            >
              <div className="font-medium text-gray-900 dark:text-white">Export as JSON</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Raw data for developers</div>
            </button>
          </div>
        </div>

        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Revenue Trends</h2>
          <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Chart visualization coming soon</p>
              <button 
                onClick={() => alert('Chart integration with libraries like Chart.js will be added')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 mt-2"
              >
                Learn more about charts →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Schools Management Page with Data Persistence
export const Schools: React.FC = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);

  // Initialize schools from localStorage or use default data
  const [schools, setSchools] = useState<School[]>(() => {
    const savedSchools = localStorage.getItem('schools');
    if (savedSchools) {
      return JSON.parse(savedSchools) as School[];
    }
    // Default schools if none saved
    return [
      { id: '65b0e6293e9f76a9694d84b4', name: 'Delhi Public School', students: 1250, status: 'Active', revenue: '₹1,25,000', location: 'New Delhi', contact: 'admin@dps.edu' },
      { id: '65b0e6293e9f76a9694d84b5', name: 'Kendriya Vidyalaya', students: 980, status: 'Active', revenue: '₹85,000', location: 'Mumbai', contact: 'admin@kv.edu' },
      { id: '65b0e6293e9f76a9694d84b6', name: 'Ryan International', students: 1450, status: 'Active', revenue: '₹1,75,000', location: 'Bangalore', contact: 'admin@ryan.edu' },
      { id: '65b0e6293e9f76a9694d84b7', name: 'DAV Public School', students: 750, status: 'Inactive', revenue: '₹45,000', location: 'Chennai', contact: 'admin@dav.edu' }
    ];
  });

  const [newSchool, setNewSchool] = useState<NewSchoolForm>({
    name: '',
    location: '',
    contact: '',
    students: '',
    status: 'Active'
  });

  // Save to localStorage whenever schools change
  useEffect(() => {
    localStorage.setItem('schools', JSON.stringify(schools));
  }, [schools]);

  const handleAddSchool = (): void => {
    if (!newSchool.name || !newSchool.location || !newSchool.contact) {
      alert('Please fill in all required fields');
      return;
    }

    const school: School = {
      id: `school_${Date.now()}`,
      name: newSchool.name,
      location: newSchool.location,
      contact: newSchool.contact,
      students: parseInt(newSchool.students) || 0,
      status: newSchool.status,
      revenue: '₹0'
    };

    setSchools([...schools, school]);
    setNewSchool({ name: '', location: '', contact: '', students: '', status: 'Active' });
    setShowAddModal(false);
    alert('School added successfully! Data will persist after refresh.');
  };

  const handleDeleteSchool = (schoolId: string, schoolName: string): void => {
    if (window.confirm(`Are you sure you want to delete ${schoolName}? This action cannot be undone.`)) {
      setSchools(schools.filter(s => s.id !== schoolId));
      alert('School deleted successfully!');
    }
  };

  const handleEditSchool = (school: School): void => {
    setEditingSchool(school);
    setNewSchool({
      name: school.name,
      location: school.location,
      contact: school.contact,
      students: school.students.toString(),
      status: school.status
    });
    setShowAddModal(true);
  };

  const handleUpdateSchool = (): void => {
    if (!newSchool.name || !newSchool.location || !newSchool.contact || !editingSchool) {
      alert('Please fill in all required fields');
      return;
    }

    setSchools(schools.map(s => 
      s.id === editingSchool.id 
        ? { ...s, name: newSchool.name, location: newSchool.location, contact: newSchool.contact, students: parseInt(newSchool.students) || 0, status: newSchool.status }
        : s
    ));
    
    setNewSchool({ name: '', location: '', contact: '', students: '', status: 'Active' });
    setEditingSchool(null);
    setShowAddModal(false);
    alert('School updated successfully!');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setNewSchool(prev => ({ ...prev, [name]: value }));
  };

  const closeModal = (): void => {
    setShowAddModal(false);
    setEditingSchool(null);
    setNewSchool({ name: '', location: '', contact: '', students: '', status: 'Active' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Schools Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage registered schools and their information
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New School
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/20">
          <div className="flex items-center">
            <Building className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Schools</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{schools.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/20">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{schools.reduce((sum, school) => sum + school.students, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/20">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Schools</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{schools.filter(s => s.status === 'Active').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/20">
          <div className="flex items-center">
            <IndianRupee className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{schools.reduce((sum, school) => {
                  const revenueNum = parseInt(school.revenue.replace('₹', '').replace(',', ''));
                  return sum + (isNaN(revenueNum) ? 0 : revenueNum);
                }, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Schools Table */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">School Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {schools.map((school) => (
                <tr key={school.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                        <Building className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{school.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{school.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{school.contact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{school.students.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      school.status === 'Active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {school.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => navigate(`/dashboard/transactions/school/${school.id}`)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 bg-indigo-100 dark:bg-indigo-900/20 px-3 py-1 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 inline mr-1" />
                      View
                    </button>
                    <button 
                      onClick={() => handleEditSchool(school)}
                      className="text-green-600 dark:text-green-400 hover:text-green-500 bg-green-100 dark:bg-green-900/20 px-3 py-1 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 inline mr-1" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteSchool(school.id, school.name)}
                      className="text-red-600 dark:text-red-400 hover:text-red-500 bg-red-100 dark:bg-red-900/20 px-3 py-1 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit School Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingSchool ? 'Edit School' : 'Add New School'}
                </h2>
                <button 
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">School Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={newSchool.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter school name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location *</label>
                  <input 
                    type="text" 
                    name="location"
                    value={newSchool.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter school location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Email *</label>
                  <input 
                    type="email" 
                    name="contact"
                    value={newSchool.contact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter contact email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Number of Students</label>
                  <input 
                    type="number" 
                    name="students"
                    value={newSchool.students}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter student count"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select 
                    name="status"
                    value={newSchool.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button 
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={editingSchool ? handleUpdateSchool : handleAddSchool}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  {editingSchool ? 'Update' : 'Add'} School
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Settings Page with Working Forms and Toggles
export const Settings: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) as UserProfile : {
      name: 'Demo User',
      email: 'demo@school.com',
      role: 'Administrator'
    };
  });

  const [profileData, setProfileData] = useState<UserProfile>({
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role
  });

  const [passwordData, setPasswordData] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState<ShowPasswords>({
    current: false,
    new: false,
    confirm: false
  });

  const [settings, setSettings] = useState<AppSettings>({
    emailNotifications: true,
    smsAlerts: false,
    autoRefresh: true,
    darkMode: localStorage.getItem('theme') === 'dark'
  });

  const [gatewaySettings, setGatewaySettings] = useState<GatewaySettings>({
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    pgKey: 'edvtest01',
    schoolId: '65b0e6293e9f76a9694d84b4'
  });

  const handleProfileUpdate = (): void => {
    if (!profileData.name || !profileData.email) {
      alert('Please fill in all required fields');
      return;
    }

    // Update localStorage
    const updatedUser: UserProfile = { ...currentUser, name: profileData.name, email: profileData.email };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    
    alert('Profile updated successfully!');
  };

  const handlePasswordChange = (): void => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    // Simulate password change
    alert('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordForm(false);
  };

  const handleSettingToggle = (setting: keyof AppSettings): void => {
    setSettings(prev => {
      const updated = { ...prev, [setting]: !prev[setting] };
      
      // Special handling for dark mode
      if (setting === 'darkMode') {
        if (updated.darkMode) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      }
      
      return updated;
    });
  };

  const handleGatewayUpdate = (): void => {
    if (!gatewaySettings.apiKey || !gatewaySettings.pgKey || !gatewaySettings.schoolId) {
      alert('Please fill in all gateway fields');
      return;
    }

    // Save to localStorage
    localStorage.setItem('gatewaySettings', JSON.stringify(gatewaySettings));
    alert('Payment gateway settings saved successfully!');
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleGatewayInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setGatewaySettings(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: keyof ShowPasswords): void => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Account preferences and system configuration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Profile Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={profileData.name}
                onChange={handleProfileInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                value={profileData.email}
                onChange={handleProfileInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
              <input 
                type="text" 
                value={profileData.role}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                disabled
              />
            </div>
            <button 
              onClick={handleProfileUpdate}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Update Profile
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <SettingsIcon className="w-5 h-5 mr-2" />
            Security
          </h2>
          <div className="space-y-4">
            <button 
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="w-full text-left p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="font-medium text-gray-900 dark:text-white">Change Password</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Update your account password</div>
            </button>

            {showPasswordForm && (
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showPasswords.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button 
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                  <div className="relative">
                    <input 
                      type={showPasswords.new ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button 
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button 
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setShowPasswordForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handlePasswordChange}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}

            <button 
              onClick={() => alert('Two-factor authentication setup would be implemented here')}
              className="w-full text-left p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</div>
            </button>
          </div>
        </div>

        {/* Payment Gateway Settings */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Payment Gateway Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">API Key</label>
              <input 
                type="password" 
                name="apiKey"
                value={gatewaySettings.apiKey}
                onChange={handleGatewayInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">PG Key</label>
              <input 
                type="text" 
                name="pgKey"
                value={gatewaySettings.pgKey}
                onChange={handleGatewayInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">School ID</label>
              <input 
                type="text" 
                name="schoolId"
                value={gatewaySettings.schoolId}
                onChange={handleGatewayInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button 
              onClick={handleGatewayUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Save Gateway Settings
            </button>
          </div>
        </div>

        {/* System Preferences */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">System Preferences</h2>
          <div className="space-y-4">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {key === 'emailNotifications' && 'Email Notifications'}
                    {key === 'smsAlerts' && 'SMS Alerts'}
                    {key === 'autoRefresh' && 'Auto-refresh Dashboard'}
                    {key === 'darkMode' && 'Dark Mode'}
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {key === 'emailNotifications' && 'Receive email alerts for transactions'}
                    {key === 'smsAlerts' && 'Get SMS notifications for payments'}
                    {key === 'autoRefresh' && 'Automatically refresh data every 30 seconds'}
                    {key === 'darkMode' && 'Use dark theme throughout the application'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={value}
                    onChange={() => handleSettingToggle(key as keyof AppSettings)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Help & Support Page with Working Contact Features
export const Help: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState<ContactForm>({
    subject: '',
    message: '',
    priority: 'medium'
  });

  const faqs: FAQ[] = [
    {
      question: "How do I create a new payment?",
      answer: "Navigate to 'Create Payment' from the sidebar, fill in the student and payment details, and submit the form. The system will generate a payment link that can be shared with students."
    },
    {
      question: "How can I track payment status?",
      answer: "Use the 'Transaction Status' page to check any payment status using the transaction ID or collect ID. You can also view all transactions in the 'All Transactions' page."
    },
    {
      question: "What payment methods are supported?",
      answer: "We support UPI, Net Banking, Credit/Debit Cards, and digital wallets like PayTM, PhonePe, and Paytm through our integrated payment gateways."
    },
    {
      question: "How do I export transaction data?",
      answer: "Click the 'Export' button on the transactions page to download data in CSV, Excel, or PDF format. You can also export filtered data based on your search criteria."
    },
    {
      question: "How do I add a new school?",
      answer: "Go to the 'Schools' page and click 'Add New School'. Fill in the school details including name, address, contact information, and administrator details."
    },
    {
      question: "What should I do if a payment fails?",
      answer: "Failed payments are automatically logged in the system. Check the transaction details for the error message. Students can retry the payment using the same link."
    }
  ];

  const handleContact = (type: string): void => {
    switch (type) {
      case 'email':
        window.location.href = 'mailto:support@schoolpay.com?subject=Support Request';
        break;
      case 'phone':
        window.location.href = 'tel:+911234567890';
        break;
      case 'whatsapp':
        window.open('https://wa.me/919876543210', '_blank');
        break;
      default:
        alert(`${type} support would be implemented here`);
    }
  };

  const handleSubmitTicket = (): void => {
    if (!contactForm.subject || !contactForm.message) {
      alert('Please fill in both subject and message');
      return;
    }

    // Simulate ticket submission
    alert(`Support ticket submitted successfully!\n\nTicket ID: TKT${Date.now()}\nSubject: ${contactForm.subject}\nPriority: ${contactForm.priority}\n\nOur support team will respond within 24 hours.`);
    setContactForm({ subject: '', message: '', priority: 'medium' });
  };

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Help & Support</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Get assistance and find answers to common questions
        </p>
      </div>

      {/* Quick Contact Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            title: 'Email Support', 
            description: '24/7 email assistance', 
            action: 'Send Email',
            icon: Mail,
            color: 'blue',
            contact: 'support@schoolpay.com',
            onClick: () => handleContact('email')
          },
          { 
            title: 'Phone Support', 
            description: 'Mon-Fri 9AM-6PM', 
            action: 'Call Now',
            icon: Phone,
            color: 'green',
            contact: '+91 12345 67890',
            onClick: () => handleContact('phone')
          },
          { 
            title: 'WhatsApp', 
            description: 'Quick chat support', 
            action: 'Chat Now',
            icon: MessageCircle,
            color: 'green',
            contact: '+91 98765 43210',
            onClick: () => handleContact('whatsapp')
          },
          { 
            title: 'Documentation', 
            description: 'Detailed user guides', 
            action: 'View Docs',
            icon: HelpCircle,
            color: 'purple',
            contact: 'docs.schoolpay.com',
            onClick: () => window.open('https://docs.schoolpay.com', '_blank')
          }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-xl bg-${item.color}-100 dark:bg-${item.color}-900/20`}>
                  <Icon className={`w-6 h-6 text-${item.color}-600 dark:text-${item.color}-400`} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{item.contact}</p>
              <button 
                onClick={item.onClick}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {item.action}
                <ExternalLink className="w-4 h-4 inline ml-2" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FAQ Section */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Support Ticket */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Submit Support Ticket</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject *</label>
              <input 
                type="text" 
                name="subject"
                value={contactForm.subject}
                onChange={handleContactFormChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Brief description of your issue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
              <select 
                name="priority"
                value={contactForm.priority}
                onChange={handleContactFormChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="low">Low - General question</option>
                <option value="medium">Medium - Issue affecting workflow</option>
                <option value="high">High - Urgent business impact</option>
                <option value="critical">Critical - System down</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message *</label>
              <textarea 
                name="message"
                value={contactForm.message}
                onChange={handleContactFormChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Please describe your issue in detail..."
              />
            </div>

            <button 
              onClick={handleSubmitTicket}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Submit Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};