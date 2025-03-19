import { useState } from "react";
import DashboardPostItem from "../components/DashboardPostItem";

const posts = {
    1: { 
        company: "Viettel", 
        position: "Pentester", 
        postedTime: "2 days ago", 
        content: "Chi tiết công việc cho Pentester tại Viettel.",
        jobDescription: "Kiểm thử bảo mật hệ thống, phát hiện lỗ hổng.",
        salary: "$2000 - $3000", 
        requirements: "Có kinh nghiệm về pentesting, thành thạo Burp Suite, Metasploit.",
        cv: "CV_pentester_viettel.pdf", 
        coverLetter: "CoverLetter_viettel.pdf",
        status: "Đang xử lý"
    },
    2: { 
        company: "VNPT", 
        position: "Security Analyst", 
        postedTime: "1 week ago", 
        content: "VNPT đang tuyển Security Analyst với nhiều cơ hội hấp dẫn.",
        jobDescription: "Phân tích bảo mật, xử lý sự cố an ninh mạng.",
        salary: "$1800 - $2500", 
        requirements: "Có kinh nghiệm về SOC, SIEM, Threat Intelligence.",
        cv: "CV_security_analyst_vnpt.pdf", 
        coverLetter: "CoverLetter_vnpt.pdf",
        status: "Hẹn phỏng vấn"
    },
    3: { 
        company: "FPT", 
        position: "Red Team Specialist", 
        postedTime: "3 days ago", 
        content: "FPT cần tuyển Red Team Specialist để kiểm thử bảo mật hệ thống.",
        jobDescription: "Tấn công mô phỏng để đánh giá bảo mật hệ thống.",
        salary: "$2200 - $3500", 
        requirements: "Kinh nghiệm Red Team, sử dụng tốt Kali Linux, Cobalt Strike.",
        cv: "CV_redteam_fpt.pdf", 
        coverLetter: "CoverLetter_fpt.pdf",
        status: "Đợi kết quả"
    }
};

export default function Dashboard() {
    const [selectedPost, setSelectedPost] = useState(null);

    return (
        <div className="flex h-screen bg-gray-100">

            {/* Sidebar Danh sách bài post */}
            
            <div className="w-1/3 bg-white p-4 shadow-lg overflow-auto border-r border-gray-300">
                <div className="flex space-x-4">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 underline">Apply jobs</h2>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 underline">Saved jobs</h2>
                </div>
                
                <ul className="space-y-3">
                    {Object.entries(posts).map(([id, post]) => (
                        <DashboardPostItem 
                        company={post.company} 
                        position={post.position}
                        statuss={post.status}
                        postedTime={post.postedTime}
                        onClick={() => setSelectedPost(post)}
                        />
                    ))}
                </ul>
            </div>
            
            {/* Nội dung bài post */}
            <div className="w-2/3 p-6 flex flex-col ">
                {selectedPost ? (
                    <div className="">
                        <h1 className="text-2xl font-bold text-gray-900">{selectedPost.company} - {selectedPost.position}</h1>
                        <p className="mt-4 text-gray-700 text-lg leading-relaxed">{selectedPost.content}</p>
                        <p className="mt-2 text-gray-700"><strong>Mô tả công việc:</strong> {selectedPost.jobDescription}</p>
                        <p className="mt-2 text-gray-700"><strong>Mức lương:</strong> {selectedPost.salary}</p>
                        <p className="mt-2 text-gray-700"><strong>Yêu cầu:</strong> {selectedPost.requirements}</p>
                        <p className="text-sm text-gray-500 mt-4">Đăng vào: {selectedPost.postedTime}</p>
                        <p className="text-sm text-blue-500 font-semibold mt-2">Trạng thái: {selectedPost.status}</p>

                        <div className="mt-4 flex space-x-4">
                            <a href={selectedPost.cv} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Xem CV</a>
                            <a href={selectedPost.coverLetter} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Xem Cover Letter</a>
                            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Hủy Apply</button>
                        </div>
                    </div>
                ) : (
                    <h1 className="text-xl font-semibold text-gray-700">Chọn một bài viết để xem chi tiếttt</h1>
                    
                )}
            </div>
        </div>
    );
}
