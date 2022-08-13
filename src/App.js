import './App.css';
import firebase from './firebase';
import { getDatabase, ref, set, onValue, get } from 'firebase/database';
import { useEffect, useState } from 'react';
import DisplayResults from './DisplayResults';


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
			}
		});
	}

	// on submit, update Firebase with user selections stored in state
	const handleSubmit = function(e) {
		e.preventDefault();

		// only update if state contains all three responses
		if (Object.keys(userInputs).length === 3) {
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
					<legend>You have 2 free hours. Would you rather: nap, code, or hike?</legend>
					<label htmlFor="nap">Nap</label>
					<input type='radio' name='question2' value='nap' id='nap' onChange={handleChange}/>

					<label htmlFor="code">Code</label>
					<input type='radio' name='question2' value='code' id='code' onChange={handleChange}/>

					<label htmlFor="hike">Hike</label>
					<input type='radio' name='question2' value='hike' id='hike' onChange={handleChange}/>
					<div>
						<DisplayResults dataFromDb={dataFromDb} name='question2' />
					</div>
				</fieldset>

				<fieldset>
					<legend>Are you a dog person, cat person, or neither?</legend>
					<label htmlFor="dog">Dog</label>
					<input type='radio' name='question3' value='dog' id='dog' onChange={handleChange}/>

					<label htmlFor="cat">Cat</label>
					<input type='radio' name='question3' value='cat' id='cat' onChange={handleChange}/>

					<label htmlFor="neither">Neither</label>
					<input type='radio' name='question3' value='neither' id='neither' onChange={handleChange}/>
					<div>
					<DisplayResults dataFromDb={dataFromDb} name='question3' />
					</div>
				</fieldset>
				<button onClick={handleSubmit}>Submit</button>
			</form>
		</div>
	);
}

export default App;
