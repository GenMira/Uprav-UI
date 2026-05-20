import { useState } from "react";
import { Link } from "react-router";

interface LoginRequest{
  name: string;
  password: string;
}
export default function Login() {
  const [userName,setUserName]=useState("");
  const [password,setPassword]=useState("");

    const login = async () => {
    const userInfo: LoginRequest = {
      name: userName,
      password: password
    };

    try {
      const response = await fetch("https://uprav.trap.show/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        throw new Error("ログインに失敗しました");
      }
      console.log("success:login");

      const data = await response.json();
      const token = data.token;

      console.log(data);
      if (token) {
        //ブラウザの localStorage に「token」という名前で保存する
        localStorage.setItem("token", token);
        console.log("localStorageにトークンを保存しました。");
      }
    } catch (error) {
      console.error("Error login:", error);
    }
  };

  return(
    <div className="flex flex-col h-screen w-full bg-gray-100 justify-center items-center">
      <div className="flex flex-col w-[50%]  justify-center bg-white items-center gap-5 p-6 rounded-xl">
        <h1 className="text-4xl font-bold text-gray-800">
          ログイン
        </h1>
        <div className="flex flex-col w-full justify-center items-center mt-10 gap-5">
          <label className="w-[60%] items-start font-semibold">
            ユーザーネーム
          </label>
          <input
            type="text"
            placeholder="入力..."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-[60%] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col w-full justify-center items-center  mt-5 gap-5">
          <label className="w-[60%] items-start font-semibold ">
            password
          </label>
          <input
            type="text"
            placeholder="入力..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[60%] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Link 
          to="/signup" 
          className="text-blue-500 font-semibold hover:underline"
        >
          新規登録はこちら
        </Link>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-8"
          onClick={() => login()}
        >
          Login
        </button>
      </div>
    </div>
  );
}