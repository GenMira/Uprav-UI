import { useState, useEffect } from "react";
import toast from 'react-hot-toast';

interface GroupMember {
  uid: number;
  name: string;
}

interface Group {
  id: string;
  name: string;
  members: [GroupMember, ...GroupMember[]]; 
}

export function Group() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupName,setGroupName] = useState<string>("");
  const [currentUid, setCurrentUid] = useState<string>("");
  const [currentUsers, setCurrentUsers] = useState<GroupMember[]>([]);

  const getGroups = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("トークンが見つかりません。ログインしてください。");
      return;
    }
    try {
      const response = await fetch("https://uprav.trap.show/api/groups", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log("グループが存在しません（404）");
          setGroups([]);
          return;
        }

        // 404 以外（500エラーなど）は、ステータスを付与したカスタムエラーを投げて catch に飛ばす
        const errorWithStatus = new Error("Failed to fetch groups") as any;
        errorWithStatus.status = response.status;
        throw errorWithStatus;
      }

      const groups = await response.json();
      console.log("success:", groups);
      setGroups(groups);

    } catch (error: any) {
      console.error("エラー:", error);
      console.log(error.message);
      toast.error("通信エラーが発生しました");
    }
  };

  const handleAddUid = async () => {
    const parsed = parseInt(currentUid, 10);
    
    if (isNaN(parsed)) return;

    const isAlreadyAdded = currentUsers.some((user) => user.uid === parsed);
    if (isAlreadyAdded) {
      toast.error("このUIDはすでに追加されています");
      return;
    }

    const userInfo = await getUserByUid(parsed);

    if (userInfo) {
      setCurrentUsers([...currentUsers, userInfo]);
      setCurrentUid(""); 
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddUid();
    }
  };

  const handleRemoveUid = (targetUid: number) => {
    setCurrentUsers(currentUsers.filter((user) => user.uid !== targetUid));
  };

  const getUserByUid = async (uid: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("トークンが見つかりません。ログインしてください。");
      return null;
    }

    try {
      const response = await fetch(`https://uprav.trap.show/api/user/${uid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log(`UID: ${uid} のユーザーが見つかりません`);
          toast.error(`UID: ${uid} のユーザーが見つかりません`);
          return null;
        }

        const errorWithStatus = new Error("Failed to fetch user") as any;
        errorWithStatus.status = response.status;
        throw errorWithStatus;
      }

      const userData  = await response.json();
      console.log("取得成功:", userData);
      return userData


    } catch (error: any) {
      console.error("エラー:", error);
      toast.error("ユーザー情報の取得に失敗しました");
      return null;
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  return(
    <div className="flex flex-col min-h-screen w-full items-center bg-gray-100 rounded-2xl">
      <div className="h-20 w-full flex items-center justify-center bg-orange-200">
        <h2 className="text-xl text-black pt-5 pb-5 font-bold">グループ</h2>
      </div>
      <div className="flex justify-center items-center w-full px-6 pt-4 gap-5">
        <button
          className="hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded transition-colors"
          onClick={()=>{
            const newGroup: Group = {
              id: "",
              name: "",
              members: [{ uid: 0, name: "" }], 
            };
            setSelectedGroup(newGroup);
          }
          }
        >
          新規グループを作成
        </button>
      </div>

      <div className="flex flex-col p-6">
        <ul className="grid grid-cols-1 gap-4">
          {groups.length !== 0 ? (
            groups.map((group, index) => {
              return(
                <li
                  key={`${group.id}-${index}`}
                  onClick={() => setSelectedGroup(group)}
                  className="card-interactive relative overflow-hidden bg-white"
                >
                  <div 
                    className="absolute top-0 left-0 right-0 h-[10%] bg-red-500"
                  />
                  <span className={'text-gray-800 font-semibold'}>
                    {group.name}
                  </span>
                </li>
              )
            })
          ):(
            <li className="text-gray-500 text-center">
            グループが見つかりません。<br />新規グループを作成するか、既存のグループに参加してください。
            </li>
          )}
        </ul>
      </div>

      {selectedGroup &&(
        <div 
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-fade-in"
          onClick={() => setSelectedGroup(null)}
        >
          <div 
            className="bg-white rounded-2xl p-10 w-[60%] mx-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedGroup(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
            <div
              className="text-center text-black font-bold"
            >
              グループを新規作成
            </div>
            <div className="flex flex-col md:flex-row w-full w-full justify-center items-center px-6 gap-2 pt-10 pb-10">
              <div className="md:w-[20%] text-black">新しいグループ名</div>
              <input
                type="text"
                placeholder="グループ名..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-[80%] md:w-[60%] p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full">
              <div className="flex flex-col md:flex-row w-full justify-center items-center px-6 gap-2 pt-10 pb-4">
                <div className="md:w-[20%] text-black font-medium">
                  メンバーのUID
                </div>

                <div className="w-[80%] md:w-[60%] flex gap-2">
                  <input
                    type="number"
                    placeholder="UIDを入力..."
                    value={currentUid}
                    onChange={(e) => setCurrentUid(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddUid}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    追加
                  </button>
                </div>
              </div>

              {currentUsers.length > 0 && (
                <div className="flex flex-row flex-wrap justify-center items-center px-6 gap-2 pb-10">
                  <div className="hidden md:block md:w-[20%]" />
                  
                  <div className="w-[80%] md:w-[60%] flex flex-wrap gap-2">
                    {currentUsers.map((user) => (
                      <div
                        key={user.uid}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 border border-gray-300 text-gray-800 text-sm font-medium rounded-lg shadow-sm"
                      >
                        <span>{user.name} ({user.uid})</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveUid(user.uid)}
                          className="ml-1 text-gray-400 hover:text-red-500 rounded-full p-0.5 transition-colors font-bold"
                          title="削除"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}