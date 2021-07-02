import React, { useState } from "react";
import useInterval from "../utils/useInterval";
import DurationBar from "./DurationBar";
import StartStopControl from "./StartStopControl";
import TimeDisplay from "./TimeDisplay";

// These functions are defined outside of the component to insure they do not have access to state
// and are, therefore more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const newTimeRemaining = prevState.session.timeRemaining - 1;
  let newSession = {...prevState.session};
  newSession.timeRemaining = newTimeRemaining;
  return {...prevState, "session": newSession};
}

/**
 * Higher order function that returns a function to update the session state with the next session type upon timeout.
 * @param currentState
 *    Takes in the current state and returns appropraite "state session"
 * @returns
 *  function to update the session state.
 */
function nextSession(currentState) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  if (currentState.session.label === "Focusing") {
    return {
      label: "On Break",
      timeRemaining: currentState.break,
    };
  }
  return {
    label: "Focusing",
    timeRemaining: currentState.focus,
  };
}

function Pomodoro() {
  const initialState = {
    "focus": 1500,
    "break": 300,
    "session": null,
    "isTimerRunning": false,
  };

  const [appState, setAppState] = useState(initialState);

  /**
 * Called whenever the play/pause button is clicked.
 */
  function playPause() {
    setAppState((currentState) => {
      const isRunning = !currentState.isTimerRunning;

      if (isRunning) {
        if (currentState.session === null) {
          let newSession = {};
          newSession = {
              label: "Focusing",
              timeRemaining: appState.focus,
          };
          return {...appState, "session" : newSession, "isTimerRunning": isRunning};
        };
      }
      return {...appState, "isTimerRunning": isRunning};
    });
  }

  /**
   * stops the timer by setting the "session" back to null
   */
  function stopTimer(){ setAppState({...appState, "session": null, "isTimerRunning": false}) }



  /**
   * Function to change the time for the Duration Bar
   * @param timerName 
   *    takes in a param of timer name to update the appropriate timer
   * @param addTime 
   *    takes in whether to add time to the timer, or decrease the amount of time
   */
  function changeTime(timerName="focus", addTime=true){
    let addedTime = 0;
    const addTimeFunc = (currentTime, timeToAdd) => currentTime + timeToAdd;
    const subtractTimeFunc = (currentTime, timeToSubtract) => currentTime - timeToSubtract;

    if (timerName === "focus"){
      addedTime = addTime ? Math.min(addTimeFunc(appState.focus, 300), 3600) : Math.max(subtractTimeFunc(appState.focus, 300), 0);
    }else{
      addedTime = addTime ? Math.min(addTimeFunc(appState.break, 60), 900) : Math.max(subtractTimeFunc(appState.break, 60), 0);
    }
    setAppState({...appState, [timerName]: addedTime});
  }


  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You will not need to make changes to the callback function
   */
  useInterval(() => {
      if (appState.session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setAppState(currentState => {
          const newSesh = nextSession(currentState);
          return {...currentState, "session" : newSesh};
        });
      }
      return setAppState(nextTick);
    },
    appState.isTimerRunning ? 1000 : null
  );


  /**
   * 
   * @returns timer display and progress bar if timer is active with a session
   */
  function showTimeDisplay() {
    if (appState.session !== null){return <TimeDisplay appState={appState} />};
  } 

  return (
    <div className="pomodoro">
      <DurationBar changeTime={changeTime} appState={appState}/>
      <StartStopControl appState={appState} playPause={playPause} stopTimer={stopTimer}/>
      {showTimeDisplay()}
    </div>
  );
}

export default Pomodoro;
