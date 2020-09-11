import React from 'react';
import SearchBar from '../Jobs/SearchBar.js';
import './about.css';

const About = () => {
  return (
    <div>
      <SearchBar />
      <div className="about-sheet">
        <h1>Hello from JUMP START CAREER!</h1>
        <p>
          JUMP START CAREER is an open source web app built in the MERN
          (Mongodb, Express, React, and Node.js) stack.
        </p>
        <p>
          It's purpose is to unify the job seeking process by simplifying
          search, sending CV's, and even posting job offerings by simply
          starting a company. Under the hood it uses the Google places API to
          select cities and search by location with a 50km radius, it also uses
          SendGrid to manage the email sending whether it be for email
          verification or sending a cv, all passwords are hashed with npm Bcrypt
          when a user account is created, and a JWT is sent to you as soon as
          you log in.
        </p>
        <h2>Design Doc</h2>
        <p>
          This Application is fully functional but a lot of work needs to be
          done to make it fully usable as soon as its code has been optimised.
        </p>
        <p>
          <span>1.</span> We need to give our users the ability to update their
          information and profile picture as well as their company information,
          and the ability to deactivate their accounts. this feature already has
          the routed ready in its REST API, but has no front end functionality.
          Extra routes must be created in the React Router to handle such
          requests from the User.
        </p>
        <p>
          <span>2.</span> The app needs to have an Administrator panel to allow
          the Job posts to be reviewed before posting, Deleting Users, and any
          form of spam, this feature can be implimented by simply adding a
          mongoose Model that extends the User model.
        </p>
        <p>
          <span>3.</span> We need to grant every user with the ability to view a
          company's profile, and view all the positions that are avalable. with
          the advantage to rate the company if that given company has accepted
          the user for that role. Users should not be given the ability to rate
          the company without at least 3 weeks of working there.
        </p>
        <p>
          <span>4.</span> When a user applied to a position, the company will
          then have the option to add that user as an employer to the company,
          so that with time, JUMP START CAREER will not anly be a tool our
          cloents use to find or post jobs, but also an application that is
          built to manage companies all accross the globe.
        </p>
        <p>
          <span>5.</span> Last but not least, with many companies useing JUMP
          START CAREER as a software to manage work, every company should be
          given the ability to separately Deploy their own Flavour of this App
          to which ever cloud provider they choose for trust and security
          purposes.
        </p>
        <h3>
          Before All these features can be implimented, a major change to the UI
          must be made, to make this open source web app highly customisable.
        </h3>
        <div className="search-bar">
          <div className="wrap footer">
            <p className="jump-start-your-career">Atomic Code &#169;</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
