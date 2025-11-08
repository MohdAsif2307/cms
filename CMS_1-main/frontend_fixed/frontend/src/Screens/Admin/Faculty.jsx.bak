import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import axiosWrapper from "../../utils/AxiosWrapper";
import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import CustomButton from "../../components/CustomButton";
import Loading from "../../components/Loading";

const Faculty = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    gender: "",
    dob: "",
    designation: "",
    joiningDate: "",
    salary: "",
    status: "active",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    bloodGroup: "",
    branchId: "",
  });

  const [branch, setBranches] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const userToken = localStorage.getItem("userToken");
  const [file, setFile] = useState(null);
  const [dataLoading, setDataLoading] = useState(null);

  useEffect(() => {
    getFacultyHandler();
    getBranchHandler();
  }, []);

  const getBranchHandler = async () => {
    try {
      setDataLoading(true);
      const response = await axiosWrapper.get(`/branch`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) setBranches(response.data.data);
      else toast.error(response.data.message);
    } catch (error) {
      if (error.response?.status === 404) setBranches([]);
      else
        toast.error(error.response?.data?.message || "Error fetching branches");
    } finally {
      setDataLoading(false);
    }
  };

  const getFacultyHandler = async () => {
    try {
      toast.loading("Loading faculty...");
      const response = await axiosWrapper.get(`/faculty`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) setFaculty(response.data.data);
      else toast.error(response.data.message);
    } catch (error) {
      if (error.response?.status === 404) setFaculty([]);
      else
        toast.error(error.response?.data?.message || "Error fetching faculty");
    } finally {
      toast.dismiss();
    }
  };

  const addFacultyHandler = async () => {
    try {
      toast.loading(isEditing ? "Updating Faculty" : "Adding Faculty");
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userToken}`,
      };
      const formData = new FormData();
      for (const key in data) {
        if (key === "emergencyContact") {
          for (const subKey in data.emergencyContact) {
            formData.append(
              `emergencyContact[${subKey}]`,
              data.emergencyContact[subKey],
            );
          }
        } else {
          formData.append(key, data[key]);
        }
      }
      if (file) formData.append("file", file);

      let response;
      if (isEditing)
        response = await axiosWrapper.patch(
          `/faculty/${selectedFacultyId}`,
          formData,
          { headers },
        );
      else
        response = await axiosWrapper.post(`/faculty/register`, formData, {
          headers,
        });

      toast.dismiss();
      if (response.data.success) {
        toast.success(
          isEditing
            ? "Faculty updated!"
            : "Faculty added! Default password: faculty123",
        );
        resetForm();
        getFacultyHandler();
      } else toast.error(response.data.message);
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error");
    }
  };

  const deleteFacultyHandler = (id) => {
    setIsDeleteConfirmOpen(true);
    setSelectedFacultyId(id);
  };

  const confirmDelete = async () => {
    try {
      toast.loading("Deleting Faculty");
      const response = await axiosWrapper.delete(
        `/faculty/${selectedFacultyId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
      toast.dismiss();
      if (response.data.success) {
        toast.success("Faculty deleted successfully");
        setIsDeleteConfirmOpen(false);
        getFacultyHandler();
      } else toast.error(response.data.message);
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error");
    }
  };

  const editFacultyHandler = (faculty) => {
    setData({
      firstName: faculty.firstName || "",
      lastName: faculty.lastName || "",
      email: faculty.email || "",
      phone: faculty.phone || "",
      profile: faculty.profile || "",
      address: faculty.address || "",
      city: faculty.city || "",
      state: faculty.state || "",
      pincode: faculty.pincode || "",
      country: faculty.country || "",
      gender: faculty.gender || "",
      dob: faculty.dob?.split("T")[0] || "",
      designation: faculty.designation || "",
      joiningDate: faculty.joiningDate?.split("T")[0] || "",
      salary: faculty.salary || "",
      status: faculty.status || "active",
      emergencyContact: faculty.emergencyContact || {
        name: "",
        relationship: "",
        phone: "",
      },
      bloodGroup: faculty.bloodGroup || "",
      branchId: faculty.branchId || "",
    });
    setSelectedFacultyId(faculty._id);
    setIsEditing(true);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      profile: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      gender: "",
      dob: "",
      designation: "",
      joiningDate: "",
      salary: "",
      status: "active",
      emergencyContact: { name: "", relationship: "", phone: "" },
      bloodGroup: "",
      branchId: "",
    });
    setShowAddForm(false);
    setIsEditing(false);
    setSelectedFacultyId(null);
  };

  const handleInputChange = (field, value) => {
    setData({ ...data, [field]: value });
  };
  const handleEmergencyContactChange = (field, value) => {
    setData({
      ...data,
      emergencyContact: { ...data.emergencyContact, [field]: value },
    });
  };

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10 relative">
      <div className="flex justify-between items-center w-full">
        <Heading title="Faculty Management" />
        <CustomButton
          onClick={() => (showAddForm ? resetForm() : setShowAddForm(true))}
        >
          <IoMdAdd className="text-2xl" />
        </CustomButton>
      </div>

      {dataLoading && <Loading />}

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={resetForm}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <IoMdClose className="text-2xl" />
            </button>
            <h2 className="text-2xl font-semibold mb-6">
              {isEditing ? "Edit Faculty" : "Add New Faculty"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addFacultyHandler();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ... All other inputs unchanged ... */}

                {/* ✅ Designation Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation
                  </label>
                  <select
                    value={data.designation}
                    onChange={(e) =>
                      handleInputChange("designation", e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Designation</option>
                    <option value="Principal">Principal</option>
                    <option value="Vice Principal">Vice Principal</option>
                    <option value="Head of Department (HOD)">
                      Head of Department (HOD)
                    </option>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">
                      Associate Professor
                    </option>
                    <option value="Assistant Professor">
                      Assistant Professor
                    </option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Lab Assistant">Lab Assistant</option>
                    <option value="Office Administrator">
                      Office Administrator
                    </option>
                    <option value="Librarian">Librarian</option>
                    <option value="Hostel Administrator">
                      Hostel Administrator
                    </option>
                  </select>
                </div>

                {/* ... rest unchanged ... */}
              </div>

              <div className="mt-8 flex justify-between items-center gap-4">
                <p className="text-sm">
                  Default password will be{" "}
                  <span className="font-bold">faculty123</span>
                </p>
                <div className="flex gap-4">
                  <CustomButton
                    type="button"
                    variant="secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </CustomButton>
                  <CustomButton type="submit" variant="primary">
                    {isEditing ? "Update Faculty" : "Add Faculty"}
                  </CustomButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {!dataLoading && !showAddForm && (
        <div className="mt-8 w-full">
          <table className="text-sm min-w-full bg-white">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="py-4 px-6 text-left font-semibold">Name</th>
                <th className="py-4 px-6 text-left font-semibold">Email</th>
                <th className="py-4 px-6 text-left font-semibold">Phone</th>
                <th className="py-4 px-6 text-left font-semibold">
                  Employee ID
                </th>
                <th className="py-4 px-6 text-left font-semibold">
                  Designation
                </th>
                <th className="py-4 px-6 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculty && faculty.length > 0 ? (
                faculty.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-blue-50">
                    <td className="py-4 px-6">{`${item.firstName} ${item.lastName}`}</td>
                    <td className="py-4 px-6">{item.email}</td>
                    <td className="py-4 px-6">{item.phone}</td>
                    <td className="py-4 px-6">{item.employeeId}</td>
                    <td className="py-4 px-6">{item.designation}</td>
                    <td className="py-4 px-6 text-center flex justify-center gap-4">
                      <CustomButton
                        variant="secondary"
                        className="!p-2"
                        onClick={() => editFacultyHandler(item)}
                      >
                        <MdEdit />
                      </CustomButton>
                      <CustomButton
                        variant="danger"
                        className="!p-2"
                        onClick={() => deleteFacultyHandler(item._id)}
                      >
                        <MdOutlineDelete />
                      </CustomButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-base pt-10">
                    No Faculty found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this faculty?"
      />
    </div>
  );
};

export default Faculty;
