export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 px-6 text-center shadow-lg">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">EmployMee</h2>
        <p className="text-sm">Số 1, Đại Cồ Việt, Hai Bà Trưng, Hà Nội </p>
        <p className="text-sm">Email: duyha@employmee.com | Phone: +123 456 789</p>
      </div>
      <p className="text-sm">&copy; {new Date().getFullYear()} EmployMee. All rights reserved.</p>
    </footer>
  );
}