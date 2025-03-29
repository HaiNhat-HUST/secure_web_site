import React, { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

function Profile({ user }) {
  if (!user) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <>
      <Header />
      <main className="profile-page">
        <section className="relative block h-64 bg-cover bg-center" style={{ backgroundImage: `url(${user.backgroundImage})` }}>
          <span className="absolute w-full h-full bg-black opacity-50"></span>
        </section>
        <section className="relative bg-gray-300 py-16">
          <div className="container mx-auto px-4">
            <div className="-mt-32 w-full bg-white shadow-xl rounded-lg p-6 text-center">
              <img className="mx-auto w-32 h-32 rounded-full shadow-md" src={user.imageUrl} alt={user.altText} />
              <h3 className="mt-4 text-2xl font-semibold">{user.name}</h3>
              <p className="text-gray-500">{user.jobTitle} - {user.location}</p>
              <p className="mt-2 text-gray-700">{user.description}</p>
              <button className="mt-4 px-4 py-2 bg-pink-500 text-white rounded shadow hover:bg-pink-600">Connect</button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setUser({
        backgroundImage: "/hero-img.png",
        imageUrl: "/team-1.png",
        altText: "Mia Taylor",
        name: "Mia Taylor",
        location: "New York City, NY",
        jobTitle: "Director - Museum of Modern Art",
        description: "🎨 Art enthusiast creating vibrant masterpieces!",
      });
    }, 1000);
  }, []);

  return <Profile user={user} />;
}
