/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { IoPersonCircle } from "react-icons/io5";
import { FaUsers, FaTimes } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { fetchAdminUsersList } from "../utlis/https"; // Assuming this is the path to your API utility
import { FiLoader } from "react-icons/fi";

const AdminChatList = ({ token, selectedUser, onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const userListRef = useRef(null);
  const loaderRef = useRef(null);
  const { t } = useTranslation();

  const fetchUsers = async (pageNum, query = "") => {
    setIsLoading(true);
    try {
      const params = { token, page: pageNum };
      if (query) {
        params.search = query;
      }
      const data = await fetchAdminUsersList(params);
      setUsers((prev) => (pageNum === 1 ? data : [...prev, ...data]));
      setHasMore(data.length > 0); 
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1); 
      fetchUsers(1, searchQuery);
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, token]);

  // Infinite scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, isLoading]);

  useEffect(() => {
    if (page > 1) {
      fetchUsers(page, searchQuery);
    }
  }, [page]);

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
            placeholder="ابحث عن المستخدمين..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* User List */}
        <ul className="user-list space-y-8 text-xl text-black px-4 pb-4">
          {users?.length > 0 ? (
            users.map((user) => (
                <li
                key={user.id}
                className={`md:text-sm text-xs flex justify-between gap-2 cursor-pointer truncate w-auto rounded-2xl shadow-sm bg-secondary md:h-16 h-auto md:p-4 p-2 max-w-64 items-center relative ${
                  selectedUser === user.id ? "text-primary" : ""
                }`}
                onClick={() => {
                  onSelectUser(user.id);
                  setIsOpen(false);
                }}
              >
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
                    <div className="flex flex-col gap-2">
                      <span>
                        {t("user_name")} : {user.user?.name || "Unknown"}
                      </span>
                      <span>
                        {t("customer_service_name")} :{" "}
                        {user.customer_service?.name || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-500 text-sm text-center">
              {t("no_users_found")}
            </li>
          )}
        </ul>

        {hasMore && (
          <div ref={loaderRef} className="flex justify-center py-4">
            {isLoading && <FiLoader className="text-primary animate-spin transition-all duration-500 text-2xl"/>}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminChatList;