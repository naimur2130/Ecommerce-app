import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets.js";

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink
          className="flex items-center gap-3 border border-r-0 px-3 py-2 rounded-l"
          to="/"
          end
        >
          <svg
            className="w-7 h-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="9" rx="1.5" />
            <rect x="14" y="3" width="7" height="5" rx="1.5" />
            <rect x="14" y="12" width="7" height="9" rx="1.5" />
            <rect x="3" y="16" width="7" height="5" rx="1.5" />
          </svg>
          <p className="hidden md:block">Dashboard</p>
        </NavLink>
        <NavLink
          className="flex items-center gap-3 border border-r-0 px-3 py-2 rounded-l"
          to="/add"
        >
          <img className="w-7 h-7" src={assets.add} alt="" />
          <p className="hidden md:block">Add Items</p>
        </NavLink>
        <NavLink
          className="flex items-center gap-3 border border-r-0 px-3 py-2 rounded-l"
          to="/list"
        >
          <img className="w-7 h-7" src={assets.list} alt="" />
          <p className="hidden md:block">List Items</p>
        </NavLink>
        <NavLink
          className="flex items-center gap-3 border border-r-0 px-3 py-2 rounded-l"
          to="/orders"
        >
          <img className="w-7 h-7" src={assets.order} alt="" />
          <p className="hidden md:block">Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
