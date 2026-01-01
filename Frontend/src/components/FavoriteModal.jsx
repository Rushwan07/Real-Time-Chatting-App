import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../features/Auth/userSlice";

const FavoriteModal = ({ onClose, setFriends }) => {
  const dispatch = useDispatch();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const { user, token } = useSelector(
    (state) => state?.user?.user || { user: null, token: null }
  );
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (!token) return;
    const fetRequests = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/friends/getRequests`, {
          headers: { token },
        });
        const res2 = await axios.get(`${BASE_URL}/friends/`, {
          headers: { token },
        });

        console.log("FIRENDS ", res2.data.friends);
        dispatch(
          setUser({
            user: {
              ...user,
              friends: Array.isArray(res2?.data?.friends)
                ? res2.data.friends.map((f) => f._id ?? f)
                : user.friends,
            },
            token: token,
          })
        );

        console.log("res2?.data?.friends", res2?.data?.friends);
        setFriends(res2?.data?.friends);

        setNotifications(res?.data?.requests?.friendRequests);
        console.log(res.data);
      } catch (error) {}
    };

    fetRequests();
  }, [token]);
  console.log(notifications);

  const HandleAccept = async (Id) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/friends/accept/${Id}`,
        {}, // empty body
        {
          headers: { token },
        }
      );

      dispatch(
        setUser({
          user: res.data.data.receiver,
          token: token,
        })
      );

      console.log("DODODOODODOOD", res?.data);
      setFriends((prev) => [...prev, res.data?.data?.sender]);
      console.log("TTTTTTTTTTTTTT", res.data?.data?.sender);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
      <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-[480px] sm:max-w-[600px] shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">
            Notifications
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        <div className="border-b border-gray-200 mb-4"></div>

        {/* Notification List */}
        <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-1 space-y-3">
          {Array.isArray(notifications) && notifications.length > 0 ? (
            notifications.map((noti, ind) => (
              <div
                key={ind}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-full object-cover"
                    src={noti.from.image}
                    alt="profile"
                  />

                  <div>
                    <h1 className="font-semibold text-gray-800 text-sm sm:text-lg">
                      {noti.from.username}
                    </h1>
                    {noti.status == "accepted" ? (
                      <p className="text-gray-600 text-xs sm:text-sm">
                        You both are friends
                      </p>
                    ) : (
                      <p className="text-gray-600 text-xs sm:text-sm">
                        You have a new friend request
                      </p>
                    )}
                  </div>
                </div>

                {noti.status == "accepted" ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      disabled
                      className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gray-500 text-white text-xs sm:text-sm font-medium"
                    >
                      Accepted
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => HandleAccept(noti?.from?._id)}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-green-500 text-white text-xs sm:text-sm font-medium hover:bg-green-600 transition"
                    >
                      Confirm
                    </button>

                    <button
                      // onClick={HandleReject}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-500 text-white text-xs sm:text-sm font-medium hover:bg-red-600 transition"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm">
              No notifications
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoriteModal;
