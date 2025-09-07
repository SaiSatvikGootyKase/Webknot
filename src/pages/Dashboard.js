import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  TrendingUp,
  Clock,
  Star,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Plus,
  Filter,
  Download
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    totalAttendance: 0,
    upcomingEvents: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, eventsResponse, chartResponse] = await Promise.all([
        api.get('/reports/dashboard'),
        api.get('/events?limit=5'),
        api.get('/reports/event-types')
      ]);

      setStats(statsResponse.data.data);
      setRecentEvents(eventsResponse.data.data.events || []);
      setChartData(chartResponse.data.data || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const StatCard = ({ title, value, icon: Icon, color, change, trend, subtitle }) => (
    <div className="card animate-slide-in-left">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {change && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {change}
            </div>
          )}
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
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
      {/* Welcome Section */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back! 👋</h1>
              <p className="text-gray-600">Here's what's happening with your campus events today.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="text-sm font-medium text-gray-900">{new Date().toLocaleTimeString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon={Calendar}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          change="+12%"
          trend="up"
          subtitle="This month"
        />
        <StatCard
          title="Registrations"
          value={stats.totalRegistrations}
          icon={Users}
          color="bg-gradient-to-br from-green-500 to-green-600"
          change="+8%"
          trend="up"
          subtitle="Active participants"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate || 0}%`}
          icon={CheckCircle}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          change="+5%"
          trend="up"
          subtitle="Average turnout"
        />
        <StatCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          icon={Activity}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
          change="+3"
          trend="up"
          subtitle="Next 7 days"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Types Chart */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Event Types</h3>
                <p className="text-sm text-gray-500">Distribution of event categories</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                  <Download className="w-4 h-4" />
                </button>
                <div className="p-2 rounded-lg bg-blue-100">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="count" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Registration Trends */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Registration Trends</h3>
                <p className="text-sm text-gray-500">Monthly registration patterns</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                  <Filter className="w-4 h-4" />
                </button>
                <div className="p-2 rounded-lg bg-green-100">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="registrations" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fill="url(#areaGradient)"
                />
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
              <p className="text-sm text-gray-500">Latest campus events and activities</p>
            </div>
            <button className="btn btn-primary btn-sm">
              <Eye className="w-4 h-4" />
              View all
            </button>
          </div>
        </div>
        <div className="card-body">
          {recentEvents.length > 0 ? (
            <div className="space-y-4">
              {recentEvents.map((event, index) => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-1">{event.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(event.event_date).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          📍 {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="status-badge success">
                      {event.status}
                    </span>
                    <div className="flex items-center text-sm text-gray-500 bg-white px-2 py-1 rounded-lg">
                      <Users className="w-4 h-4 mr-1" />
                      {event.registered_count || 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No events yet</h3>
              <p className="text-gray-600 mb-6">Events will appear here once they are created.</p>
              <button className="btn btn-primary">
                <Plus className="w-4 h-4" />
                Create First Event
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <p className="text-sm text-gray-500">Common tasks and shortcuts</p>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="group flex items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <span className="font-semibold text-blue-900 block">Create Event</span>
                <span className="text-sm text-blue-700">Set up new campus event</span>
              </div>
            </button>
            <button className="group flex items-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <span className="font-semibold text-green-900 block">View Registrations</span>
                <span className="text-sm text-green-700">Manage participant lists</span>
              </div>
            </button>
            <button className="group flex items-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <span className="font-semibold text-purple-900 block">Generate Report</span>
                <span className="text-sm text-purple-700">Export analytics data</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
