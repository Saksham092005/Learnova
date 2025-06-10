

import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const Dashboard = () => {

  const { backendUrl, isEducator, currency, getToken } = useContext(AppContext)

  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Debug: Log the backend URL
      console.log('Backend URL:', backendUrl)

      const token = await getToken()
      
      // Debug: Check if token exists
      if (!token) {
        throw new Error('No authentication token available')
      }

      console.log('Token available:', !!token)

      const { data } = await axios.get(`${backendUrl}/api/educator/dashboard`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('API Response:', data)

      if (data.success) {
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message || 'Failed to fetch dashboard data')
        setError(data.message || 'Failed to fetch dashboard data')
      }

    } catch (error) {
      console.error('Dashboard fetch error:', error)
      
      let errorMessage = 'An error occurred while fetching dashboard data'
      
      if (error.response) {
        // Server responded with error status
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request)
        errorMessage = 'Network error: Unable to reach server'
      } else {
        // Something else happened
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData()
    }
  }, [isEducator])

  // Show error state
  if (error && !loading) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center p-8'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-red-600 mb-4'>Error Loading Dashboard</h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <button 
            onClick={fetchDashboardData}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return dashboardData ? (
    <div className='min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <div className='space-y-5'>
        <div className='flex flex-wrap gap-5 items-center'>
          <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md'>
            <img src={assets.patients_icon} alt="patients_icon" />
            <div>
              <p className='text-2xl font-medium text-gray-600'>
                {dashboardData.enrolledStudentsData?.length || 0}
              </p>
              <p className='text-base text-gray-500'>Total Enrolments</p>
            </div>
          </div>
          <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md'>
            <img src={assets.appointments_icon} alt="appointments_icon" />
            <div>
              <p className='text-2xl font-medium text-gray-600'>
                {dashboardData.totalCourses || 0}
              </p>
              <p className='text-base text-gray-500'>Total Courses</p>
            </div>
          </div>
          <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md'>
            <img src={assets.earning_icon} alt="earnings_icon" />
            <div>
              <p className='text-2xl font-medium text-gray-600'>
                {currency}{Math.floor(dashboardData.totalEarnings || 0)}
              </p>
              <p className='text-base text-gray-500'>Total Earnings</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="pb-4 text-lg font-medium">Latest Enrolments</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed md:table-auto w-full overflow-hidden">
              <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold">Course Title</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {dashboardData.enrolledStudentsData?.map((item, index) => (
                  <tr key={index} className="border-b border-gray-500/20">
                    <td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                    <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                      <img
                        src={item.student?.imageUrl || assets.profile_img}
                        alt="Profile"
                        className="w-9 h-9 rounded-full"
                        onError={(e) => {
                          e.target.src = assets.profile_img; // Fallback image
                        }}
                      />
                      <span className="truncate">{item.student?.name || 'Unknown Student'}</span>
                    </td>
                    <td className="px-4 py-3 truncate">{item.courseTitle || 'Unknown Course'}</td>
                  </tr>
                )) || []}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : <Loading />
}

export default Dashboard