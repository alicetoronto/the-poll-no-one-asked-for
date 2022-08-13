import './App.css';
import firebase from './firebase';
import { getDatabase, ref, set, onValue, get } from 'firebase/database';
import { useEffect, useState } from 'react';
import DisplayResults from './DisplayResults';
import BoringFigure from './assets/My_Wife_and_My_Mother-in-Law.jpg'
import dress from './assets/The_dress_blueblackwhitegold.jpg'


function App() {
	// create state to store user selections pulled from the app
	const [userInputs, setUserInputs] = useState({});

	// create state to store user selections pulled from Firebase
	const [dataFromDb, setDataFromDb] = useState({});

	// on change of any inputs, update state object
	const handleChange = function(e) {
		setUserInputs(current => {
			if (e.target.name === "question1") {
				return {...current, question1: e.target.value}
			} else if (e.target.name === "question2") {
				return { ...current, question2: e.target.value }
			} else if (e.target.name === "question3") {
				return { ...current, question3: e.target.value }
			} else if (e.target.name === "question4") {
				return { ...current, question4: e.target.value }
			} else if (e.target.name === "question5") {
				return { ...current, question5: e.target.value }
			} else if (e.target.name === "question6") {
				return { ...current, question6: e.target.value }
			}
		});
	}

	// on submit, update Firebase with user selections stored in state
	const handleSubmit = function(e) {
		e.preventDefault();

		// only update if state contains all 6 responses
		if (Object.keys(userInputs).length === 6) {
			const database = getDatabase(firebase);
			const dbRef = ref(database);
			get(dbRef).then(response => {
				const responseObj = response.val();
				// console.log(responseObj);
				// console.log(responseObj.totalCount);
				// update totalCount of responses in Firebase by 1
				let totalResponseCount = responseObj.totalCount;
				totalResponseCount = totalResponseCount + 1;
				// console.log(totalResponseCount);
				const dbRefTotalCount = ref(database, '/totalCount');
				set(dbRefTotalCount, totalResponseCount);

				// loop through each item in the UserInputs state object and match the key (i.e., the question number) against the keys in Firebase. If the keys (i.e.,question numbers) match, then match the nested keys (i.e., response option) and if those match, increase its value by 1 in Firebase (i.e., update the count of that response by 1)
				for (let userInput in userInputs) {
					for (let response in responseObj) {
						if (userInput === response) {
							// console.log(userInput);
							// console.log(response);
							// console.log('yes');
							// console.log(responseObj[response]);
							let questionObj = responseObj[response];
							for (let key in questionObj) {
								// console.log(key);
								// console.log(userInputs[userInput]);
								if (userInputs[userInput] === key) {
									// console.log("match")
									// console.log(key);
									const dbRefKey = ref(database, `/${response}/${key}`);
									const dbRefCurrentResponse = ref(database, `/${response}/CurrentResponse`);
									get(dbRefKey).then(results => {
										let responseCount = results.val();
										responseCount = responseCount + 1;
										// console.log(responseCount);
										set(dbRefKey, responseCount);
										set(dbRefCurrentResponse, userInputs[userInput]);
									})
								}
							}
						}
					}
				}
				// on database change, update state of dataFromDb
				onValue(dbRef, response => {
					// console.log(response.val());
					setDataFromDb(response.val())
				});
			});
		} else { // alert message if any of the questions were skipped
			alert('Please select a response for each question!')
		}
	}

	// on page load, clear prior data from Firebase and listen for changes. On change, grab the data and update state
	useEffect(function() {
		const database = getDatabase(firebase);
		const dbRef = ref(database);

		// clear prior values stored in CurrentResponse key in Firebase on page load
		get(dbRef).then(response => {
			const responseObj = response.val();
			// loop through every question object in Firebase and clear prior values
			for (let response in responseObj) {
				// if there is a value stored in CurrentResponse, set it to an empty string
				if (responseObj[response].CurrentResponse) {
					const dbRefKey = ref(database, `/${response}/CurrentResponse`);
					set(dbRefKey, "");
				}
			}
		})
	}, [])

	// const questions = [
	// 	{
	// 		questionText: 'What’s your drink of choice?'
	// 	}
	// ]


	return (
		<div>
			<h1>The Poll No One Asked For</h1>
			<form>
				<fieldset>
					<legend>What’s your drink of choice?</legend>
					<label htmlFor="coffee">Coffee</label>
					<input type='radio' name='question1' value='coffee' id='coffee' onChange={handleChange} />

					<label htmlFor="tea">Tea</label>
					<input type='radio' name="question1" value='tea' id='tea' onChange={handleChange}/>
					
					<label htmlFor="bubbletea">Bubbletea</label>
					<input type='radio' name="question1" value='bubble tea' id='bubbletea' onChange={handleChange} />
					<div>
					<DisplayResults dataFromDb={dataFromDb} name='question1'/>
					</div>
				</fieldset>

				<fieldset>
					<legend>What colour is this dress?</legend>
					<img src={dress} alt="A dress in bright light that is perceived by some as blue and black and by others as white and gold" />
					<p>Photo by Cecilia Bleasdale</p>
					<label htmlFor="blueBlack">Blue and black</label>
					<input type='radio' name='question2' value='blue and black' id='blueBlack' onChange={handleChange} />

					<label htmlFor="whiteGold">White and gold</label>
					<input type='radio' name="question2" value='white and gold' id='whiteGold' onChange={handleChange} />

					<label htmlFor="2015">This is 2015's problem</label>
					<input type='radio' name="question2" value="this is 2015's problem" id='2015' onChange={handleChange} />
					<div>
						<DisplayResults dataFromDb={dataFromDb} name='question2' />
					</div>
				</fieldset>

				<fieldset>
					<legend>You have 2 free hours. Would you rather: nap, code, or hike?</legend>
					<label htmlFor="nap">Nap</label>
					<input type='radio' name='question3' value='nap' id='nap' onChange={handleChange}/>

					<label htmlFor="code">Code</label>
					<input type='radio' name='question3' value='code' id='code' onChange={handleChange}/>

					<label htmlFor="hike">Hike</label>
					<input type='radio' name='question3' value='hike' id='hike' onChange={handleChange}/>
					<div>
						<DisplayResults dataFromDb={dataFromDb} name='question3' />
					</div>
				</fieldset>

				<fieldset>
					<legend>What do did you see first in this image?</legend>
					<img src={BoringFigure} alt="optical illusion depicting both a young woman and an elderly woman"/>
					<p><a href="https://en.wikipedia.org/wiki/My_Wife_and_My_Mother-in-Law#/media/File:My_Wife_and_My_Mother-in-Law.jpg">W. E. Hill, Public domain, via Wikimedia Commons</a></p>
					<label htmlFor="mother">Mother-in-law</label>
					<input type='radio' name='question4' value='mother-in-law' id='mother' onChange={handleChange} />

					<label htmlFor="wife">Wife</label>
					<input type='radio' name='question4' value='wife' id='wife' onChange={handleChange} />

					<label htmlFor="neither">Neither</label>
					<input type='radio' name='question4' value='neither' id='neither' onChange={handleChange} />
					<div>
						<DisplayResults dataFromDb={dataFromDb} name='question4' />
					</div>
				</fieldset>

				<fieldset>
					<legend>Are you a dog person, cat person, or neither?</legend>
					<label htmlFor="dog">Dog</label>
					<input type='radio' name='question5' value='dog' id='dog' onChange={handleChange}/>

					<label htmlFor="cat">Cat</label>
					<input type='radio' name='question5' value='cat' id='cat' onChange={handleChange}/>

					<label htmlFor="heartless">I'm heartless</label>
					<input type='radio' name='question5' value='heartless' id='heartless' onChange={handleChange}/>
					<div>
					<DisplayResults dataFromDb={dataFromDb} name='question5' />
					</div>
				</fieldset>

				<fieldset>
					<legend>What is 6 {'\u00F7'} 2(1+2)?</legend>
					<label htmlFor="1">1</label>
					<input type='radio' name='question6' value='1' id='1' onChange={handleChange} />

					<label htmlFor="9">9</label>
					<input type='radio' name="question6" value='9' id='9' onChange={handleChange} />

					<label htmlFor="noMath">I can't do math. Why are you asking me?</label>
					<input type='radio' name="question6" value="'can't math'" id='noMath' onChange={handleChange} />
					<div>
						<DisplayResults dataFromDb={dataFromDb} name='question6' />
					</div>
				</fieldset>

				<button onClick={handleSubmit}>Submit</button>
			</form>
		</div>
	);
}

export default App;
