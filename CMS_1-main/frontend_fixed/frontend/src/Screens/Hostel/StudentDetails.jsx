import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import axiosWrapper from '../../utils/AxiosWrapper';

const StudentHostelDetails = () => {
  const [hostelData, setHostelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        const response = await axiosWrapper.get('/hostel/student/hostel-details', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        });

        if (response.data.success) {
          setHostelData(response.data.data);
        } else {
          setError('Could not fetch hostel details');
        }
      } catch (err) {
        console.error('Hostel details error:', err);
        setError(err.response?.data?.message || 'Error fetching hostel details');
        toast.error(err.response?.data?.message || 'Error fetching hostel details');
      } finally {
        setLoading(false);
      }
    };

    fetchHostelDetails();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
      <p className="text-red-600">{error}</p>
    </div>
  );

  if (!hostelData) return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
      <p className="text-yellow-600">No hostel details found</p>
    </div>
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Hostel Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Hostel Information</h3>
          <div className="space-y-3">
            <p>
              <span className="font-medium text-gray-600">Hostel Name:</span>{' '}
              <span className="text-gray-800">{hostelData.hostelName}</span>
            </p>
            <p>
              <span className="font-medium text-gray-600">Room Number:</span>{' '}
              <span className="text-gray-800">{hostelData.roomNumber}</span>
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Warden Details</h3>
          <div className="space-y-3">
            <p>
              <span className="font-medium text-gray-600">Warden:</span>{' '}
              <span className="text-gray-800">{hostelData.warden}</span>
            </p>
            <p>
              <span className="font-medium text-gray-600">Status:</span>{' '}
              <span className="text-gray-800">{hostelData.status}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHostelDetails;