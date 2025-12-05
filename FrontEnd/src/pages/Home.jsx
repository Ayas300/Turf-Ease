import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import backgroundVideo from '../assets/BACKGROUND_03.mp4';
import SectionDivider from '../components/SectionDivider';
import BlogSection from '../components/BlogSection';

const Home = () => {
    const navigate = useNavigate();

    const handleFindTurfs = () => {
        navigate('/turfs');
    };

    return (
        <>
            <div className="home-container">
                <video
                    className="background-video"
                    src={backgroundVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                />
                <div className="content-overlay"></div>
                <div className="content">
                    <h1>Play Hard, Book Easy</h1>
                    <h2>Your Ultimate Turf Booking Experience</h2>
                    <p>Discover and book premium turfs across Bangladesh instantly. Perfect for football, cricket, and more - gather your team and play!</p>
                    <button className="cta-button" onClick={handleFindTurfs}>
                        FIND TURFS NEAR YOU
                    </button>
                </div>
            </div>
            <SectionDivider label={"Available Turfs"}/>
        </>
        
        
    );
};

export default Home;