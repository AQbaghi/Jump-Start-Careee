import React, { Component } from 'react';
import { connect } from 'react-redux';
import { _arrayBufferToBase64 } from '../../SettingsAndImageProcessors/_arrayBufferToBase64';
import { getJobDetailsFromDB } from '../../store/actions/jobActions.js';
import defaultCompanyImage from '../../images/PRIVATE-LIMITE.jpg';

let applied = false;
let showApplyButton = true;

class JobPost extends Component {
  componentDidMount() {
    this.props.getJobPostDetails();
  }

  //if applying to job and authenticated, take me to apply pageXOffset, else take me to sign up page
  applyToJobClickHandler = () => {
    console.log(this.props.userAccount);
    if (this.props.userAccount) {
      if (this.props.userAccount.email) {
        this.props.history.push('/apply/' + this.props.match.params._id);
      } else {
        this.props.history.push('/Signup');
      }
    } else {
      this.props.history.push('/Signup');
    }
  };

  //this component is the applied, apply to job and and delete job post logic
  ApplyButtonComponent = () => {
    if (applied) {
      return <div className="already-applied-button">Already Applied</div>;
    } else {
      return (
        <div>
          {showApplyButton ? (
            <div className="apply-to-job" onClick={this.applyToJobClickHandler}>
              Apply Now
            </div>
          ) : (
            <div className="delete-job-post">Delete Job Post</div>
          )}
        </div>
      );
    }
  };

  render() {
    let num = 1;

    //chexk if apply to job button should show up, or delete job post button should
    if (this.props.userAccount.companyInfo) {
      if (
        this.props.jobPostDetails.companyInfo._id ===
        this.props.userAccount.companyInfo._id
      ) {
        showApplyButton = false;
      }
    }

    //check if this job has been previously applies to by user
    if (this.props.userAccount.jobsAppliedTo) {
      applied = this.props.userAccount.jobsAppliedTo.map((jobAppliedo) => {
        if (jobAppliedo.jobId === this.props.jobPostDetails.job._id) {
          return true;
        }
      });
    }

    let companyPictureBuffer = null;
    let companyPicture = null;
    if (this.props.jobPostDetails.job.companyAvatar) {
      //getting the image buffer from jobs list array
      companyPictureBuffer = this.props.jobPostDetails.job.companyAvatar.data;
      //injecting the company picture into the src for the img tag
      companyPicture = `data:image/jpg;base64,${_arrayBufferToBase64(
        companyPictureBuffer
      )}`;
    }

    return (
      <div className="job-post jobPost-details">
        <div id="company-info">
          {this.props.jobPostDetails.job.companyAvatar ? (
            <img id="companyImage" src={companyPicture} />
          ) : (
            <img id="companyImage" src={defaultCompanyImage} />
          )}
          <h2>{this.props.jobPostDetails.job.companyName}</h2>
          {this.props.jobPostDetails.job.location ? (
            <h3 className="location">
              {this.props.jobPostDetails.job.location}
            </h3>
          ) : null}
        </div>
        <div id="jobPost-info">
          <h1 id="jobTitle-jobPost">
            {this.props.jobPostDetails.job.jobTitle}
          </h1>
          <h3>Description:</h3>
          <p>{this.props.jobPostDetails.job.jobDescription}</p>
          <h3>Salary:</h3>
          <p>{this.props.jobPostDetails.job.salary}</p>
          {this.props.jobPostDetails.job.requiredSkills[0] ? (
            <div>
              <h3>Required Skills:</h3>
              <ul>
                {this.props.jobPostDetails.job.requiredSkills.map(
                  (requiredSkill) => (
                    <li key={num++}>{requiredSkill}</li>
                  )
                )}
              </ul>
            </div>
          ) : null}
          {this.props.jobPostDetails.job.responsabilities[0] ? (
            <div className="skills-list">
              <h3>responsabilities:</h3>
              <ul>
                {this.props.jobPostDetails.job.responsabilities.map(
                  (responsability) => (
                    <li key={num++}>{responsability}</li>
                  )
                )}
              </ul>
            </div>
          ) : null}
          {this.props.jobPostDetails.job.advantages[0] ? (
            <div className="skills-list">
              <h3>advantages:</h3>
              <ul>
                {this.props.jobPostDetails.job.advantages.map((advantage) => (
                  <li key={num++}>{advantage}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <p>Postted at: {this.props.jobPostDetails.job.createdAt}</p>

          <this.ApplyButtonComponent />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    jobPostDetails: state.job.jobPostDetails,
    userAccount: state.auth.userAccount,
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getJobPostDetails: () => {
      dispatch(getJobDetailsFromDB(ownProps));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(JobPost);
