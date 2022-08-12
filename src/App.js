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
				return {
					...current,
					question1: e.target.value
				}
			} else if (e.target.name === "question2") {
				return {
					...current,
					question2: e.target.value
				}
			} else if (e.target.name === "question3") {
				return {
					...current,
					question3: e.target.value
				}
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
				// loop through each item in the UserInputs state object and match the key (i.e., the question number) against the keys in Firebase. If the keys (i.e.,question numbers) match, update the key value in Firebase (i.e., the user's response to that question number)
				for (let userInput in userInputs) {
					for (let response in responseObj) {
						if (userInput === response) {
							const dbRefKey = ref(database, `/${response}`);
							set(dbRefKey, userInputs[userInput])
						}
					}
				}
				// on database change, update state of dataFromDb
				onValue(dbRef, response => {
					console.log(response.val());
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

		// clear prior responses from Firebase on page load
		// get(dbRef).then(response => {
		// 	const responseObj = response.val();
		// 	for (let response in responseObj) {
		// 		const dbRefKey = ref(database, `/${response}`);
		// 		set(dbRefKey, "");
		// 	}
		// })
		
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
					<input type='radio' name="question1" value='bubbletea' id='bubbletea' onChange={handleChange} />
					<div>
					<DisplayResults dataFromDb={dataFromDb} name='question1'/>
					</div>
				</fieldset>

				<fieldset>
					<legend>You have 2 free hours: nap, code, hike?</legend>
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
