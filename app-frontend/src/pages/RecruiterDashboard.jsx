export default function () {
  return (
  <>
    <div class="flex h-screen">
        <div class="flex-1 p-6">
            
            <div class="grid grid-cols-4 gap-4">
                <div class="bg-white p-4 rounded-lg shadow-md text-center">
                    <h3 class="text-lg font-semibold">Tổng bài đăng</h3>
                    <p class="text-2xl font-bold">15</p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-md text-center">
                    <h3 class="text-lg font-semibold">Ứng viên</h3>
                    <p class="text-2xl font-bold">120</p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-md text-center">
                    <h3 class="text-lg font-semibold">Chờ phỏng vấn</h3>
                    <p class="text-2xl font-bold">30</p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-md text-center">
                    <h3 class="text-lg font-semibold">Đã tuyển</h3>
                    <p class="text-2xl font-bold">10</p>
                </div>
            </div>
            
            
            <div class="mt-6 bg-white p-4 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold mb-3">Bài tuyển dụng gần đây</h3>
                <table class="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr class="bg-gray-200">
                            <th class="p-2 border">Tiêu đề</th>
                            <th class="p-2 border">Ngày đăng</th>
                            <th class="p-2 border">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="p-2 border">Fullstack Developer</td>
                            <td class="p-2 border">12/03/2025</td>
                            <td class="p-2 border text-green-600">Đang mở</td>
                        </tr>
                        <tr>
                            <td class="p-2 border">Backend Engineer</td>
                            <td class="p-2 border">10/03/2025</td>
                            <td class="p-2 border text-red-600">Đã đóng</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  
  </>
  )
}