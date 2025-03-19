import { useState } from "react";
import DashboardPostItem from "../components/Dashboard/PostItem";
import PostDetail from "../components/Dashboard/PostDetail";

// về sau thay data bằng việc fetch dữ liệu từ api
const appliedPosts = {
    1: {
        company: "Google",
        position: "Software Engineer",
        status: "Applied",
        postedTime: "2025-03-01",
        content: "Google is looking for a talented Software Engineer to join our team in Mountain View, CA.",
        jobDescription: "Develop and maintain scalable web applications using modern technologies like React and Node.js. Collaborate with cross-functional teams to define, design, and ship new features. Optimize application performance and scalability.",
        salary: "$120,000 - $150,000",
        requirements: "3+ years experience in software development. Proficiency in JavaScript, React, and Node.js. Experience with cloud platforms like AWS or GCP.",
        cv: "https://example.com/cv.pdf",
        coverLetter: "https://example.com/cover_letter.pdf"
    },
    2: {
        company: "Microsoft",
        position: "Cloud Security Engineer",
        status: "Under Review",
        postedTime: "2025-02-28",
        content: "We are seeking a Cloud Security Engineer to enhance our cloud security posture.",
        jobDescription: "Design and implement cloud security controls to protect customer data. Conduct security assessments and penetration testing. Collaborate with development teams to embed security best practices.",
        salary: "$130,000 - $160,000",
        requirements: "5+ years experience in cloud security. Proficiency in Azure, Kubernetes security, and IAM.",
        cv: "https://example.com/cv.pdf",
        coverLetter: "https://example.com/cover_letter.pdf"
    },
    3: {
        company: "Apple",
        position: "iOS Developer",
        status: "Interview Scheduled",
        postedTime: "2025-03-02",
        content: "Join Apple’s iOS development team to create innovative mobile applications.",
        jobDescription: "Develop high-quality iOS applications using Swift and Objective-C. Work closely with UX/UI designers to implement engaging user interfaces.",
        salary: "$125,000 - $155,000",
        requirements: "Strong experience in iOS development. Familiarity with Swift, Objective-C, and Xcode.",
        cv: "https://example.com/cv.pdf",
        coverLetter: "https://example.com/cover_letter.pdf"
    },
    4: {
        company: "Tesla",
        position: "Embedded Systems Engineer",
        status: "Applied",
        postedTime: "2025-03-04",
        content: "Tesla is hiring an Embedded Systems Engineer to develop automotive software.",
        jobDescription: "Design and develop embedded software for vehicle systems. Work on real-time operating systems and firmware development.",
        salary: "$135,000 - $165,000",
        requirements: "Experience with C/C++, RTOS, and embedded system development.",
        cv: "https://example.com/cv.pdf",
        coverLetter: "https://example.com/cover_letter.pdf"
    },
    5: {
        company: "IBM",
        position: "Cybersecurity Analyst",
        status: "Applied",
        postedTime: "2025-02-26",
        content: "IBM Security is hiring a Cybersecurity Analyst to monitor and protect enterprise networks.",
        jobDescription: "Analyze security threats and incidents. Implement security solutions to prevent cyber attacks.",
        salary: "$110,000 - $140,000",
        requirements: "Experience in SIEM, network security, and threat intelligence.",
        cv: "https://example.com/cv.pdf",
        coverLetter: "https://example.com/cover_letter.pdf"
    }
};
const savedPosts = {
    1: {
        company: "Amazon",
        position: "DevOps Engineer",
        status: "Saved",
        postedTime: "2025-03-05",
        content: "Amazon Web Services (AWS) is hiring a DevOps Engineer to automate and optimize cloud infrastructure.",
        jobDescription: "Implement CI/CD pipelines for cloud applications. Automate infrastructure deployment with Terraform and Ansible. Monitor and enhance cloud system reliability.",
        salary: "$110,000 - $140,000",
        requirements: "3+ years experience in DevOps. Knowledge of AWS, Kubernetes, and Terraform.",
        cv: "",
        coverLetter: ""
    },
    2: {
        company: "Facebook (Meta)",
        position: "AI Research Scientist",
        status: "Saved",
        postedTime: "2025-02-25",
        content: "Meta is looking for an AI Research Scientist to develop cutting-edge AI models.",
        jobDescription: "Conduct AI research in NLP and computer vision. Develop and optimize machine learning models for large-scale applications.",
        salary: "$140,000 - $180,000",
        requirements: "PhD in AI/ML or related field. Strong background in deep learning frameworks like TensorFlow and PyTorch.",
        cv: "",
        coverLetter: ""
    },
    3: {
        company: "Netflix",
        position: "Backend Engineer",
        status: "Saved",
        postedTime: "2025-03-07",
        content: "Netflix is hiring a Backend Engineer to develop scalable streaming services.",
        jobDescription: "Build and optimize backend services for content streaming. Work with microservices architecture and cloud computing.",
        salary: "$130,000 - $170,000",
        requirements: "Experience with Java, Spring Boot, and distributed systems.",
        cv: "",
        coverLetter: ""
    },
    4: {
        company: "Twitter",
        position: "Data Scientist",
        status: "Saved",
        postedTime: "2025-03-06",
        content: "Twitter’s Data Science team is looking for a Data Scientist to analyze social media trends.",
        jobDescription: "Develop data-driven insights to improve user engagement. Utilize machine learning models for predictive analysis.",
        salary: "$125,000 - $160,000",
        requirements: "Strong experience in Python, SQL, and machine learning techniques.",
        cv: "",
        coverLetter: ""
    },
    5: {
        company: "SpaceX",
        position: "Avionics Engineer",
        status: "Saved",
        postedTime: "2025-03-08",
        content: "Join SpaceX’s Avionics Engineering team to design spacecraft electronics.",
        jobDescription: "Develop and test avionics systems for rockets and spacecraft. Work on embedded software and real-time systems.",
        salary: "$140,000 - $180,000",
        requirements: "Experience in embedded systems, PCB design, and aerospace engineering.",
        cv: "",
        coverLetter: ""
    }
};


export default function Dashboard() {
    const [selectedTab, setSelectedTab] = useState("applied")
    const [selectedPost, setSelectedPost] = useState(null);

    const posts = selectedTab === "applied" ? appliedPosts : savedPosts;

    return (
        <div className="flex h-screen bg-gray-100">
            {/*Danh sách bài post */}
            <div className="w-1/3 bg-white p-4 shadow-lg overflow-auto border-r border-gray-300">
                <div className="flex space-x-4 mb-4">
                    <button 
                        className={`text-xl font-semibold ${selectedTab === "applied" ? "text-blue-600 underline" : "text-gray-800"}`} 
                        onClick={() => setSelectedTab("applied")}
                    >
                        Apply jobs
                    </button>
                    <button 
                        className={`text-xl font-semibold ${selectedTab === "saved" ? "text-blue-600 underline" : "text-gray-800"}`} 
                        onClick={() => setSelectedTab("saved")}
                    >
                        Saved jobs
                    </button>
                </div>

                {/* load từng bài post vào danh sách */}
                <ul className="space-y-3">
                    {Object.entries(posts).map(([id, post]) => (
                        <DashboardPostItem 
                        company={post.company} 
                        position={post.position}
                        status={post.status}
                        postedTime={post.postedTime}
                        onClick={() => setSelectedPost(post)}
                        />
                    ))}
                </ul>
            </div>

            {/* Nội dung bài post */}
            <div className="w-2/3 p-6 flex flex-col ">
                {selectedPost ? (
                    <PostDetail 
                        company={selectedPost.company}
                        position={selectedPost.position}
                        content={selectedPost.content}
                        salary={selectedPost.salary}
                        requirements={selectedPost.requirements}
                        postedTime={selectedPost.postedTime}
                        status={selectedPost.status}
                        cv={selectedPost.cv}
                        coverLetter={selectedPost.coverLetter}
                    />
                ) : (
                    <h1 className="text-xl font-semibold text-gray-700">Chọn một bài viết để xem chi tiết</h1>
                )}
            </div>
        </div>
    );
}
