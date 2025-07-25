


import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';
import { generatePath } from 'react-router-dom';

const StudentsEnrolled = () => {

  const { backendUrl, getToken, isEducator } = useContext(AppContext)

  const [enrolledStudents, setEnrolledStudents] = useState(null)

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken()

      const { data } = await axios.get(backendUrl + '/api/educator/enrolled-students',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse())
      } else {
        toast.success(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents()
    }
  }, [isEducator])

  return enrolledStudents ? (
    <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20 ">
        <table className="table-fixed md:table-auto w-full overflow-hidden pb-4">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
              <th className="px-4 py-3 font-semibold">Student Name</th>
              <th className="px-4 py-3 font-semibold">Course Title</th>
              <th className="px-4 py-3 font-semibold hidden sm:table-cell">Date</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-500">
            {enrolledStudents.map((item, index) => (
              <tr key={index} className="border-b border-gray-500/20">
                <td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                  <img
                    src={item.student.imageUrl}
                    alt=""
                    className="w-9 h-9 rounded-full"
                  />
                  <span className="truncate">{item.student.name}</span>
                </td>
                <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                <td className="px-4 py-3 hidden sm:table-cell">{new Date(item.purchaseDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : <Loading />
};

export default StudentsEnrolled;





// - Purpose: 
//     Displays a table of students enrolled in courses for an educator. Fetches data from the backend and renders it responsively.

//   - Key Concepts:
//     1. React Hooks:
//        - useState: Manages the enrolled students' state.
//        - useEffect: Triggers data fetch when the component mounts or when 'isEducator' changes.
//        - useContext: Accesses global app context for backend URL, token retrieval, and role check.

//     2. Data Fetching:
//        - Uses axios to call a protected API endpoint.
//        - Attaches JWT token for authentication.
//        - Handles success and error cases with react-toastify notifications.

//     3. Conditional Rendering:
//        - Shows a loading spinner until data is fetched.
//        - Renders a styled table with student info once data is available.

//     4. UI Details:
//        - Responsive table: Some columns are hidden on small screens.
//        - Student avatars and names are displayed with truncation for long names.
//        - Dates are formatted for readability.

//     5. Error Handling:
//        - Displays error messages using toast notifications for better UX.

//   - Gotchas:
//     - The students list is reversed after fetching, so the most recent enrollments appear first.
//     - The 'index' is used as a key in the map; in production, a unique ID is preferable.
//     - The component assumes 'student.imageUrl


// // Note: The above code assumes that the backend API endpoint '/api/educator/enrolled-students'
// // returns a JSON object with a 'success' boolean and an 'enrolledStudents' array