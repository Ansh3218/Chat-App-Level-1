import React, { useState } from "react";
import assets from "../../assets/assets";
import { login, signup } from "../../config/firebase";

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
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="login flex items-center justify-evenly  object-cover min-h-screen font-[poppins] px-10">
          <img src={assets.loginImg} alt="" className="logo w-[30vw]" />
          <form
            onSubmit={onSubmitHandler}
            className={`login-form border-2 p-5 border-black ${
              currentState === "Sign Up" ? "h-[65vh]" : "h-[55vh]"
            } rounded-2xl`}
          >
            <h2 className="text-2xl pb-6 py-3 font-bold">{currentState}</h2>
            <div className="flex flex-col gap-y-7">
              {currentState === "Sign Up" ? (
                <input
                  onChange={(e) => setUserName(e.target.value)}
                  value={userName}
                  type="text"
                  placeholder="Username"
                  className="p-3 focus:outline-blue-600 text-lg placeholder:text-gray-800 rounded-md
               border-2
                 form-input"
                  required
                />
              ) : null}

              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                autoComplete="username"
                type="email"
                placeholder="Email address"
                className="form-input p-3 text-lg placeholder:text-gray-800 rounded-md
               border-2 focus:outline-blue-600"
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                autoComplete="current-password"
                type="password"
                placeholder="Password"
                className="form-input p-3 text-lg placeholder:text-gray-800 rounded-md
               border-2 focus:outline-blue-600"
              />
            </div>
            <button
              className="w-full bg-blue-500 p-3 my-5 rounded-xs text-xl text-white cursor-pointer hover:bg-blue-600"
              type="submit"
            >
              {currentState === "Sign Up" ? "Create account" : "Login"}
            </button>
            <div className="login-term flex items-center gap-x-2">
              <input type="checkbox" className="cursor-pointer" />
              <p>Agree to the terms of use & privacy policy.</p>
            </div>
            <div className="login-forgot px-5 py-3 ">
              <p className="login-toggle flex items-center gap-x-1">
                {currentState === "Sign Up"
                  ? "Already have an account"
                  : "Create an account"}
                <span
                  className="text-blue-500 cursor-pointer hover:underline"
                  onClick={() =>
                    setCurrentState((prev) =>
                      prev === "Sign Up" ? "Login" : "Sign Up"
                    )
                  }
                >
                  Click Here
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
