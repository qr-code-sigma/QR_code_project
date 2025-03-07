import React from "react";
import "./profilePage.css";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import Footer from "../../components/Footer/Footer.jsx";
import {useSelector} from "react-redux";

function ProfilePage() {

  const { userData } = useSelector(state => state.auth)
  console.log(userData);
  return (
    <div className="profile-page-container">
      <ProfileHeader name={userData.first_name} surname={userData.last_name} />
      <main className="profile-main-content">
        <section className="profile-info">
          <div className="status">
            Status: <span className='status'>{userData.status}</span>
          </div>
          <div className="email">
            Email: <span>{userData.email}</span>
          </div>
        </section>
        <section className="to-settings">
          <button className="btn-settings">
            <span>Settings</span>
          </button>
        </section>
        <section className="registered-events-search-container">
          <h2>Events you are registered for</h2>
          <form action="" className="search-form">
            <input
              type="text"
              placeholder="Search"
              className="search-bar"
              required
            />
            <button className="bnt-search">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </section>
        {/*<Events />*/}
      </main>
      <Footer />
    </div>
  );
}

export default ProfilePage;
