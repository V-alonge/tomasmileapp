import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

const SmileyGame = () => {
    // State variables
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user login state
    const [username, setUsername] = useState(''); // User input for username
    const [password, setPassword] = useState(''); // User input for password
    const [imageUrl, setImageUrl] = useState(''); // Stores the URL of the tomato image
    const [solution, setSolution] = useState(''); // Stores the correct solution
    const [guess, setGuess] = useState(''); // Stores the user's guess
    const [isCorrect, setIsCorrect] = useState(false); // Tracks if the user's guess is correct
    const [timeRemaining, setTimeRemaining] = useState(30); //Time to game over in seconds
    const [highestScore, setHighestScore] = useState(0);//Holds the value of the single highestscore
    const [showMenu, setShowMenu] = useState(true);
    const [showModal, setShowModal] = useState(false);




    useEffect(() => {
        if (isLoggedIn) {
          setShowMenu(true);
        }
      }, [isLoggedIn]);
    
      const startGame = () => {
        fetchData();
        startTimer();
        setShowMenu(false);
    
        // Reset relevant game data
        setGuess('');
        setIsCorrect(false);
        setTimeRemaining(30);
      };
    
      const showHighestScore = () => {
        // Retrieve the highest score from wherever you're storing it
        toast.info(`Highest Score: ${highestScore}`, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
        });
      };
    
      const exitGame = () => {
        // You can add any additional cleanup or exit logic here
        window.close();
      };
    // Fetches the game data from the API
    useEffect(() => {
        fetchData();
    }, []);


    const startTimer = () => {
        const timerInterval = setInterval(() => {
          setTimeRemaining((prevTime) => {
            if (prevTime === 0) {
              clearInterval(timerInterval);
              handleGameOver();
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      };
    
      const handleGameOver = () => {
        toast.error('Time is up! Game over.', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
        });
    
        // Additional logic for handling game over, resetting, etc.
    
        // Show the menu after game over
        setShowMenu(true);
      };

    const fetchData = async () => {
        try {
            const response = await fetch('https://marcconrad.com/uob/tomato/api.php?out=json');
            const data = await response.json();
            setImageUrl(data.question); // Sets the image URL received from the API
            setSolution(data.solution); // Sets the correct solution received from the API
            setIsCorrect(false); // Resets the isCorrect state to false
        } catch (error) {
            console.error('Error fetching game data:', error);
        }
    };

    // Handles the user's guess
    const handleGuess = () => {
        const parsedGuess = parseInt(guess, 10);
        if (parsedGuess === solution) {
            toast.success('YOU GUESSED CORRECTLY!', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
            });
            setIsCorrect(true); // Sets isCorrect state to true
        } else {
            toast.error('WRONG ANSWER, TRY AGAIN', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
            });
        }
    };

    // Handles the next level button click
    const handleNextLevel = () => {
        fetchData(); // Fetches new game data for the next level
        setGuess(''); // Resets the guess state
        setTimeRemaining(30); //Restes the timer everytime u pass a level
    };

    const handleLogin = () => {
        // dummy credentials for testing out the app.
        if (username === 'dummyUser' && password === 'dummyPassword') {
            setIsLoggedIn(true);
        } else {
            toast.error('Invalid username or password', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
            });
        }
    };

    return (
        <div className="container">
          {isLoggedIn ? (
            <>
              {showMenu && (
                <div className="menu">
                  <button onClick={startGame}>Start Game</button>
                  <button onClick={showHighestScore}>Highest Score</button>
                  <button onClick={exitGame}>Exit</button>
                </div>
              )}
    
              <div className={`modal ${showModal ? 'show' : ''}`}>
                <div className="modal-content">
                  {showMenu ? (
                    <p>Choose an option from the menu</p>
                  ) : (
                    <>
                      <h2>The Tomato Game</h2>
                      <img src={imageUrl} alt="Tomato Game" />
                      <div className="label-input-button-container">
                        <label htmlFor="guessInput">Enter the missing digit:</label>
                        <input type="number" id="guessInput" value={guess} onChange={(e) => setGuess(e.target.value)} />
                        <button onClick={handleGuess} className='Enter'>Enter</button>
                    </div>
                      <div className="timer">Time Remaining: {timeRemaining}s</div>
                      {isCorrect && <button onClick={handleNextLevel}>Next Level</button>}
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="login-form">
              <h2>Login</h2>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleLogin}>Log In</button>
            </div>
          )}
          <ToastContainer />
        </div>
      );
    }
    

export default SmileyGame;
