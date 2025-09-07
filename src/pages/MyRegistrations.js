import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle,
  XCircle,
  Eye,
  Star
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await api.get('/registrations/my-registrations');
      setRegistrations(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (eventId) => {
    try {
      await api.delete(`/registrations/${eventId}`);
      toast.success('Registration cancelled successfully!');
      fetchRegistrations(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel registration');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Registrations</h1>
          <p className="text-gray-600">Manage your event registrations</p>
        </div>
        <div className="text-sm text-gray-500">
          {registrations.length} registered events
        </div>
      </div>

      {/* Registrations List */}
      {registrations.length > 0 ? (
        <div className="space-y-4">
          {registrations.map((registration) => (
            <div key={registration.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{registration.event.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(registration.event.status)}`}>
                      {registration.event.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{registration.event.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(registration.event.event_date), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {registration.event.start_time} - {registration.event.end_time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {registration.event.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        Registered: {format(new Date(registration.registration_date), 'MMM dd, yyyy')}
                      </span>
                      <span className="text-sm text-gray-500">
                        Category: {registration.event.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="btn btn-outline btn-sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                      {registration.event.status === 'upcoming' && (
                        <button 
                          onClick={() => handleCancelRegistration(registration.event.id)}
                          className="btn btn-danger btn-sm"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations yet</h3>
          <p className="text-gray-600 mb-6">You haven't registered for any events yet.</p>
          <button className="btn btn-primary">
            Browse Events
          </button>
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
