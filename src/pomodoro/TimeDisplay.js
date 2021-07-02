import React from "react";
import PropTypes from 'prop-types';
import { secondsToDuration } from "../utils/duration";

function TimeDisplay({appState}){

    /**
     * @returns boolean based on session label
     */
    const isFocusing = () => appState.session?.label === "Focusing" ? true : false;

    /**
     * @returns the correct time to display for the overall duration
     */
    const returnCorrectTime = () => isFocusing() ? secondsToDuration(appState.focus) : secondsToDuration(appState.break);

    /**
     * @returns the amount of progress based on the values in the state
     */
    function progressValue(){
        const maxTime = isFocusing() ? appState.focus : appState.break;
        const currentTime = appState.session.timeRemaining;
        const timeLeft = maxTime - currentTime;
        const progress = (timeLeft / maxTime) * 100;

        return progress;
    }

    return(
        <>
        {/* TODO: This area should show only when there is an active focus or break - i.e. the session is running or is paused */}
        <div className="row mb-2">
          <div className="col">
            {/* TODO: Update message below to include current session (Focusing or On Break) total duration */}
            <h2 data-testid="session-title">
              {appState.session?.label} for {returnCorrectTime()} minutes
            </h2>
            {/* TODO: Update message below correctly format the time remaining in the current session */}
            <p className="lead" data-testid="session-sub-title">
              {secondsToDuration(appState.session?.timeRemaining)} remaining
            </p>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">
            <div className="progress" style={{ height: "20px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={progressValue()} // TODO: Increase aria-valuenow as elapsed time increases
                style={{ width: `${progressValue()}%` }} // TODO: Increase width % as elapsed time increases
              />
            </div>
          </div>
        </div>
      </>
    );
}

TimeDisplay.propTypes = {
    appState: PropTypes.object,
}

export default TimeDisplay;