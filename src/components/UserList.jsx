
import { IoPersonCircle } from "react-icons/io5";

// eslint-disable-next-line react/prop-types
const UserList = ({ users, selectedUser, onSelectUser }) => {
    return (
       <div className="w-1/4 h-[80vh] overflow-auto">
               <ul className="user-list space-y-8 text-xl text-black">
                 {users
                   ?.slice()
                   .map((user) => (
                     <li
                       key={user.id}
                       className={`md:text-sm text-xs flex justify-between gap-2 cursor-pointer truncate w-auto rounded-2xl shadow-sm bg-secondary md:h-12 h-10 md:p-4 p-2 max-w-64 items-center ${
                         selectedUser === user.id ? "bg-primary text-white" : ""
                       } `}
                       onClick={() => onSelectUser(user.id)}
                     >
                       <div className="flex justify-center items-center gap-3">
                         <IoPersonCircle
                           size={30}
                           className={`shrink-0 ${
                             selectedUser === user.id
                               ? "bg-primary text-white"
                               : "text-primary"
                           }`}
                         />
                         <span>{user.name}</span>
                       </div>
   
                       {user.has_new_messages === 1 && (
                         <span className="bg-red-400 text-white text-xs font-bold px-2 py-1 rounded-full ml-auto">
                           {user.unseen_message_count}
                         </span>
                       )}
                     </li>
                   ))}
               </ul>
             </div>
    );
  };
  
  export default UserList;
  