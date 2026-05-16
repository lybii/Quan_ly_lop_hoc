import React, { useState, useEffect } from 'react';
import { Title } from '../../components/Title';
import { Profile } from '../../components/Profile';
import { SearchBox } from '../../components/Search_box';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

export const AddAssignment: React.FC = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: '',
    deadline: '',
  });

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const userResponse = await api.get(`/api/users/${userId}`);
        if (userResponse.data.success) {
          setUser(userResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setFormData((prev) => ({
        ...prev,
        file: fileName,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!classId) {
        throw new Error('Class ID is missing');
      }

      // Get current time for the assignment creation time
      const currentTime = new Date().toISOString();

      // Format deadline to ISO string if it's not already
      const deadlineDate = new Date(formData.deadline);
      const formattedDeadline = deadlineDate.toISOString();

      // Create assignment payload
      const assignmentData = {
        title: formData.title,
        description: formData.description,
        file: formData.file,
        time: currentTime,
        deadline: formattedDeadline,
        status: 1, // Default to "Đã giao"
        classId: parseInt(classId, 10),
      };

      // Send POST request to create assignment
      const response = await api.post('/api/assignments/add', assignmentData);

      console.log('Assignment created:', response.data);
      setSuccess(true);

      // Navigate back to assignment list after successful creation
      setTimeout(() => {
        navigate(`/lecturer/classroom/${classId}/assignment`);
      }, 1500);
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      setError(error.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Tạo bài tập mới" />
      <div className="-mt-8 flex justify-between">
        <SearchBox />
        <div className="flex">
          {user && (
            <Profile
              name={user.userName}
              role={user.role.name}
              image={user.avatar || '../../../src/assets/avatar.png'}
            />
          )}
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-white p-6 shadow-md">
        {success && (
          <div className="mb-4 rounded-md bg-green-100 p-4 text-green-700">
            Bài tập đã được tạo thành công!
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tiêu đề bài tập
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả bài tập
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hạn nộp
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tệp đính kèm
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
            {formData.file && (
              <p className="mt-2 text-sm text-gray-500">
                Tệp đã chọn: {formData.file}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() =>
                navigate(`/teacher/classroom/${classId}/assignment`)
              }
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Đang tạo...' : 'Tạo bài tập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
