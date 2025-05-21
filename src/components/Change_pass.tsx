import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api/axiosConfig';

// Regex patterns cho việc kiểm tra độ mạnh mật khẩu
const atLeastOneUppercase = /[A-Z]/g;
const atLeastOneLowercase = /[a-z]/g;
const atLeastOneNumeric = /[0-9]/g;
const atLeastOneSpecialChar = /[#?!@$%^&*-]/g;
const eightCharsOrMore = /.{8,}/g;

interface PasswordStrength {
  uppercase: RegExpMatchArray | null;
  lowercase: RegExpMatchArray | null;
  number: RegExpMatchArray | null;
  specialChar: RegExpMatchArray | null;
  eightCharsOrGreater: RegExpMatchArray | null;
}

export const ChangePassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    uppercase: null,
    lowercase: null,
    number: null,
    specialChar: null,
    eightCharsOrGreater: null
  });

  // Kiểm tra độ mạnh mật khẩu khi người dùng nhập
  useEffect(() => {
    if (newPassword) {
      setPasswordStrength({
        uppercase: newPassword.match(atLeastOneUppercase),
        lowercase: newPassword.match(atLeastOneLowercase),
        number: newPassword.match(atLeastOneNumeric),
        specialChar: newPassword.match(atLeastOneSpecialChar),
        eightCharsOrGreater: newPassword.match(eightCharsOrMore)
      });
    }
  }, [newPassword]);

  // Tính toán điểm mạnh mật khẩu
  const calculatePasswordStrengthScore = () => {
    let score = 0;
    if (passwordStrength.uppercase) score += 1;
    if (passwordStrength.lowercase) score += 1;
    if (passwordStrength.number) score += 1;
    if (passwordStrength.specialChar) score += 1;
    if (passwordStrength.eightCharsOrGreater) score += 1;
    return score;
  };

  // Kiểm tra xem mật khẩu mới có đủ mạnh không
  const isPasswordStrong = () => {
    return passwordStrength.uppercase &&
      passwordStrength.lowercase &&
      passwordStrength.number &&
      passwordStrength.specialChar &&
      passwordStrength.eightCharsOrGreater;
  };

  // Xử lý khi submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Mật khẩu mới và xác nhận mật khẩu không khớp', type: 'error' });
      return;
    }

    // Kiểm tra độ mạnh mật khẩu
    if (!isPasswordStrong()) {
      setMessage({ 
        text: 'Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt', 
        type: 'error' 
      });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      
      // Lấy userId từ localStorage hoặc từ context state management
      const userId = localStorage.getItem('userId');
      
      // Lấy token từ localStorage hoặc từ context state management
      const token = localStorage.getItem('token');
      
      if (!userId || !token) {
        setMessage({ text: 'Bạn cần đăng nhập để thực hiện thao tác này', type: 'error' });
        setLoading(false);
        return;
      }

      // Gọi API để thay đổi mật khẩu
      const response = await api.put(
        `/api/users/${userId}/password`,
        {
            "oldPassword": oldPassword,
            "newPassword": newPassword
        }
      );

      if (response.status === 200) {
        setMessage({ text: 'Đổi mật khẩu thành công!', type: 'success' });
        // Reset form
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setMessage({ text: 'Mật khẩu cũ không đúng', type: 'error' });
      } else {
        setMessage({ 
          text: error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu', 
          type: 'error' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Render thông báo độ mạnh mật khẩu
  const renderPasswordStrengthMessage = () => {
    const score = calculatePasswordStrengthScore();
    
    let message = '';
    let color = '';
    
    if (score === 0) {
      message = 'Rất yếu';
      color = '#ff4d4d';
    } else if (score <= 2) {
      message = 'Yếu';
      color = '#ffa64d';
    } else if (score <= 4) {
      message = 'Trung bình';
      color = '#ffff4d';
    } else {
      message = 'Mạnh';
      color = '#4dff4d';
    }
    
    return (
      <div className="password-strength">
        <div className="strength-meter">
          <div 
            className="strength-meter-fill" 
            style={{ 
              width: `${score * 20}%`,
              backgroundColor: color
            }}
          ></div>
        </div>
        <div className="strength-text" style={{ color }}>
          {message}
        </div>
      </div>
    );
  };

  return (
    <div className="change-password-wrapper">
      <div className="change-password-container">
        <h2 className="title">Đổi mật khẩu</h2>
        
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="oldPassword">Mật khẩu hiện tại</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">Mật khẩu mới</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            {newPassword && renderPasswordStrengthMessage()}
            
            {newPassword && (
              <div className="password-requirements">
                <p>Mật khẩu phải có:</p>
                <ul>
                  <li className={passwordStrength.eightCharsOrGreater ? 'valid' : 'invalid'}>
                    Ít nhất 8 ký tự
                  </li>
                  <li className={passwordStrength.uppercase ? 'valid' : 'invalid'}>
                    Ít nhất 1 chữ hoa
                  </li>
                  <li className={passwordStrength.lowercase ? 'valid' : 'invalid'}>
                    Ít nhất 1 chữ thường
                  </li>
                  <li className={passwordStrength.number ? 'valid' : 'invalid'}>
                    Ít nhất 1 số
                  </li>
                  <li className={passwordStrength.specialChar ? 'valid' : 'invalid'}>
                    Ít nhất 1 ký tự đặc biệt (#?!@$%^&*-)
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="error-message">Mật khẩu xác nhận không khớp</p>
            )}
          </div>
          
          <button 
            type="submit" 
            className="submit-button" 
            disabled={loading || !oldPassword || !newPassword || !confirmPassword || !isPasswordStrong() || newPassword !== confirmPassword}
          >
            {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
          </button>
        </form>

        <style>{`
          .change-password-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;

          }
          
          .change-password-container {
            width: 100%;
            max-width: 500px;
            padding: 30px;
            background-color: #fff;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            transition: all 0.3s ease;
          }
          
          .title {
            text-align: center;
            margin-bottom: 30px;
            color: #333;
            font-size: 24px;
            font-weight: 600;
          }
          
          .form-group {
            margin-bottom: 24px;
          }
          
          label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #555;
          }
          
          .password-input-container {
            display: flex;
            position: relative;
          }
          
          input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 16px;
            transition: border-color 0.2s;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
          }
          
          input:focus {
            border-color: #4CAF50;
            outline: none;
            box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
          }
          
          .toggle-password {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            font-size: 14px;
            padding: 4px 8px;
          }
          
          .toggle-password:hover {
            color: #333;
          }
          
          .submit-button {
            width: 100%;
            padding: 14px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .submit-button:hover:not(:disabled) {
            background-color: #45a049;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          
          .submit-button:active:not(:disabled) {
            transform: translateY(0);
          }
          
          .submit-button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
            box-shadow: none;
          }
          
          .message {
            padding: 15px;
            margin-bottom: 25px;
            border-radius: 6px;
            font-weight: 500;
            text-align: center;
          }
          
          .message.success {
            background-color: #d4edda;
            color: #155724;
            border-left: 4px solid #155724;
          }
          
          .message.error {
            background-color: #f8d7da;
            color: #721c24;
            border-left: 4px solid #721c24;
          }
          
          .password-requirements {
            margin-top: 15px;
            font-size: 14px;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 6px;
          }
          
          .password-requirements p {
            margin-bottom: 8px;
            font-weight: 500;
          }
          
          .password-requirements ul {
            padding-left: 20px;
            margin: 0;
          }
          
          .password-requirements li {
            margin: 6px 0;
            display: flex;
            align-items: center;
          }
          
          .valid {
            color: #4CAF50;
          }
          
          .valid:before {
            content: "✓ ";
            margin-right: 5px;
          }
          
          .invalid {
            color: #f44336;
          }
          
          .invalid:before {
            content: "✗ ";
            margin-right: 5px;
          }
          
          .error-message {
            color: #f44336;
            font-size: 14px;
            margin-top: 8px;
            font-weight: 500;
          }
          
          .password-strength {
            margin-top: 12px;
          }
          
          .strength-meter {
            height: 6px;
            background-color: #eee;
            border-radius: 3px;
            margin-bottom: 6px;
            overflow: hidden;
          }
          
          .strength-meter-fill {
            height: 100%;
            border-radius: 3px;
            transition: width 0.3s, background-color 0.3s;
          }
          
          .strength-text {
            font-size: 14px;
            text-align: right;
            font-weight: 500;
          }
          
          @media (max-width: 576px) {
            .change-password-container {
              padding: 20px;
            }
            
            .title {
              font-size: 20px;
              margin-bottom: 20px;
            }
            
            input {
              padding: 10px;
            }
            
            .submit-button {
              padding: 12px;
            }
          }
        `}</style>
      </div>
    </div>
  );
};
