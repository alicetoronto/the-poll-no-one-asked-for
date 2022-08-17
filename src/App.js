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

	// create state to store user's current view
	const [currentQuestion, setCurrentQuestion] = useState(0);

	// create state to store submission status
	const [submitted, setSubmitted] = useState(false);

	// on click of "Start Poll" button, scroll to beginning of poll
	const startPoll = function () {
		document.getElementById('form').scrollIntoView();
	}
	// on change of any inputs, update userInputs state
	const handleChange = function(e) {
		// create an array of the question names from the questions array below
		const qArray = questions.map(question => {
			return question.questionName 
		})
		// for each question in the array, check if event target name matches the question name. if matched, update the userInputs state with the value
		qArray.forEach((q, index) => {
			if (e.target.name === q) {
				// update userInputs state to include the selected value of the current question (create copy of the userInputs array and add new key value pair consisting of question# and the response selected)
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
		if (Object.keys(userInputs).length === questions.length) {
			// update submitted state to true
			setSubmitted(true);

			const database = getDatabase(firebase);
			const dbRef = ref(database);
			get(dbRef).then(response => {
				// update totalCount of responses in Firebase by 1
				const responseObj = response.val();
				const dbRefTotalCount = ref(database, '/totalCount');
				let totalResponseCount = responseObj.totalCount;
				totalResponseCount = totalResponseCount + 1;
				set(dbRefTotalCount, totalResponseCount);

				// loop through each item in the userInputs state object and match the key (i.e., the question number) against the keys in Firebase. If the keys match, then match the nested keys (i.e., response option) and if those match, increase its value by 1 in Firebase (i.e., update the count of that response by 1)
				for (let userInput in userInputs) {
					for (let response in responseObj) {
						if (userInput === response) {
							let questionObj = responseObj[response];
							for (let key in questionObj) {
								if (userInputs[userInput] === key) {
									const dbRefKey = ref(database, `/${response}/${key}`);
									const dbRefCurrentResponse = ref(database, `/${response}/CurrentResponse`);
									get(dbRefKey).then(results => {
										let responseCount = results.val();
										responseCount = responseCount + 1;
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
					setDataFromDb(response.val())
				});
				// navigate to first question to show results from the beginning
				setCurrentQuestion(0);
				// display the "Take the poll again" button
				document.getElementById('refresh').style.display = 'block';
			});
		} else { // alert message if any of the questions were skipped
			alert('Please select a response for each question!')
		}
	}

	// on page load, clear prior data in the CurrentResponse node from Firebase and listen for changes. On change, grab the data from Firebase and update dataFromDb state
	useEffect(function() {
		const database = getDatabase(firebase);
		const dbRef = ref(database);

		// clear prior values stored in CurrentResponse node in Firebase on page load
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
		});
	}, []);


	// on click of the "Reset Database" button, clear all data from the database (this button is set to display none - for internal use)
	const resetDB = function() {
		const database = getDatabase(firebase);
		const dbRef = ref(database);
		get(dbRef).then(response => {
			const responseObj = response.val();
			// loop through every question object in Firebase and clear prior values
			for (let response in responseObj) {
				for (let key in responseObj[response]) {
					const dbRefKey = ref(database, `/${response}/${key}`);
					const dbRefTotalCount = ref(database, '/totalCount');
					set(dbRefKey, 0);
					set(dbRefTotalCount, 0)
				}
			}
		})
	}

	// on click of the "Take the Poll Again" button, refresh the page
	const handleRefresh = function() {
		document.location.reload(true);
	}

	// array storing all question data
	const questions = [
		{
			legend: 'What’s your go-to drink?',
			questionName: 'question1',
			firstOption: {
				labelText: 'Coffee',
				inputValue: 'coffee'
			},
			secondOption: {
				labelText: 'Tea',
				inputValue: 'tea'
			},
			thirdOption: {
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
				labelText: 'Blue and black',
				inputValue: 'blue and black'
			},
			secondOption: {
				labelText: 'White and gold',
				inputValue: 'white and gold'
			},
			thirdOption: {
				labelText: "This is 2015's problem",
				inputValue: "this is 2015's problem"
			}
		},
		{
			legend: 'You have 2 free hours. Would you rather...?',
			questionName: 'question3',
			firstOption: {
				labelText: 'Nap',
				inputValue: 'nap'
			},
			secondOption: {
				labelText: 'Code',
				inputValue: 'code'
			},
			thirdOption: {
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
				labelText: 'Mother-in-law',
				inputValue: 'mother-in-law'
			},
			secondOption: {
				labelText: 'Wife',
				inputValue: 'wife'
			},
			thirdOption: {
				labelText: 'Neither',
				inputValue: 'neither'
			}
		},
		{
			legend: 'Are you a dog person, cat person, or neither?',
			questionName: 'question5',
			firstOption: {
				labelText: 'Dog',
				inputValue: 'dog'
			},
			secondOption: {
				labelText: 'Cat',
				inputValue: 'cat'
			},
			thirdOption: {
				labelText: "I'm heartless",
				inputValue: 'heartless'
			}
		},
		{
			legend: 'What is 6 \u00F7 2(1+2)?',
			questionName: 'question6',
			firstOption: {
				labelText: '1',
				inputValue: '1'
			},
			secondOption: {
				labelText: '9',
				inputValue: '9'
			},
			thirdOption: {
				labelText: "I can't math. Why are you asking me? 😭",
				inputValue: "can't math"
			}
		},
	];

	return (
		<div>
			<header>
				<h1 className='italic'>The Poll No One Asked For</h1>
				<button className='start' onClick={startPoll}>start the poll</button>
				<p className='credit'>Photo by <a href="https://unsplash.com/@the_modern_life_mrs?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Heather Ford</a> on <a href="https://unsplash.com/s/photos/purple-background-fun?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></p>
			</header>
			<div className='wrapper'>
				{/* render Form component */}
				<Form questions={questions} handleChange={handleChange} handleSubmit={handleSubmit} currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion} dataFromDb={dataFromDb} submitted={submitted} />

				{/* "Take the Poll Again" button - displays upon submit */}
				<button className='refresh' id='refresh' onClick={handleRefresh}>take the poll again</button>

				{/* "Reset Database" button - display is set to none (internal use) */}
				<button className='reset' onClick={resetDB}>Reset database</button>
			</div>
			<footer className='bold italic'>Created at <a href="https://junocollege.com/">Juno College</a></footer>
		</div>
	)
}

export default App;
