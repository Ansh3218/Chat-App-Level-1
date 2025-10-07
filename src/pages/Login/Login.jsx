import React, { useState } from "react";
import assets from "../../assets/assets";
import { login, signup, resetPassword } from "../../config/firebase";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (currentState === "Sign Up") {
      signup(userName, email, password);
    } else {
      login(email, password);
    }
  };

  return (
    <div>
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        {/* Main Container - Responsive flex direction */}
        <div className="login flex flex-col lg:flex-row items-center justify-center lg:justify-evenly min-h-screen font-[poppins] px-4 sm:px-6 lg:px-10 py-8 lg:py-0 gap-8 lg:gap-4">
          {/* Logo Image - Responsive sizing */}
          <img
            src={assets.loginImg}
            alt="Login illustration"
            className="logo w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[30vw] xl:max-w-[450px] order-1 lg:order-none"
          />

          {/* Login Form - Responsive width and height */}
          <form
            onSubmit={onSubmitHandler}
            className={`login-form border-2 p-5 sm:p-6 md:p-8 border-black rounded-2xl w-full max-w-[400px] sm:max-w-[450px] md:max-w-[500px] transition-all duration-300 order-2 lg:order-none
              ${
                currentState === "Sign Up"
                  ? "h-auto min-h-[480px]"
                  : "h-auto min-h-[420px]"
              }`}
          >
            {/* Heading - Responsive text size */}
            <h2 className="text-xl sm:text-2xl md:text-3xl pb-4 sm:pb-6 py-2 sm:py-3 font-bold text-center sm:text-left">
              {currentState}
            </h2>

            {/* Input Fields */}
            <div className="flex flex-col gap-y-4 sm:gap-y-5 md:gap-y-7">
              {/* Username Field - Only for Sign Up */}
              {currentState === "Sign Up" ? (
                <input
                  onChange={(e) => setUserName(e.target.value)}
                  value={userName}
                  type="text"
                  placeholder="Username"
                  className="p-2.5 sm:p-3 focus:outline-blue-600 text-base sm:text-lg placeholder:text-gray-800 rounded-md border-2 form-input w-full"
                  required
                />
              ) : null}

              {/* Email Field */}
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                autoComplete="username"
                type="email"
                placeholder="Email address"
                className="form-input p-2.5 sm:p-3 text-base sm:text-lg placeholder:text-gray-800 rounded-md border-2 focus:outline-blue-600 w-full"
                required
              />

              {/* Password Field */}
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                autoComplete="current-password"
                type="password"
                placeholder="Password"
                className="form-input p-2.5 sm:p-3 text-base sm:text-lg placeholder:text-gray-800 rounded-md border-2 focus:outline-blue-600 w-full"
                required
              />
            </div>

            {/* Submit Button - Responsive text and padding */}
            <button
              className="w-full bg-blue-500 p-2.5 sm:p-3 my-4 sm:my-5 rounded-md text-lg sm:text-xl text-white cursor-pointer hover:bg-blue-600 transition-colors duration-200"
              type="submit"
            >
              {currentState === "Sign Up" ? "Create account" : "Login"}
            </button>

            {/* Terms Checkbox - Responsive text */}
            <div className="login-term flex items-start sm:items-center gap-x-2 mb-3">
              <input
                type="checkbox"
                className="cursor-pointer mt-1 sm:mt-0 flex-shrink-0"
                required
              />
              <p className="text-sm sm:text-base">
                Agree to the terms of use & privacy policy.
              </p>
            </div>

            {/* Toggle and Forgot Password Section */}
            <div className="login-forgot px-2 sm:px-5 py-2 sm:py-3">
              {/* Toggle between Login / Sign Up - Responsive text */}
              <p className="login-toggle flex flex-wrap items-center gap-x-1 text-sm sm:text-base">
                {currentState === "Sign Up"
                  ? "Already have an account?"
                  : "Don't have an account?"}
                <span
                  className="text-blue-500 cursor-pointer hover:underline font-medium"
                  onClick={() =>
                    setCurrentState((prev) =>
                      prev === "Sign Up" ? "Login" : "Sign Up"
                    )
                  }
                >
                  Click Here
                </span>
              </p>

              {/* Forgot Password - Only on Login */}
              {currentState === "Login" && (
                <p className="login-toggle flex flex-wrap items-center gap-x-1 mt-2 cursor-pointer text-sm sm:text-base">
                  Forgot Password?{" "}
                  <span
                    className="text-blue-500 hover:underline font-medium"
                    onClick={() => resetPassword(email)}
                  >
                    Reset here
                  </span>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
