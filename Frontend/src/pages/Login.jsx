import React, { useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";

const Login = () => {
  const { token, setToken, backendUrl, navigate } = useContext(ShopContext);
  const [currentState, setCurrentState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //console.log(backendUrl);
  const onSubmitHandler = async (event) => {
    event.preventDefault(); // after submitting the form it will prevent from reloading
    try {
      if (currentState === "Sign Up") {
        //Will call the sign up/register api
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        //will call the login api
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === "Login" ? (
        ""
      ) : (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full px-3 py-2 border border-gray-800"
          type="text"
          placeholder="Name"
          required
        />
      )}
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className="w-full px-3 py-2 border border-gray-800"
        type="email"
        placeholder="Email Address"
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className="w-full px-3 py-2 border border-gray-800"
        type="password"
        placeholder="Password"
        required
      />
      <div className="w-full flex justify-between text-sm -mt-2">
        {currentState === "Sign Up" ? (
          ""
        ) : (
          <p className="cursor-pointer">Forgot Your Password?</p>
        )}
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer "
          >
            Don't Have an Account?
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer "
          >
            Already Have an Account?
          </p>
        )}
      </div>
      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;
