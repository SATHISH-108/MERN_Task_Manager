// import { useState } from "react";

// const TaskFilters = ({ onFilter }) => {
//   const [filters, setFilters] = useState({
//     search: "",
//     status: "",
//     difficulty: "",
//   });

//   const handleChange = (e) => {
//     const updated = { ...filters, [e.target.name]: e.target.value };
//     setFilters(updated);
//     onFilter(updated);
//   };

//   return (
//     <div>
//       <input name="search" placeholder="Search" onChange={handleChange} />

//       <select name="status" onChange={handleChange}>
//         <option value="">All</option>
//         <option value="pending">Pending</option>
//         <option value="completed">Completed</option>
//       </select>

//       <select name="difficulty" onChange={handleChange}>
//         <option value="">All</option>
//         <option value="easy">Easy</option>
//         <option value="medium">Medium</option>
//         <option value="hard">Hard</option>
//       </select>
//     </div>
//   );
// };

// export default TaskFilters;

import { useState } from "react";

const TaskFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    difficulty: "",
  });

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4">
      <input
        className="border p-2 rounded w-full"
        placeholder="Search"
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />

      <select
        className="border p-2 rounded"
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      >
        <option value="">Status</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>

      <select
        className="border p-2 rounded"
        onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
      >
        <option value="">Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <button
        className="bg-blue-500 text-white px-4 rounded"
        onClick={() => onFilter(filters)}
      >
        Apply
      </button>
    </div>
  );
};

export default TaskFilters;
