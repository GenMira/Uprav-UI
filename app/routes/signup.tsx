import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";

interface SignupRequest{
  name: string;
  password: string;
}
export default function SignUp() {
  const [userName,setUserName]=useState("");
  const [password,setPassword]=useState("");
  const navigate = useNavigate();

  const Signup = async () => {
    const userInfo: SignupRequest = {
      name: userName,
      password: password
    };

    try {
      const response = await fetch("https://uprav.trap.show/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          
          if (errorData && errorData.message) {
            throw new Error(`Error Message : ${errorData.message}`);
          } else {
            throw new Error(`Request Failed (Status: ${response.status})`);
          }
        } catch (parseError) {
          // レスポンスがJSON形式ではなかった場合のフォールバック
          throw new Error(`Error happened (Status: ${response.status})`);
        }
      }
      console.log("success:signup");

      const data = await response.json();
      const token = data.token;

      console.log(data);
      if (token) {
        //ブラウザの localStorage に「token」という名前で保存する
        localStorage.setItem("token", token);
        console.log("localStorageにトークンを保存しました。");
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Error signup:", error);
    }
  };

  return(
    <div className="flex flex-col h-screen w-full bg-gray-100 justify-center items-center">
      <div className="flex flex-col w-[50%] justify-center bg-white items-center gap-5 p-6 rounded-xl">
        <h1 className="text-4xl font-bold text-gray-800">
          新規登録
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
          to="/login" 
          className="text-blue-500 font-semibold hover:underline"
        >
          ログインはこちら
        </Link>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-8"
          onClick={() => Signup()}
        >
          登録
        </button>
      </div>
    </div>
  );
}