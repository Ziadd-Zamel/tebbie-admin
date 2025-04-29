/* eslint-disable react/prop-types */
import { IoPersonCircle } from "react-icons/io5";

const UserList = ({ users, selectedUser, onSelectUser }) => {
  return (
    <div className="w-1/4 h-[80vh] overflow-auto">
      <ul className="user-list space-y-8 text-xl text-black">
        {users?.map((user) => (
          <li
            key={user.chat_id}
            className={`md:text-sm text-xs flex justify-between gap-2 cursor-pointer truncate w-auto rounded-2xl shadow-sm bg-secondary md:h-16 h-auto md:p-4 p-2 max-w-64 items-center relative ${
              selectedUser === user.chat_id ? "text-primary" : ""
            }`}
            onClick={() => onSelectUser(user.chat_id)}
          >
            {user.unread_count > 0 && (
              <span className="bg-primary text-white text-xs font-bold absolute left-2 top-2 w-6 h-6 flex items-center justify-center rounded-full">
                {user.unread_count}
              </span>
            )}

            <div className="flex flex-col gap-1 justify-center items-start truncate">
              <div className="flex items-center gap-2">
                {user.image ? (
                  <img
                    src={user.image}
                    className="shrink-0 size-8 rounded-full"
                  />
                ) : (
                  <IoPersonCircle
                    size={30}
                    className={`shrink-0 ${
                      selectedUser === user.chat_id
                        ? "text-primary"
                        : "text-primary"
                    }`}
                  />
                )}
                <span>{user.user.name}</span>
              </div>

              {user.subject && (
                <span className="text-gray-600 text-xs truncate max-w-[200px]">
                  {user.subject}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
