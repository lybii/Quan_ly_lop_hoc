import React, { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'User' | 'Admin';
}

interface TitleProps {
  title: string;
}

const Title: React.FC<TitleProps> = ({ title }) => (
  <h1 className="mb-4 text-3xl font-bold">{title}</h1>
);

interface SearchBoxProps {
  onSearch: (term: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => (
  <input
    type="text"
    placeholder="Tìm kiếm người dùng..."
    className="w-64 rounded-lg border-2 border-gray-300 p-2"
    onChange={(e) => onSearch(e.target.value)}
  />
);

interface UserRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onEdit, onDelete }) => (
  <div className="flex items-center justify-between border-b p-4">
    <div>
      <p className="font-bold">{user.name}</p>
      <p className="text-gray-600">{user.email}</p>
      <p className="text-sm text-gray-500">{user.role}</p>
    </div>
    <div className="flex gap-2">
      <button
        onClick={() => onEdit(user)}
        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Sửa
      </button>
      <button
        onClick={() => onDelete(user.id)}
        className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        Xóa
      </button>
    </div>
  </div>
);

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Nguyen Van A', email: 'a@example.com', role: 'Admin' },
    { id: 2, name: 'Tran Thi B', email: 'b@example.com', role: 'User' },
    { id: 3, name: 'Le Van C', email: 'c@example.com', role: 'User' },
  ]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<{
    name: string;
    email: string;
    role: 'User' | 'Admin';
  }>({
    name: '',
    email: '',
    role: 'User',
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      setUsers([...users, { id: users.length + 1, ...newUser }]);
      setNewUser({ name: '', email: '', role: 'User' });
      setIsAdding(false);
    }
  };

  const handleEdit = (user: User) => {
    alert(`Editing user: ${user.name}`);
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Quản lý tài khoản" />
      <div className="mb-4 flex justify-between">
        <SearchBox onSearch={handleSearch} />
        <div className="flex justify-end">
          <button
            onClick={() => setIsAdding(true)}
            className="mr-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Tải file excel
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Thêm người dùng
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="mb-4 rounded-2xl bg-white p-4 shadow-lg">
          <h2 className="mb-2 text-xl font-bold">Thêm người dùng mới</h2>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Tên"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="rounded-lg border-2 border-gray-300 p-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="rounded-lg border-2 border-gray-300 p-2"
            />
            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  role: e.target.value as 'User' | 'Admin',
                })
              }
              className="rounded-lg border-2 border-gray-300 p-2"
            >
              <option value="Sinh viên">Sinh viên</option>
              <option value="Giảng viên">Giảng viên</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleAddUser}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Lưu
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="rounded-lg bg-gray-300 px-4 py-2 hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-lg">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="p-4 text-gray-500">Không tìm thấy người dùng</p>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
