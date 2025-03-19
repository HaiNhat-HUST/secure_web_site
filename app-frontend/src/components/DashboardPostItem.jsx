

export default function DashboardPostItem() {
  return(
    <li className="cursor-pointer p-4 bg-white rounded-lg shadow-md hover:bg-gray-50 transition flex justify-between items-center border border-gray-200">
      <div className="flex items-center gap-3">
      <div className="w-16 h-16 flex justify-center items-center rounded-lg overflow-hidden">
        <img
          src="/public/vnpt.png"
          alt="Viettel Logo"
          className="w-full h-full object-contain"
        />
      </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">viettel</h1>
          <h2 className="text-sm text-gray-600">pentester</h2>
          <p className="text-xs text-blue-500 font-semibold">processing</p>
        </div>
      </div>
      <div className="text-xs text-gray-500">
        13-03-2004
      </div>
    </li>

    
  )
}