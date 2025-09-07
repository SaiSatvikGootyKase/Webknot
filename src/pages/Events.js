import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Search, 
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Heart,
  Share2,
  Bookmark,
  Star,
  TrendingUp
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'title', 'registrations'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await api.post(`/registrations/${eventId}`);
      toast.success('Successfully registered for the event!');
      fetchEvents(); // Refresh events to update registration count
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register for event');
    }
  };

  const filteredAndSortedEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || event.category === filterType;
      const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'registrations':
          aValue = a.registered_count || 0;
          bValue = b.registered_count || 0;
          break;
        case 'date':
        default:
          aValue = new Date(a.event_date);
          bValue = new Date(b.event_date);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const EventCard = ({ event, isListView = false }) => (
    <div className={`card group hover:shadow-xl transition-all duration-300 ${isListView ? 'flex flex-row' : ''}`}>
      {!isListView && (
        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute top-4 right-4">
            <span className={`status-badge ${event.status === 'upcoming' ? 'success' : event.status === 'ongoing' ? 'info' : 'warning'}`}>
              {event.status}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">
                {format(new Date(event.event_date), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        </div>
      )}
      
      <div className={`card-body ${isListView ? 'flex-1' : ''}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {event.title}
              </h3>
              {event.is_featured && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
          </div>
          {isListView && (
            <span className={`status-badge ${event.status === 'upcoming' ? 'success' : event.status === 'ongoing' ? 'info' : 'warning'}`}>
              {event.status}
            </span>
          )}
        </div>

        <div className={`space-y-3 mb-6 ${isListView ? 'grid grid-cols-2 gap-4' : ''}`}>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {format(new Date(event.event_date), 'MMM dd, yyyy')}
              </p>
              <p className="text-xs text-gray-500">Event Date</p>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <Clock className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{event.start_time} - {event.end_time}</p>
              <p className="text-xs text-gray-500">Time</p>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <MapPin className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{event.location}</p>
              <p className="text-xs text-gray-500">Location</p>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <Users className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{event.registered_count || 0} registered</p>
              <p className="text-xs text-gray-500">Participants</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              {event.category}
            </span>
            <span className="text-sm text-gray-500">
              Capacity: {event.max_participants || 'Unlimited'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
              <Heart className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="btn btn-secondary btn-sm">
              <Eye className="w-4 h-4 mr-1" />
              View
            </button>
            {event.status === 'upcoming' && (
              <button 
                onClick={() => handleRegister(event.id)}
                className="btn btn-primary btn-sm"
              >
                Register
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Campus Events 🎉</h1>
              <p className="text-gray-600">Discover, explore, and register for exciting campus events</p>
            </div>
            <button className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters & Controls */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
              <p className="text-sm text-gray-500">Find events that match your interests</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-input"
            >
              <option value="all">All Categories</option>
              <option value="hackathon">Hackathon</option>
              <option value="workshop">Workshop</option>
              <option value="tech_talk">Tech Talk</option>
              <option value="fest">Fest</option>
              <option value="seminar">Seminar</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-input"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-input text-sm"
                >
                  <option value="date">Date</option>
                  <option value="title">Title</option>
                  <option value="registrations">Popularity</option>
                </select>
              </div>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-sm text-gray-500">
              {filteredAndSortedEvents.length} event{filteredAndSortedEvents.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </div>

      {/* Events Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedEvents.length > 0 ? (
            filteredAndSortedEvents.map((event) => (
              <EventCard key={event.id} event={event} isListView={false} />
            ))
          ) : (
            <div className="col-span-full">
              <div className="card">
                <div className="card-body text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No events found</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                      ? 'Try adjusting your search criteria or filters to find more events.'
                      : 'No events have been created yet. Be the first to create an exciting campus event!'
                    }
                  </p>
                  <button className="btn btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Event
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedEvents.length > 0 ? (
            filteredAndSortedEvents.map((event) => (
              <EventCard key={event.id} event={event} isListView={true} />
            ))
          ) : (
            <div className="card">
              <div className="card-body text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No events found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                    ? 'Try adjusting your search criteria or filters to find more events.'
                    : 'No events have been created yet. Be the first to create an exciting campus event!'
                  }
                </p>
                <button className="btn btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Event
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredAndSortedEvents.length > 0 && (
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {filteredAndSortedEvents.length} of {events.length} events
              </div>
              <div className="flex items-center space-x-2">
                <button className="btn btn-secondary btn-sm" disabled>
                  Previous
                </button>
                <span className="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg">Page 1 of 1</span>
                <button className="btn btn-secondary btn-sm" disabled>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
