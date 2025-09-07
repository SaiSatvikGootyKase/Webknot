import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Reports = () => {
  const [dashboardStats, setDashboardStats] = useState({});
  const [eventStats, setEventStats] = useState([]);
  const [studentStats, setStudentStats] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    fetchReportsData();
  }, [dateRange]);

  const fetchReportsData = async () => {
    try {
      const [dashboardResponse, eventsResponse, studentsResponse, topStudentsResponse] = await Promise.all([
        api.get('/reports/dashboard'),
        api.get('/reports/events'),
        api.get('/reports/students'),
        api.get('/reports/top-students')
      ]);

      setDashboardStats(dashboardResponse.data.data);
      setEventStats(eventsResponse.data.data || []);
      setStudentStats(studentsResponse.data.data || []);
      setTopStudents(topStudentsResponse.data.data || []);
    } catch (error) {
      console.error('Failed to fetch reports data:', error);
      toast.error('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const handleExport = () => {
    toast.success('Export feature coming soon!');
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
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into event performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="form-select"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button 
            onClick={fetchReportsData}
            className="btn btn-outline btn-sm"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </button>
          <button 
            onClick={handleExport}
            className="btn btn-primary btn-sm"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Events"
          value={dashboardStats.totalEvents || 0}
          icon={Calendar}
          color="bg-blue-500"
          change="+12% from last month"
        />
        <StatCard
          title="Total Registrations"
          value={dashboardStats.totalRegistrations || 0}
          icon={Users}
          color="bg-green-500"
          change="+8% from last month"
        />
        <StatCard
          title="Attendance Rate"
          value={`${dashboardStats.attendanceRate || 0}%`}
          icon={BarChart3}
          color="bg-purple-500"
          change="+5% from last month"
        />
        <StatCard
          title="Active Students"
          value={dashboardStats.activeStudents || 0}
          icon={TrendingUp}
          color="bg-orange-500"
          change="+15% from last month"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Types Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Event Types Distribution</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={eventStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {eventStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Registration Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Registration Trends</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={eventStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="registrations" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Event Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Event Performance</h3>
          <Filter className="w-5 h-5 text-gray-400" />
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={eventStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="registrations" fill="#3b82f6" name="Registrations" />
            <Bar yAxisId="right" dataKey="attendance" fill="#10b981" name="Attendance" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Students */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Active Students</h3>
          <p className="text-sm text-gray-600">Students with highest participation</p>
        </div>
        <div className="p-6">
          {topStudents.length > 0 ? (
            <div className="space-y-4">
              {topStudents.map((student, index) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-600">{student.college_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{student.total_events} events</p>
                    <p className="text-sm text-gray-600">{student.total_registrations} registrations</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
              <p className="text-gray-600">Student participation data will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-xl p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-800">Most Popular Event Type</p>
              <p className="text-lg font-semibold text-blue-900">
                {eventStats.length > 0 ? eventStats[0]?.name || 'N/A' : 'N/A'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-xl p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-800">Average Attendance</p>
              <p className="text-lg font-semibold text-green-900">
                {dashboardStats.attendanceRate || 0}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-xl p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-purple-800">Total Participants</p>
              <p className="text-lg font-semibold text-purple-900">
                {dashboardStats.totalRegistrations || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
