import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowLeft,
  Share2,
  Heart,
  MessageCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data.data);
      
      // Check if user is registered
      try {
        await api.get(`/registrations/event/${id}`);
        setIsRegistered(true);
      } catch (error) {
        setIsRegistered(false);
      }
    } catch (error) {
      console.error('Failed to fetch event details:', error);
      toast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      await api.post(`/registrations/${id}`);
      setIsRegistered(true);
      toast.success('Successfully registered for the event!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register for event');
    }
  };

  const handleCancelRegistration = async () => {
    try {
      await api.delete(`/registrations/${id}`);
      setIsRegistered(false);
      toast.success('Registration cancelled successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel registration');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Event link copied to clipboard!');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Event not found</h3>
        <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
        <button 
          onClick={() => navigate('/events')}
          className="btn btn-primary"
        >
          Back to Events
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/events')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </button>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleLike}
            className={`p-2 rounded-lg transition-colors ${
              isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={handleShare}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Event Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{event.description}</p>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(event.status)}`}>
              {event.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(event.event_date), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-medium text-gray-900">
                  {event.start_time} - {event.end_time}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium text-gray-900">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Participants</p>
                <p className="font-medium text-gray-900">
                  {event.registered_count || 0} / {event.max_participants || '∞'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {event.status === 'upcoming' && (
              <>
                {isRegistered ? (
                  <button 
                    onClick={handleCancelRegistration}
                    className="btn btn-danger"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Registration
                  </button>
                ) : (
                  <button 
                    onClick={handleRegister}
                    className="btn btn-primary"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Register Now
                  </button>
                )}
              </>
            )}
            <button className="btn btn-outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask Question
            </button>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">About this Event</h3>
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed">
                {event.detailed_description || event.description}
              </p>
            </div>
          </div>

          {/* Requirements */}
          {event.requirements && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h3>
              <div className="space-y-2">
                {event.requirements.split('\n').map((requirement, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organizer */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Organizer</h3>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{event.organizer_name || 'Event Organizer'}</p>
                <p className="text-sm text-gray-600">{event.college_name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium text-gray-900 capitalize">{event.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium text-gray-900">{event.event_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Registration Deadline</p>
                <p className="font-medium text-gray-900">
                  {event.registration_deadline 
                    ? format(new Date(event.registration_deadline), 'MMM dd, yyyy')
                    : 'No deadline'
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fee</p>
                <p className="font-medium text-gray-900">
                  {event.fee ? `₹${event.fee}` : 'Free'}
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{event.contact_email || 'N/A'}</p>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium text-gray-900">{event.contact_phone || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
