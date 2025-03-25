function SignUp () {
    return (
        <div className='w-full h-screen bg-white flex'>

            <div className='w-1/2 h-screen flex justify-center items-center'>
                <img className='' src="../src/assets/edu-learn.jpg" alt="Logo" />
            </div>

            <div className="w-1/2 h-screen flex items-center justify-center">
                <div className="w-full max-w-md p-8 space-y-6 bg-gray-50 rounded shadow-xl">
                <h2 className="text-2xl font-bold text-center">Đăng ký</h2>
                <form className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Họ và tên
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mật khẩu
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Nhập lại mật khẩu
                        </label>
                        <input
                            id="cf_password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                   
                    <div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Đăng ký
                    </button>
                    </div>

                    <div className='flex items-center justify-center text-sm'>
                    <span>Bạn đã có tài khoản?</span>
                    <a href="#" className="ml-1 font-medium text-indigo-600 hover:text-indigo-500">
                        Đăng nhập
                    </a>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
}

export default SignUp;