import React from 'react';
import { useSelector } from 'react-redux';
import { FaUsers, FaChalkboardTeacher, FaBook, FaCodeBranch } from 'react-icons/fa';

const DashboardCard = ({ title, count, icon: Icon, bgColor }) => (
  <div className={`p-6 rounded-lg shadow-lg ${bgColor} text-white`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium opacity-75">Total</p>
        <h3 className="text-2xl font-bold mt-1">{title}</h3>
        <p className="text-3xl font-bold mt-2">{count}</p>
      </div>
      <div className="text-4xl opacity-75">
        <Icon />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = React.useState({
    students: 0,
    faculty: 0,
    subjects: 0,
    branches: 0,
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        // You would typically fetch this from your API
        // For now using placeholder data
        setStats({
          students: 150,
          faculty: 45,
          subjects: 32,
          branches: 8,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const dashboardCards = [
    {
      title: 'Students',
      count: stats.students,
      icon: FaUsers,
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Faculty',
      count: stats.faculty,
      icon: FaChalkboardTeacher,
      bgColor: 'bg-green-500',
    },
    {
      title: 'Subjects',
      count: stats.subjects,
      icon: FaBook,
      bgColor: 'bg-purple-500',
    },
    {
      title: 'Branches',
      count: stats.branches,
      icon: FaCodeBranch,
      bgColor: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.name || 'User'}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>

      {/* You can add more sections here like recent notices, upcoming exams, etc. */}
    </div>
  );
};

export default Dashboard;
