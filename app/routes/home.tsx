import type { Route } from "./+types/home";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router";
import {AddTask} from "../components/add-task";
import { Welcome } from "../welcome/welcome";
import { ShowTask } from "../components/show-tasks";
import { EditTask } from "../components/edit-task";
import { Toaster,toast } from 'react-hot-toast';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Uprav" },
    { name: "description", content: "task management app" },
  ];
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("showTasks");
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isShowAccountMenu, setIsShowAccountMenu] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [editingTaskID, setEditingTaskID] = useState<number | null>(null);

  // const handleAddTask = (newTask: string) => {
  //   setTasks([...tasks, newTask]); 
  // };

  useEffect(() => {
    const checkAuth = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      // トークンがなければログイン画面へ強制リダイレクト（履歴を上書き）
      navigate("/login", { replace: true });
      return;
    }

    try {
      // ページを開くたびにバックエンドの /api/me に検証リクエストを送る
      const res = await fetch("https://uprav.trap.show/api/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        // 期限切れ、または無効なトークンだった場合
        localStorage.removeItem("token");
        localStorage.removeItem("userSession");
        setIsAuthenticated(false);
        setUserName(null);
        setUserID(null);
        
        toast.error("ログインセッションが切れました。再ログインしてください。");
        navigate("/login", { replace: true });
        return;
      }

      if (!res.ok) {
        throw new Error("サーバーエラーが発生しました");
      }

      // トークンが有効な場合、最新のユーザー情報を取得
      const data = await res.json(); 

      setIsAuthenticated(true);
      setUserName(data.name || null);
      setUserID(data.uid || null);

      // 必要に応じてローカルストレージ側のセッション情報も最新に同期
      localStorage.setItem("userSession", JSON.stringify({ username: data.name, uid: data.uid }));

    } catch (error) {
      console.error("認証チェック中にエラーが発生しました:", error);
      
      // オフライン状態や一時的なネットワークエラーへの配慮
      // 完全にログアウトさせず、既存のローカルキャッシュで一時的にフォールバックさせる
      const userSession = localStorage.getItem("userSession");
      if (userSession) {
        try {
          const parsedSession = JSON.parse(userSession);
          setIsAuthenticated(true);
          setUserName(parsedSession.username || null);
          setUserID(parsedSession.uid || null);
        } catch (e) {
          navigate("/login", { replace: true });
        }
      } else {
        navigate("/login", { replace: true });
      }
    }
  };

  checkAuth();
}, [navigate, setIsAuthenticated, setUserName, setUserID]); // 依存配列に必要なSet関数を追加

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userSession");
    navigate("/login", { replace: true }); // ログイン画面へリダイレクト
  };

  // 3. 認証が完了するまでは、一瞬のチラつきを防ぐために何も画面に出さない
  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <nav className="hidden md:flex md:flex-col md:w-40 lg:w-64 border-r bg-[rgba(58,196,178,1)] p-6 space-y-4 justify-between h-full">
        <div className="space-y-4 w-full">
          <h2 className="font-bold text-xl mb-8">Uprav</h2>
          
          <button 
            onClick={() => setActiveTab("showTasks")}
            className={`block w-full text-left p-2 rounded transition-colors ${activeTab === 'showTasks' ? 'bg-blue-100 text-blue-600' : 'hover:bg-[rgba(50,177,161,1)]'}`}
          >
            タスク一覧
          </button>

          {/* <button 
            onClick={() => setActiveTab("welcome")}
            className={`block w-full text-left p-2 rounded transition-colors ${activeTab === 'welcome' ? 'bg-blue-100 text-blue-600' : 'hover:bg-[rgba(50,177,161,1)]'}`}
          >
            ようこそ
          </button> */}

          <button 
            onClick={() => setActiveTab("addTask")}
            className={`block w-full text-left p-2 rounded transition-colors ${activeTab === 'addTask' ? 'bg-blue-100 text-blue-600' : 'hover:bg-[rgba(50,177,161,1)]'}`}
          >
            タスク追加
          </button>

          {editingTaskID !== null && (
            <button 
              onClick={() => setActiveTab("editTask")}
              className={`block w-full text-left p-2 rounded transition-colors ${
                activeTab === 'editTask' ? 'bg-blue-100 text-blue-600' : 'hover:bg-[rgba(50,177,161,1)]'
              }`}
            >
              タスク編集
            </button>
          )}

          <button 
            //onClick={() => setActiveTab("group")}
            className={`block w-full text-left p-2 rounded transition-colors ${activeTab === 'group' ? 'bg-blue-100 text-blue-600' : 'hover:bg-[rgba(50,177,161,1)]'}`}
          >
            グループ
          </button>
        </div>
        <div className="pt-4 border-t border-[rgba(50,177,161,1)] w-full">
          <div className="relative w-full">
            {isShowAccountMenu && (
              <div 
                className="absolute bottom-full left-0 mb-2 w-full bg-white text-gray-800 border border-gray-200 rounded-xl p-3 shadow-xl animate-fade-in z-50"
                >
                <p className="text-xs text-gray-400 font-medium">ログイン中のアカウント</p>
                <p className="text-sm font-bold text-gray-700 mt-1 break-all">{userName || "Guest User"}</p>
                <p className="text-sm font-bold text-gray-700 mt-1 break-all">UID:{userID || ""}</p>
                <button
                  onClick={handleLogout}
                  className="text-left w-full p-2 text-red-600 font-semibold rounded hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                >
                  ログアウト
                </button>
                {/* 吹き出しの小さな三角形のトゲ */}
                <div className="absolute top-full left-6 w-3 h-3 bg-white border-r border-b border-gray-200 transform rotate-45 -mt-1.5"></div>
              </div>
            )}
            <button
              onClick={() => setIsShowAccountMenu(!isShowAccountMenu)} // クリックで反転開閉
              className={`text-left w-full p-2 font-semibold rounded transition-colors cursor-pointer ${isShowAccountMenu ? 'bg-blue-100 text-blue-600' : 'hover:bg-[rgba(50,177,161,1)]'}`}
            >
               アカウント
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-10 overflow-y-auto">
        {/* {activeTab === "addTask" && <AddTask onAddTask={handleAddTask}/>} */}
        {activeTab === "addTask" && <AddTask />}
        {/* {activeTab === "welcome" && <Welcome />} */}
        {activeTab === "showTasks" && <ShowTask setEditingTaskID={setEditingTaskID} setActiveTab={setActiveTab}/>}
        {activeTab === "editTask" && editingTaskID !== null && <EditTask editingTaskID={editingTaskID} setEditingTaskID={setEditingTaskID} setActiveTab={setActiveTab}/>}
      </main>
      
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

/* rounded-3xl	角を大きく丸めます */
/*border	1pxの枠線を引きます。*/
/*border-gray-200	枠線の色を薄いグレーに設定します。*/
/*p-6	内側に余白（パディング）を設けます（6 は 1.5rem = 24px 程度）。*/
/*dark:border-gray-700	ダークモード時の設定です。枠線の色を濃いグレーに変更します。 */
/*space-y-4	子要素の間に垂直方向のスペースを設けます（4 は 1rem = 16px 程度）。 */
/*max-w-[300px]	最大幅を300pxに制限*/
/*px-4	左右のパディング	内側の左右に 1rem (16px) の余白を作ります。 */
/*shadow-sm　影をつける */
// shrink-0 画面幅が狭まっても文字が折り返して潰れないように