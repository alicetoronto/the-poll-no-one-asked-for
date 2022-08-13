// import './App.css';
import firebase from './firebase';
import { getDatabase, ref, set, onValue, get } from 'firebase/database';
import { useEffect, useState } from 'react';
import Form from './Form'

function App() {
	// create state to store user selections pulled from the app
	const [userInputs, setUserInputs] = useState({});

	// create state to store user selections pulled from Firebase
	const [dataFromDb, setDataFromDb] = useState({});

	// on change of any inputs, update userInputs state
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

	// on submit, update Firebase with user selections stored in userInputs state
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

	// on page load, clear prior data from Firebase and listen for changes. On change, grab the data and update dataFromDb state
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

	const resetDB = function() {
		const database = getDatabase(firebase);
		const dbRef = ref(database);
		get(dbRef).then(response => {
			const responseObj = response.val();
			// loop through every question object in Firebase and clear prior values
			for (let response in responseObj) {
				// console.log(responseObj[response])
				for (let key in responseObj[response]) {
					// console.log(responseObj[response][key]);
					const dbRefKey = ref(database, `/${response}/${key}`);
					const dbRefTotalCount = ref(database, '/totalCount');
					set(dbRefKey, 0);
					set(dbRefTotalCount, 0)
				}
			}
		})
	}

	return (
		<div>
			<h1>The Poll No One Asked For</h1>
			<Form handleChange={handleChange} handleSubmit={handleSubmit} dataFromDb={dataFromDb}/>
			<button onClick={resetDB}>Reset database</button>
		</div>
	)
}

export default App;
