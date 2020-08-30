//add pagination details here

export const getJobsFromDB = (ownProps) => {
  return async (dispatch, getState) => {
    const jobsPromise = await fetch(
      `/api/job/all-job${ownProps.location.search}`
    );
    const jobs = await jobsPromise.json();
    dispatch({ type: 'GET_JOBS', jobs: jobs });
  };
};

export const getMyCompanyJobsFromDB = (owner) => {
  return async (dispatch, getState) => {
    const jobsPromise = await fetch(`/api/job/my-jobs`, {
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
        Authorization: document.cookie.replace('token=', 'Bearer '),
      },
      method: 'POST',
      body: JSON.stringify({
        _id: owner,
      }),
    });
    const jobs = await jobsPromise.json();

    dispatch({ type: 'GET_MY_JOBS', jobs: jobs });
  };
};

export const getJobDetailsFromDB = (ownProps, state) => {
  return async (dispatch, getState) => {
    const jobPromise = await fetch(
      `/api/job/info/${ownProps.match.params._id}`
    );
    const jobPostDetails = await jobPromise.json();

    let buttonState = {
      signUp: false,
      applyButton: false,
      AlreadyApplied: false,
      deleteJobPostButton: false,
    };

    //setting up the logic for the buttons

    if (!state.userAccount.email) {
      buttonState.signUp = true;
      buttonState.applyButton = false;
      buttonState.AlreadyApplied = false;
      buttonState.deleteJobPostButton = false;
    }
    if (state.userAccount.email) {
      buttonState.signUp = true;
      buttonState.applyButton = false;
      buttonState.AlreadyApplied = false;
      buttonState.deleteJobPostButton = false;
    }
    if (state.userAccount.jobsAppliedTo) {
      state.userAccount.jobsAppliedTo.map((jobAppliedTo) => {
        if (jobAppliedTo.jobId === jobPostDetails.job._id) {
          buttonState.signUp = false;
          buttonState.applyButton = false;
          buttonState.AlreadyApplied = true;
          buttonState.deleteJobPostButton = false;
        }
      });
    }
    if (state.userAccount.companyInfo) {
      if (
        state.userAccount.companyInfo._id === jobPostDetails.companyInfo._id
      ) {
        buttonState.signUp = false;
        buttonState.applyButton = false;
        buttonState.AlreadyApplied = false;
        buttonState.deleteJobPostButton = true;
      }
    }

    dispatch({
      type: 'GET_JOB_POST_DETAILS',
      jobPostDetails: { ...jobPostDetails, buttonState },
    });
  };
};
