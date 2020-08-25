import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dispatchCVToBD } from '../../store/actions/userActions.js';
import '../Signup-and-Login/signup.css';
import documentIcon from '../../images/document-image.png';

class Apply extends Component {
  state = {
    popUpErrorMessage: false,
    popUpMessage: false,
    additionalInfo: null,
    formData: null,
    _id: null,
    firstName: null,
    lastName: null,
    emailApplicant: null,
  };

  inputChangeHandler = (e) => {
    this.setState({
      additionalInfo: e.target.value,
    });
  };

  //cv handler
  selectImageHandler = (e) => {
    const file = e.target.files[0];
    if (!file.name.match(/^(.(?!.*\.pdf$))*$/)) {
      const formData = new FormData();
      formData.append('inpFile', file);

      this.setState({
        formData: formData,
        _id: this.props.userAccount._id,
        firstName: this.props.userAccount.firstName,
        lastName: this.props.userAccount.lastName,
        emailApplicant: this.props.userAccount.email,
      });
    }
  };

  submitCVHandler = async (e) => {
    e.preventDefault();
    if (this.state.formData) {
      this.setState({
        popUpMessage: true,
      });
    } else {
      this.setState({
        popUpNoCvErrorMessage: true,
      });
    }
  };

  completedApplyingHandler = (e) => {
    e.preventDefault();
    this.props.dispatchCV(this.state);
  };

  render() {
    return (
      <div>
        {this.props.userAccount ? (
          <div className="form-container">
            <div className="form-inner-comtainer">
              <form
                className="white-background main-form"
                onSubmit={this.submitCVHandler}
                method="post"
                encType="multipart/form-data"
                action="/upload"
              >
                <div>
                  <h1 className="form-title">Apply to Job</h1>
                </div>
                {this.state.popUpNoCvErrorMessage ? (
                  <div className="error-box">
                    <p>Please attach your cv of type PDF.</p>
                  </div>
                ) : null}
                <div className="profile-picture-input">
                  <br></br>
                  <h2>Upload Your cv of type PDF here:</h2>
                  <br></br>
                  <br></br>
                  <label className="custom-file-upload">
                    <input
                      type="file"
                      name="inpFile"
                      id="inpFile"
                      onChange={this.selectImageHandler}
                      className="input-avatar"
                    />
                    Attach your CV
                  </label>

                  {this.state.formData ? (
                    <div className="image-preview" id="imagePreview">
                      <img src={documentIcon} alt="" id="document-image" />
                    </div>
                  ) : (
                    <div className="image-preview" id="imagePreview">
                      <img alt="" className="image-preview__image" />
                      <span className="image-preview__default-text">CV</span>
                    </div>
                  )}
                </div>
                <button className="signup-login-button">Submit</button>
              </form>
            </div>
            {this.state.popUpMessage ? (
              <div id="verification-popUp">
                <div id="popUp">
                  <form
                    onSubmit={this.completedApplyingHandler}
                    id="inner-popUp"
                  >
                    <h2>Your cv has Succussfully sent!</h2>
                    <button className="continue-button">Continue</button>
                  </form>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userAccount: state.auth.userAccount,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatchCV: (formState) => {
      dispatch(dispatchCVToBD(formState, ownProps));
      ownProps.history.push('/');
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Apply);
