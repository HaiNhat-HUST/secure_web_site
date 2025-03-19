export default function JobDetail(props) {
  return (
    <div className="">
      <h1 className="text-2xl font-bold text-gray-900">
        {props.company} - {props.position}
      </h1>
      <p className="mt-4 text-gray-700 text-lg leading-relaxed">{props.content}</p>
      <p className="mt-2 text-gray-700">
        <strong>Mô tả công việc:</strong> {props.jobDescription}
      </p>
      <p className="mt-2 text-gray-700">
        <strong>Mức lương:</strong> {props.salary}
      </p>
      <p className="mt-2 text-gray-700">
        <strong>Yêu cầu:</strong> {props.requirements}
      </p>
      <p className="text-sm text-gray-500 mt-4">Đăng vào: {props.postedTime}</p>
      <p className="text-sm text-blue-500 font-semibold mt-2">Trạng thái: {props.status}</p>

      {props.status === "Saved" ? (
        <div className="mt-4 flex space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Apply
          </button>
        </div>
      ) : (
        <div className="mt-4 flex space-x-4">
          <a
            href={props.cv}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Xem CV
          </a>
          <a
            href={props.coverLetter}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Xem Cover Letter
          </a>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Hủy Apply
          </button>
        </div>
      )}
    </div>
  );
}


