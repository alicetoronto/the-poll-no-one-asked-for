import firebase from './firebase';
import { getDatabase, ref, set, onValue, get } from 'firebase/database';
import { useEffect, useState } from 'react';
import BoringFigure from './assets/My_Wife_and_My_Mother-in-Law.jpg';
import dress from './assets/The_dress_blueblackwhitegold.jpg';
import Form from './Form';

function App() {
	// create state to store user selections pulled from the app
	const [userInputs, setUserInputs] = useState({});

	// create state to store user selections pulled from Firebase
	const [dataFromDb, setDataFromDb] = useState({});

	// on change of any inputs, update userInputs state
	const handleChange = function(e) {
		const qArray = questions.map(question => {
			return question.questionName 
		})
		// console.log(qArray);
		qArray.forEach(q => {
			if (e.target.name === q) {
				setUserInputs(current => {
					return { ...current, [q]: e.target.value }
				});
			} 
		})
	}

	// on submit, update Firebase with user selections stored in userInputs state
	const handleSubmit = function(e) {
		e.preventDefault();
		// only update if userInputs state contains all 6 responses
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

	// on click of the Reset Database button, clear all data from the database
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

	// array storing all question data
	const questions = [
		{
			legend: 'What’s your go-to drink?',
			questionName: 'question1',
			firstOption: {
				labelFor: 'coffee',
				labelText: 'Coffee',
				inputValue: 'coffee'
			},
			secondOption: {
				labelFor: 'tea',
				labelText: 'Tea',
				inputValue: 'tea'
			},
			thirdOption: {
				labelFor: 'bubbletea',
				labelText: 'Bubble Tea',
				inputValue: 'bubble tea'
			}
		},
		{
			legend: 'What colour is this dress?',
			questionName: 'question2',
			imgSrc: dress,
			alt: 'A dress in bright light that is perceived by some as blue and black and by others as white and gold',
			caption: 'Photo by Cecilia Bleasdale',
			firstOption: {
				labelFor: 'blueBlack',
				labelText: 'Blue and black',
				inputValue: 'blue and black'
			},
			secondOption: {
				labelFor: 'whiteGold',
				labelText: 'White and gold',
				inputValue: 'white and gold'
			},
			thirdOption: {
				labelFor: '2015',
				labelText: "This is 2015's problem",
				inputValue: "this is 2015's problem"
			}
		},
		{
			legend: 'You have 2 free hours. Would you rather...?',
			questionName: 'question3',
			firstOption: {
				labelFor: 'nap',
				labelText: 'Nap',
				inputValue: 'nap'
			},
			secondOption: {
				labelFor: 'code',
				labelText: 'Code',
				inputValue: 'code'
			},
			thirdOption: {
				labelFor: 'hike',
				labelText: 'Hike',
				inputValue: 'hike'
			}
		},
		{
			legend: 'What did you see first in this image? 🔮',
			questionName: 'question4',
			imgSrc: BoringFigure,
			alt: 'optical illusion depicting both a young woman and an elderly woman',
			caption: 'W. E. Hill, Public domain, via Wikimedia Commons',
			link: 'https://en.wikipedia.org/wiki/My_Wife_and_My_Mother-in-Law#/media/File:My_Wife_and_My_Mother-in-Law.jpg',
			firstOption: {
				labelFor: 'mother-in-law',
				labelText: 'Mother-in-law',
				inputValue: 'mother-in-law'
			},
			secondOption: {
				labelFor: 'wife',
				labelText: 'Wife',
				inputValue: 'wife'
			},
			thirdOption: {
				labelFor: 'neither',
				labelText: 'Neither',
				inputValue: 'neither'
			}
		},
		{
			legend: 'Are you a dog person, cat person, or neither?',
			questionName: 'question5',
			firstOption: {
				labelFor: 'dog',
				labelText: 'Dog',
				inputValue: 'dog'
			},
			secondOption: {
				labelFor: 'cat',
				labelText: 'Cat',
				inputValue: 'cat'
			},
			thirdOption: {
				labelFor: 'heartless',
				labelText: "I'm heartless",
				inputValue: 'heartless'
			}
		},
		{
			legend: 'What is 6 \u00F7 2(1+2)?',
			questionName: 'question6',
			firstOption: {
				labelFor: '1',
				labelText: '1',
				inputValue: '1'
			},
			secondOption: {
				labelFor: '9',
				labelText: '9',
				inputValue: '9'
			},
			thirdOption: {
				labelFor: 'noMath',
				labelText: "I can't math. Why are you asking me? 😭",
				inputValue: "can't math"
			}
		},
	];

	return (
		<div>
			<header>
				<h1>The Poll No One Asked For</h1>
				<button className='start'>start the poll</button>
				<p className='credit'>Photo by <a href="https://unsplash.com/@the_modern_life_mrs?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Heather Ford</a> on <a href="https://unsplash.com/s/photos/purple-background-fun?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></p>
			</header>
			<div className='wrapper'>
				<Form questions={questions} handleChange={handleChange} handleSubmit={handleSubmit} dataFromDb={dataFromDb}/>
				<button className='reset' onClick={resetDB}>Reset database</button>
			</div>
			<footer>Created at Juno College</footer>
		</div>
	)
}

export default App;
