import React from "react";
import { useState } from "react";
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom'

const otpSchema = yup.object().shape({
  email: yup.string().required("Email is required").required("@gmail.com").email("Enter a valid email"),
  password: yup.string().required("Password is required").min(8, "Length is atleast of 8 characters").max(12, "Length can't be more than the 12"),
  otp: yup.string().min(4, "4 digit otp is required").max(4, "4 digit otp is required").optional()
})

const App = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(false);
  const { register, watch, setValue , handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(otpSchema),
    shouldUnregister : true
  });
  const email = watch("email");

  const otpGenerator = async (data) => {

    const otpValue = watch("otp");
    console.log("The otp value is : ", otpValue);

    if (!otp) {
      console.log("OTP creation has been called");
      
      const res = await fetch('http://localhost:3000/otp', {
        method: "POST",
        credentials: "include",
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      })
      const data1 = await res.json();
      if (data1.message === "okay") {
        setOtp(true);
      }

      console.log("The res from the backend is : ", data1);

    } else {
      console.log("Entered where the otp has been generated");
      const res = await fetch('http://localhost:3000/login', {
        method: "POST",
        credentials: "include",
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          otp: data.otp
        })
      })
      const data1 = await res.json();
      console.log("The responce is : ", data1);
      if (data1.message == "Successful") {
        console.log("We are now navigating to the chats");
        console.log("The email is : " , email);
        
        navigate('/chat' , {
          state : {
            email : data.email,
          }
        });
      } else {
        setOtp(false);
        setValue("otp", "");
        console.log("OTP was't correct");

      }
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
      <div className="w-[420px] bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8">
        <form
          onSubmit={handleSubmit(otpGenerator)}
          className="flex flex-col gap-6"
        >
          <h1 className="text-4xl font-bold text-center text-white mb-2">
            Welcome Back
          </h1>

          <p className="text-gray-300 text-center text-sm">
            Login with your email and password
          </p>

          <div className="flex flex-col gap-2">
            <label className="text-white font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-gray-500 text-white placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
            />

            {errors.email && (
              <p className="text-red-400 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-gray-500 text-white placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
            />

            {errors.password && (
              <p className="text-red-400 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          {otp && (
            <div className="flex flex-col gap-2">
              <label className="text-white font-medium">
                OTP
              </label>

              <input
                type="text"
                placeholder="Enter 4-digit OTP"
                {...register("otp")}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-gray-500 text-white placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
              />

              {errors.OTP && (
                <p className="text-red-400 text-sm">
                  {errors.OTP.message}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="mt-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 text-white font-semibold py-3 rounded-xl shadow-lg"
          >
            {otp ? "Verify OTP" : "Generate OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App
