import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Save,
  Edit3,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: user ? `${user.first_name} ${user.last_name}` : '',
      email: user?.email || '',
      phone: user?.phone || '',
      student_id: user?.student_id || '',
      college_id: user?.college_id || ''
    }
  });

  const colleges = [
    { id: 1, name: 'Reva University' },
    { id: 4, name: 'R.V. College of Engineering' },
    { id: 5, name: 'M.S. Ramaiah Institute of Technology' },
    { id: 6, name: 'BMS College of Engineering' },
    { id: 7, name: 'PES University' },
    { id: 8, name: 'Dayananda Sagar College of Engineering' },
    { id: 9, name: 'Nitte Meenakshi Institute of Technology' },
    { id: 10, name: 'Acharya Institute of Technology' },
    { id: 11, name: 'CMR Institute of Technology' },
    { id: 12, name: 'New Horizon College of Engineering' }
  ];

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await updateProfile(data);
    
    if (result.success) {
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } else {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    reset({
      name: user ? `${user.first_name} ${user.last_name}` : '',
      email: user?.email || '',
      phone: user?.phone || '',
      student_id: user?.student_id || '',
      college_id: user?.college_id || ''
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>
        {!isEditing && (
          <button 
            onClick={handleEdit}
            className="btn btn-primary"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{user ? `${user.first_name} ${user.last_name}` : ''}</h3>
              <p className="text-gray-600 mb-4">{user?.college_name}</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {user?.role}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Member since</span>
                <span className="text-sm font-medium text-gray-900">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last login</span>
                <span className="text-sm font-medium text-gray-900">
                  {user?.last_login ? new Date(user.last_login).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total events</span>
                <span className="text-sm font-medium text-gray-900">
                  {user?.total_events || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('name', {
                        required: 'Full name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        }
                      })}
                      type="text"
                      disabled={!isEditing}
                      className={`form-input pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      disabled={!isEditing}
                      className={`form-input pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('phone', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Please enter a valid 10-digit phone number'
                        }
                      })}
                      type="tel"
                      disabled={!isEditing}
                      className={`form-input pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Student ID</label>
                  <input
                    {...register('student_id', {
                      required: 'Student ID is required',
                      minLength: {
                        value: 3,
                        message: 'Student ID must be at least 3 characters'
                      }
                    })}
                    type="text"
                    disabled={!isEditing}
                    className={`form-input ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                  {errors.student_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.student_id.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="form-label">College</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GraduationCap className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    {...register('college_id', {
                      required: 'Please select your college'
                    })}
                    disabled={!isEditing}
                    className={`form-select pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                  >
                    <option value="">Select your college</option>
                    {colleges.map((college) => (
                      <option key={college.id} value={college.id}>
                        {college.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.college_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.college_id.message}</p>
                )}
              </div>

              {/* Password Change Section */}
              {isEditing && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Current Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          {...register('currentPassword')}
                          type={showPassword ? 'text' : 'password'}
                          className="form-input pl-10 pr-10"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">New Password</label>
                      <input
                        {...register('newPassword', {
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          }
                        })}
                        type="password"
                        className="form-input"
                        placeholder="Enter new password"
                      />
                      {errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="loading mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
