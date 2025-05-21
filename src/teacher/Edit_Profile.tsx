import React, { useEffect, useRef, useState } from 'react';
import { Title } from '../components/Title';
import { SearchBox } from '../components/Search_box';
import { Profile } from '../components/Profile';
import api from '../api/axiosConfig';


interface UserData {
  id: number;
  userName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  avatar: string;
  code: string;
  major: string;
  status: number;
  role: {
    id: number;
    name: string;
  };
}

export const EditProfile: React.FC = () => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Cloudinary configuration - simple unsigned upload
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/ddehaxisw/image/upload';
  const CLOUDINARY_UPLOAD_PRESET = 'quanlylophoc';
  const CLOUDINARY_NAME = 'ddehaxisw'; // this should be an unsigned upload preset

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('Không tìm thấy thông tin người dùng');
          setLoading(false);
          return;
        }
        
        const response = await api.get(`/api/users/${userId}`);
        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          setError('Không thể tải thông tin người dùng');
        }
      } catch (error: any) {
        setError(error.message || 'Có lỗi xảy ra khi tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!isDisabled && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isDisabled]);

  const handleEditClick = () => {
    setIsDisabled(false);
  };

  const handleSaveClick = async () => {
    if (!userData) return;
    
    try {
      setLoading(true);
      const response = await api.put(`/api/users/${userData.id}`, {
        userName: userData.userName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        dateOfBirth: userData.dateOfBirth,
      });
      
      if (response.data.success) {
        alert('Thông tin cá nhân đã được cập nhật thành công!');
        setUserData(response.data.data);
      } else {
        throw new Error('Không thể cập nhật thông tin cá nhân');
      }
      
      setIsDisabled(true);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      alert('Có lỗi khi cập nhật thông tin: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const uploadAvatar = async () => {
    if (!selectedFile || !userData) return;

    try {
      setUploading(true);
      console.log('Starting upload to Cloudinary...');

      // Create form data for upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', CLOUDINARY_NAME);
      
      // Upload to Cloudinary using unsigned upload
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data);
      
      if (data && data.secure_url) {
        const imageUrl = data.secure_url;
        console.log('Image uploaded successfully:', imageUrl);
        
        // Update user avatar in backend
        console.log('Updating avatar in backend...');
        const avatarResponse = await api.put(`/api/users/${userData.id}/avatar`, {
          avatar: imageUrl
        });

        if (avatarResponse.data.success) {
          // Update local state
          setUserData({
            ...userData,
            avatar: imageUrl
          });
          alert('Avatar đã được cập nhật thành công!');
        } else {
          throw new Error('Không thể cập nhật avatar');
        }
      } else {
        throw new Error('Không nhận được URL từ Cloudinary');
      }
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      alert('Có lỗi khi cập nhật avatar: ' + (error.message || 'Unknown error'));
    } finally {
      setUploading(false);
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  };

  if (loading) {
    return <div>Đang tải thông tin...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Thông tin cá nhân" />
      <div className="-mt-8 flex justify-between">
        <SearchBox onSearch={() => {}} />
        <div className="flex">
          {userData && (
            <Profile
              name={userData.userName}
              role={userData.role.name}
              image={userData.avatar || '../../src/assets/avatar.png'}
            />
          )}
        </div>
      </div>

      <div className="-mt-8 grid h-auto w-auto rounded-2xl bg-white p-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-6">
        <div className="col-span-4 flex flex-col">
          <div className="flex justify-between">
            <h1 className="flex text-xl font-bold">Thông tin cá nhân</h1>
            <button
              className="h-[50px] w-[110px] rounded-xl border border-gray-600"
              onClick={handleEditClick}
            >
              Chỉnh sửa
            </button>
          </div>
          <div className="">
            <h1 className="mt-5 text-base font-bold">Họ và tên</h1>
            <input
              type="text"
              disabled={isDisabled}
              className="h-[50px] w-full rounded-xl border border-gray-600 px-3 text-xl"
              id="fullname"
              ref={nameInputRef}
              value={userData?.userName || ''}
              onChange={(e) => setUserData(userData ? {...userData, userName: e.target.value} : null)}
            />
          </div>
          <div className="">
            <h1 className="mt-5 text-base font-bold">Mã sinh viên</h1>
            <input
              type="text"
              disabled={true} // Mã sinh viên không nên thay đổi
              className="h-[50px] w-full rounded-xl border border-gray-600 px-3 text-xl"
              value={userData?.code || ''}
            />
          </div>
          <div className="">
            <h1 className="mt-5 text-base font-bold">Ngày sinh</h1>
            <input
              type="date"
              disabled={isDisabled}
              className="h-[50px] w-full rounded-xl border border-gray-600 px-3 text-xl"
              value={userData?.dateOfBirth || ''}
              onChange={(e) => setUserData(userData ? {...userData, dateOfBirth: e.target.value} : null)}
            />
          </div>
          <div className="">
            <h1 className="mt-5 text-base font-bold">Email</h1>
            <input
              type="email"
              disabled={isDisabled}
              className="h-[50px] w-full rounded-xl border border-gray-600 px-3 text-xl"
              value={userData?.email || ''}
              onChange={(e) => setUserData(userData ? {...userData, email: e.target.value} : null)}
            />
          </div>
          <div className="">
            <h1 className="mt-5 text-base font-bold">Số điện thoại</h1>
            <input
              type="text"
              disabled={isDisabled}
              className="h-[50px] w-full rounded-xl border border-gray-600 px-3 text-xl"
              value={userData?.phoneNumber || ''}
              onChange={(e) => setUserData(userData ? {...userData, phoneNumber: e.target.value} : null)}
            />
          </div>
        </div>
        <div className="col-span-2 flex flex-col items-center justify-center">
          <div className="flex h-auto w-full flex-col items-center justify-center">
            {/* Hidden file input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              accept="image/*" 
              className="hidden"
            />
            
            {/* Avatar display */}
            <img
              src={previewUrl || userData?.avatar || '../../src/assets/avatar.png'}
              alt="Profile"
              className="h-[200px] w-[200px] rounded-full object-cover cursor-pointer"
              onClick={handleAvatarClick}
            />
            
            {/* Upload button */}
            <button 
              className="mt-5 h-[50px] w-[200px] rounded-xl border border-gray-600 disabled:opacity-50"
              onClick={selectedFile ? uploadAvatar : handleAvatarClick}
              disabled={uploading}
            >
              {uploading ? 'Đang tải lên...' : selectedFile ? 'Xác nhận hình ảnh' : 'Thay đổi ảnh đại diện'}
            </button>
          </div>
          <div className="flex h-full w-full items-end justify-around">
            <button className="mt-5 h-[50px] w-[180px] rounded-xl border border-gray-600 bg-red-600 text-white">
              Xóa tài khoản
            </button>
            <button
              className="mt-5 h-[50px] w-[180px] rounded-xl border border-gray-600 bg-blue-600 text-white"
              onClick={handleSaveClick}
              disabled={isDisabled}
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
