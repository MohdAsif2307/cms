const studentDetails = require('../models/details/student-details.model');
const ApiResponse = require('../utils/ApiResponse');

const getStudentHostelDetailsController = async (req, res) => {
  try {
    const student = await studentDetails.findById(req.user.userId);
    if (!student) {
      return ApiResponse.notFound('Student not found').send(res);
    }

    if (!student.hostelStudentId) {
      return ApiResponse.notFound('No hostel details found').send(res);
    }

    // Fetch hostel details from HMS
    const hmsApi = process.env.HMS_API_URL || 'http://localhost:5001';
    const resp = await fetch(`${hmsApi}/api/hostel/student/${student.hostelStudentId}`, {
      headers: {
        'Authorization': `Bearer ${req.headers.authorization?.split(' ')[1] || ''}`,
      }
    });

    if (!resp.ok) {
      return ApiResponse.notFound('Could not fetch hostel details').send(res);
    }

    const hostelData = await resp.json();
    return ApiResponse.success(hostelData, 'Hostel details retrieved').send(res);
  } catch (error) {
    console.error('Get hostel details error:', error);
    return ApiResponse.internalServerError().send(res);
  }
};

module.exports = {
  getStudentHostelDetailsController
};