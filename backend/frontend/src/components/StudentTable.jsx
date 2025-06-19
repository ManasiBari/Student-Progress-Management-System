import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentFormModal from './StudentFormModal';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);


  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to fetch students', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      fetchStudents();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingStudent(null);
    setModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingStudent) {
        await axios.put(`http://localhost:5000/api/students/${editingStudent._id}`, data);
      } else {
        await axios.post('http://localhost:5000/api/students', data);
      }
      fetchStudents();
      setModalOpen(false);
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  const downloadCSV = () => {
    window.open('http://localhost:5000/api/export/students', '_blank');
  };

  return (
    <div className="p-4 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="text-xl sm:text-2xl font-semibold">Student List</h2>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base"
          >
            Add Student
          </button>
          <button
            onClick={downloadCSV}
            className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm sm:text-base"
          >
            Download CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white border border-gray-200 rounded">
          <thead>
            <tr className="bg-gray-100 text-xs sm:text-sm">
              <th className="py-2 px-2 sm:px-4 border">Name</th>
              <th className="py-2 px-2 sm:px-4 border">Email</th>
              <th className="py-2 px-2 sm:px-4 border">Phone</th>
              <th className="py-2 px-2 sm:px-4 border">CF Handle</th>
              <th className="py-2 px-2 sm:px-4 border">Current Rating</th>
              <th className="py-2 px-2 sm:px-4 border">Max Rating</th>
              <th className="py-2 px-2 sm:px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="border-t">
                <td className="py-2 px-2 sm:px-4 border break-words">{student.name}</td>
                <td className="py-2 px-2 sm:px-4 border break-words">{student.email}</td>
                <td className="py-2 px-2 sm:px-4 border">{student.phone}</td>
                <td className="py-2 px-2 sm:px-4 border">{student.cfHandle}</td>
                <td className="py-2 px-2 sm:px-4 border">{student.currentRating}</td>
                <td className="py-2 px-2 sm:px-4 border">{student.maxRating}</td>
                <td className="py-2 px-2 sm:px-4 border">
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                    <button
                      className="text-blue-500 hover:underline text-xs sm:text-sm"
                      onClick={() => handleEdit(student)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:underline text-xs sm:text-sm"
                      onClick={() => handleDelete(student._id)}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => window.location.href = `/student/${student._id}`}
                      className="text-indigo-500 hover:underline text-xs sm:text-sm"
                    >
                      More
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <StudentFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingStudent}
      />
    </div>
  );
};

export default StudentTable;





