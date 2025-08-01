import { useState, useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { 
  LogIn, 
  LogOut, 
  Plus, 
  Search, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff,
  Users,
  Key,
  Calendar,
  Activity,
  UserX,
  CalendarPlus,
  CalendarMinus
} from 'lucide-react'

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [licenses, setLicenses] = useState([])
  const [stats, setStats] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newLicense, setNewLicense] = useState({ email: '', expired_date: '' })
  const [loading, setLoading] = useState(false)

  // Check login status on component mount
  useEffect(() => {
    checkLoginStatus()
  }, [])

  // Fetch data when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchDashboardData()
      fetchLicenses()
    }
  }, [isLoggedIn])

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('/api/admin/check')
      const data = await response.json()
      setIsLoggedIn(data.logged_in)
    } catch (error) {
      console.error('Error checking login status:', error)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setIsLoggedIn(true)
        setLoginForm({ username: '', password: '' })
      } else {
        alert(data.error || 'Login failed')
      }
    } catch (error) {
      alert('Login error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      setIsLoggedIn(false)
      setLicenses([])
      setStats({})
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const fetchLicenses = async () => {
    try {
      const response = await fetch('/api/license/list')
      const data = await response.json()
      if (data.success) {
        setLicenses(data.licenses)
      }
    } catch (error) {
      console.error('Error fetching licenses:', error)
    }
  }

  const handleCreateLicense = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/license/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLicense)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setShowCreateModal(false)
        setNewLicense({ email: '', expired_date: '' })
        fetchLicenses()
        fetchDashboardData()
        alert('License created successfully!')
      } else {
        alert(data.error || 'Failed to create license')
      }
    } catch (error) {
      alert('Error creating license: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadLicense = async (licenseKey) => {
    try {
      const response = await fetch(`/api/license/download/${licenseKey}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${licenseKey}.txt`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      alert('Error downloading license: ' + error.message)
    }
  }

  const handleDeleteLicense = async (licenseId) => {
    if (!confirm('Are you sure you want to delete this license?')) return
    
    try {
      const response = await fetch(`/api/license/delete/${licenseId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchLicenses()
        fetchDashboardData()
        alert('License deleted successfully!')
      } else {
        alert(data.error || 'Failed to delete license')
      }
    } catch (error) {
      alert('Error deleting license: ' + error.message)
    }
  }

  const handleDeactivateLicense = async (licenseKey, deviceId) => {
    if (!confirm('Are you sure you want to deactivate this license? This will remove it from the current device.')) return
    
    try {
      const response = await fetch(`/api/deactivate_license`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: licenseKey,
          device_id: deviceId
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchLicenses()
        fetchDashboardData()
        alert('License deactivated successfully!')
      } else {
        alert(data.error || 'Failed to deactivate license')
      }
    } catch (error) {
      alert('Error deactivating license: ' + error.message)
    }
  }

  const handleExtendLicense = async (licenseId) => {
    const days = prompt('Enter number of days to extend:')
    if (!days || isNaN(days) || parseInt(days) <= 0) {
      alert('Please enter a valid number of days')
      return
    }
    
    try {
      const response = await fetch(`/api/license/extend/${licenseId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: parseInt(days) })
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchLicenses()
        fetchDashboardData()
        alert(data.message)
      } else {
        alert(data.error || 'Failed to extend license')
      }
    } catch (error) {
      alert('Error extending license: ' + error.message)
    }
  }

  const handleShortenLicense = async (licenseId) => {
    const days = prompt('Enter number of days to shorten:')
    if (!days || isNaN(days) || parseInt(days) <= 0) {
      alert('Please enter a valid number of days')
      return
    }
    
    if (!confirm(`Are you sure you want to shorten this license by ${days} days?`)) return
    
    try {
      const response = await fetch(`/api/license/shorten/${licenseId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: parseInt(days) })
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchLicenses()
        fetchDashboardData()
        alert(data.message)
      } else {
        alert(data.error || 'Failed to shorten license')
      }
    } catch (error) {
      alert('Error shortening license: ' + error.message)
    }
  }

  const filteredLicenses = licenses.filter(license =>
    license.license_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    license.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-red-500/30 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-red-600 to-red-500 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
              Admin Login
            </h1>
            <p className="text-gray-400 mt-2">LoopBOTIQ License Management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none text-white"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none text-white pr-12"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-lg font-bold hover:from-red-700 hover:to-red-600 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-2">LoopBOTIQ License Management System</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Licenses', value: stats.total_licenses || 0, icon: Key, color: 'blue' },
            { title: 'Active Licenses', value: stats.active_licenses || 0, icon: Activity, color: 'green' },
            { title: 'Expired Licenses', value: stats.expired_licenses || 0, icon: Calendar, color: 'red' },
            { title: 'Activated Devices', value: stats.activated_licenses || 0, icon: Users, color: 'purple' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-600/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-500/20`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* License Management */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-600/30 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">License Management</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:from-red-700 hover:to-red-600 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Create License</span>
            </motion.button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by license key or email..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none text-white"
            />
          </div>

          {/* License Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="pb-3 text-gray-400 font-medium">License Key</th>
                  <th className="pb-3 text-gray-400 font-medium">Email</th>
                  <th className="pb-3 text-gray-400 font-medium">Status</th>
                  <th className="pb-3 text-gray-400 font-medium">Expired Date</th>
                  <th className="pb-3 text-gray-400 font-medium">Device</th>
                  <th className="pb-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLicenses.map((license) => (
                  <tr key={license.id} className="border-b border-gray-700/50">
                    <td className="py-4 text-white font-mono text-sm">{license.license_key}</td>
                    <td className="py-4 text-gray-300">{license.email}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        license.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        license.status === 'expired' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {license.status}
                      </span>
                    </td>
                    <td className="py-4 text-gray-300">
                      {new Date(license.expired_date).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-gray-300 text-sm">
                      {license.device_name || 'Not activated'}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDownloadLicense(license.license_key)}
                          className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-300"
                          title="Download License File"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleExtendLicense(license.id)}
                          className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors duration-300"
                          title="Extend License"
                        >
                          <CalendarPlus className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleShortenLicense(license.id)}
                          className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors duration-300"
                          title="Shorten License"
                        >
                          <CalendarMinus className="w-4 h-4" />
                        </motion.button>
                        {license.device_id && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeactivateLicense(license.license_key, license.device_id)}
                            className="p-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors duration-300"
                            title="Deactivate License"
                          >
                            <UserX className="w-4 h-4" />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteLicense(license.id)}
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-300"
                          title="Delete License"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create License Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-red-500/30 w-full max-w-md mx-4"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Create New License</h3>
            
            <form onSubmit={handleCreateLicense} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newLicense.email}
                  onChange={(e) => setNewLicense({...newLicense, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none text-white"
                  placeholder="Enter buyer email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expiry Date
                </label>
                <input
                  type="datetime-local"
                  value={newLicense.expired_date}
                  onChange={(e) => setNewLicense({...newLicense, expired_date: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none text-white"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-lg font-bold hover:from-red-700 hover:to-red-600 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create License'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-bold transition-colors duration-300"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

