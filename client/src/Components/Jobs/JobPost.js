import React, { Component } from 'react';
import { connect } from 'react-redux';
import { _arrayBufferToBase64 } from '../../SettingsAndImageProcessors/_arrayBufferToBase64';
import { getJobDetailsFromDB } from '../../store/actions/jobActions.js';
import defaultCompanyImage from '../../images/PRIVATE-LIMITE.jpg';

class JobPost extends Component {
  //state of the apply or delete button

  DisplayImageHandler = () => {
    let companyPictureBuffer = null;
    let companyPicture = null;
    console.log('gooood booooy');
    if (this.props.jobPostDetails.job.companyAvatar) {
      //getting the image buffer from jobs list array
      companyPictureBuffer = this.props.jobPostDetails.job.companyAvatar.data;
      //injecting the company picture into the src for the img tag
      companyPicture = `data:image/jpg;base64,${_arrayBufferToBase64(
        companyPictureBuffer
      )}`;
    }
    return (
      <div>
        <img id="companyImage" src={companyPicture} />
      </div>
    );
  };

  //if applying to job and authenticated, take me to apply pageXOffset, else take me to sign up page
  applyToJobClickHandler = () => {
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

  componentWillMount() {
    this.props.getJobPostDetails(this.props);
  }
  componentDidMount() {
    this.props.getJobPostDetails(this.props);
  }
  ApplyButtonLogicalComponent = () => {
    if (this.props.jobPostDetails.companyInfo._id) {
      if (this.props.jobPostDetails.buttonState.applyButton) {
        return (
          <div className="apply-to-job" onClick={this.applyToJobClickHandler}>
            Apply Now
          </div>
        );
      }
      if (this.propsjobPostDetails.buttonState.AlreadyApplied) {
        return <div className="already-applied-button">Applied</div>;
      }
      if (this.props.jobPostDetails.buttonState.deleteJobPostButton) {
        return <div className="apply-to-job">Delete Jop Post</div>;
      }
      return this;
    }
    return this;
  };

  render() {
    let num = 1;
    console.log(this.props);

    return (
      <div className="job-post jobPost-details">
        <div id="company-info">
          {this.props.jobPostDetails.job.companyAvatar ? (
            <this.DisplayImageHandler />
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
          {this.props.jobPostDetails?.buttonState?.signUp ? (
            <div className="apply-to-job" onClick={this.applyToJobClickHandler}>
              Apply Now
            </div>
          ) : null}
          {this.props.jobPostDetails?.buttonState?.AlreadyApplied ? (
            <div className="already-applied-button">Applied</div>
          ) : null}
          {this.props.jobPostDetails?.buttonState?.deleteJobPostButton ? (
            <div className="apply-to-job">Delete Jop Post</div>
          ) : null}
        </div>
      </div>
    );
  }
}

// {showApplyButton ? (
//   <div className="apply-to-job" onClick={this.applyToJobClickHandler}>
//     Apply Now
//   </div>
// ) : (
//   <div className="delete-job-post">Delete Job Post</div>
// )}

const mapStateToProps = (state, ownProps) => {
  return {
    jobPostDetails: state.job.jobPostDetails,
    userAccount: state.auth.userAccount,
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getJobPostDetails: (state) => {
      dispatch(getJobDetailsFromDB(ownProps, state));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(JobPost);
