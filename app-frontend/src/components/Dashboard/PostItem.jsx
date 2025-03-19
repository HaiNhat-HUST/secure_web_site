export default function DashboardPostItem(props) {
  return(
    <li className="cursor-pointer p-4 bg-white rounded-lg shadow-md hover:bg-gray-50 transition flex justify-between items-center border border-gray-200"
    onClick={props.onClick}>
      <div className="flex items-center gap-3">
      <div className="w-16 h-16 flex justify-center items-center rounded-lg overflow-hidden">
        <img
          src="/vnpt.png"
          alt="Viettel Logo"
          className="w-full h-full object-contain"
        />
      </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">{props.company}</h1>
          <h2 className="text-sm text-gray-600">{props.position}</h2>
          <p className="text-xs text-blue-500 font-semibold">{props.status}</p>
        </div>
      </div>
      <div className="text-xs text-gray-500">
        {props.postedTime}
      </div>
    </li>
  )
}