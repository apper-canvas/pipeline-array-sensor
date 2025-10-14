import { useNavigate } from "react-router-dom"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-8xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent opacity-20">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-full p-6">
              <ApperIcon name="Search" className="h-12 w-12 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Page Not Found
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/")}
            variant="primary"
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Home" size={16} />
            <span>Go to Dashboard</span>
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="flex items-center space-x-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            <span>Go Back</span>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Or try one of these:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <button
              onClick={() => navigate("/contacts")}
              className="flex items-center space-x-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ApperIcon name="Users" size={16} className="text-primary-600" />
              <span>View Contacts</span>
            </button>
            <button
              onClick={() => navigate("/pipeline")}
              className="flex items-center space-x-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ApperIcon name="GitBranch" size={16} className="text-primary-600" />
              <span>View Pipeline</span>
            </button>
            <button
              onClick={() => navigate("/activities")}
              className="flex items-center space-x-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ApperIcon name="Activity" size={16} className="text-primary-600" />
              <span>View Activities</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound