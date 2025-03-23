import React, { useState, useEffect } from "react";
import ShowMoreText from "react-show-more-text";
import Navbar from "../components/Navbar.jsx"; // Assuming you have this
import Footer from "../components/Footer.jsx"; // Assuming you have this

// --- Sub-components ---

function ProfileBanner({ backgroundImage }) {
  return (
    <section className="relative block h-[500px]">
      <div
        className="absolute top-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <span className="absolute w-full h-full bg-black opacity-50"></span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 w-full h-[70px] overflow-hidden pointer-events-none">
        <svg
          className="absolute bottom-0 overflow-hidden"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          version="1.1"
          viewBox="0 0 2560 100"
          x="0"
          y="0"
        >
          <polygon className="fill-current text-gray-300" points="2560 0 2560 100 0 100" />
        </svg>
      </div>
    </section>
  );
}

function ProfileImage({ imageUrl, altText }) {
  return (
    <div className="relative">
      <img
        alt={altText}
        src={imageUrl}
        className="absolute -m-16 -ml-20 h-auto w-[150px] max-w-[150px] rounded-full border-none shadow-xl lg:-ml-16"  // Removed inline style, added w-32 for width
      />
    </div>
  );
}

function ConnectButton() {
  return (
    <button
      className="mb-1 rounded bg-pink-500 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear active:bg-pink-600 hover:shadow-md focus:outline-none sm:mr-2"
      type="button"
    >
      Connect
    </button>
  );
}

function StatsItem({ count, label }) {
  return (
    <div className="mr-4 p-3 text-center">
      <span className="block text-xl font-bold uppercase tracking-wide text-gray-700">
        {count}
      </span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}

function ProfileStats({ friendsCount, photosCount, commentsCount }) {
  return (
    <div className="flex justify-center py-4 pt-8 lg:pt-4">
      <StatsItem count={friendsCount} label="Friends" />
      <StatsItem count={photosCount} label="Photos" />
      <StatsItem count={commentsCount} label="Comments" />
    </div>
  );
}

function ProfileInfo({ name, location, jobTitle, education }) {
  return (
    <div className="mt-12 text-center">
      <h3 className="mb-2 text-4xl font-semibold leading-normal text-gray-800">
        {name}
      </h3>
      <div className="mb-2 mt-0 text-sm font-bold uppercase leading-normal text-gray-500">
        <i className="fas fa-map-marker-alt mr-2 text-lg text-gray-500"></i>{" "}
        {location}
      </div>
      <div className="mb-2 mt-10 text-gray-700">
        <i className="fas fa-briefcase mr-2 text-lg text-gray-500"></i>
        {jobTitle}
      </div>
      <div className="mb-2 text-gray-700">
        <i className="fas fa-university mr-2 text-lg text-gray-500"></i>
        {education}
      </div>
    </div>
  );
}

function ProfileDescription({ description, onShowMoreToggle }) {
    const [expanded, setExpanded] = useState(false);

    const handleShowMoreClick = () => {
      setExpanded(!expanded); //toggle
      onShowMoreToggle(!expanded);
    }

  return (
    <div className="mt-10 border-t border-gray-300 py-10 text-center">
      <div className="flex flex-wrap justify-center">
        <div className="w-full px-4 lg:w-9/12">
          <p className="mb-4 text-lg leading-relaxed text-gray-800">
            {description}
          </p>
          <ShowMoreText
            lines={3}
            more="Show more"
            less="Show less"
            className="flex items-center justify-center text-pink-500"
            anchorClass="show-more-less-clickable"
            onClick={handleShowMoreClick}
            expanded={expanded}
            truncatedEndingComponent={"... "}
          >
            Learn More
          </ShowMoreText>
        </div>
      </div>
    </div>
  );
}

// --- Main Profile Component ---

export default function Profile() {
  // Sample data (replace with API call)
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching data (replace with your actual API call)
    const fetchData = async () => {
      try {
        // const response = await fetch("/api/user/profile"); // Example endpoint
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // const data = await response.json();
        // setUserData(data);
         // Simulate API call after some seconds
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        const data = {
          backgroundImage: "/hero-img.png",
          imageUrl: "/team-1.png",
          altText: "Mia Taylor",
          name: "Mia Taylor",
          location: "New York City, New York",
          jobTitle: "Director - Museum of Modern Art",
          education: "Bachelor of Fine Arts @ The School of Visual Arts",
          friendsCount: 22,
          photosCount: 10,
          commentsCount: 89,
          description:
            "Hey there! 🎨 I'm Mia, your friendly neighborhood art enthusiast with a palette full of dreams and a paintbrush that dances to its own beat. From canvas to chaos, I turn everyday inspirations into vibrant masterpieces. When I'm not lost in the world of colors, you can catch me chasing sunsets, sipping on creativity, and living life one brushstroke at a time. Let's create a canvas of memories together! 🌈✨ #ArtisticAdventures",
        };
        setUserData(data);

      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


     const handleShowMoreToggle = (isExpanded) => {
        console.log("ShowMoreText expanded:", isExpanded);
    };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>; // Simple loading indicator
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error.message}</div>; // Display error
  }

  if (!userData) {
    return null; // Or a "No data found" message
  }

  return (
    <>
      <Navbar transparent />
      <main className="profile-page">
        <ProfileBanner backgroundImage={userData.backgroundImage} />
        <section className="relative bg-gray-300 py-16">
          <div className="container mx-auto px-4">
            <div className="-mt-64 w-full rounded-lg bg-white shadow-xl relative flex min-w-0 flex-col break-words">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="flex w-full justify-center px-4 lg:order-2 lg:w-3/12">
                    <ProfileImage imageUrl={userData.imageUrl} altText={userData.altText} />
                  </div>
                  <div className="w-full px-4 lg:order-3 lg:w-4/12 lg:self-center lg:text-right">
                    <div className="mt-32 px-3 py-6 sm:mt-0">
                      <ConnectButton />
                    </div>
                  </div>
                  <div className="w-full px-4 lg:order-1 lg:w-4/12">
                    <ProfileStats
                      friendsCount={userData.friendsCount}
                      photosCount={userData.photosCount}
                      commentsCount={userData.commentsCount}
                    />
                  </div>
                </div>
                <ProfileInfo
                  name={userData.name}
                  location={userData.location}
                  jobTitle={userData.jobTitle}
                  education={userData.education}
                />
                <ProfileDescription description={userData.description} onShowMoreToggle={handleShowMoreToggle}/>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}