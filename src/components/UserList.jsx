/* eslint-disable react/prop-types */
import { IoPersonCircle } from "react-icons/io5";
import { FaUsers, FaTimes } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

const UserList = ({ users, selectedUser, onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const userListRef = useRef(null);

  const filteredUsers = users?.filter(
    (user) =>
      user.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.subject &&
        user.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleUserList = () => {
    setIsOpen(!isOpen);
  };

  const closeUserList = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        userListRef.current &&
        !userListRef.current.contains(event.target)
      ) {
        closeUserList();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={toggleUserList}
        className="md:hidden fixed top-1/4 right-4 bg-primary text-white p-3 rounded-full shadow-lg z-50 flex items-center justify-center"
      >
        <FaUsers size={24} />
      </button>

      {/* User List Container */}
      <div
        ref={userListRef}
        className={`md:h-[80vh] h-[60vh] overflow-auto md:bg-white bg-gray-50 rounded-md md:rounded-none md:shadow-none shadow-lg md:static fixed bottom-0 left-0 right-0 z-50 md:w-1/4 w-full max-h-[60vh] transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } md:translate-y-0`}
      >
        {/* Close Button for Mobile View */}
        <button
          onClick={closeUserList}
          className="md:hidden absolute top-4 end-4 text-white bg-primary size-8 flex justify-center items-center rounded-full z-50"
        >
          <FaTimes size={20} />
        </button>

        <div className="p-4 md:my-4 my-10">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن المستخدمين أو المواضيع..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* User List */}
        <ul className="user-list space-y-8 text-xl text-black px-4 pb-4">
          {filteredUsers?.length > 0 ? (
            filteredUsers.map((user) => (
              <li
                key={user.chat_id}
                className={`md:text-sm text-xs flex justify-between gap-2 cursor-pointer truncate w-auto rounded-2xl shadow-sm bg-secondary md:h-16 h-auto md:p-4 p-2 max-w-64 items-center relative ${
                  selectedUser === user.chat_id ? "text-primary" : ""
                }`}
                onClick={() => {
                  onSelectUser(user.chat_id);
                  setIsOpen(false); 
                }}
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
            ))
          ) : (
            <li className="text-gray-500 text-sm text-center">No users found</li>
          )}
        </ul>
      </div>
    </>
  );
};

export default UserList;