import './App.css';
import firebase from './firebase';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { useEffect, useState } from 'react';
import DisplayResults from './DisplayResults';


function App() {

  // create pieces of state to store user selections pulled from the app
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  
  // create pieces of state to store user selections pulled from Firebase
  const [q1FromDb, setQ1fromDb] = useState('');
  const [q2FromDb, setQ2fromDb] = useState('');
  const [q3FromDb, setQ3fromDb] = useState('');

  // on change of any inputs, update state
  const handleChange = function(e) {
    if (e.target.name === "question1") {
      setQ1(e.target.value);
    } else if (e.target.name === "question2") {
      setQ2(e.target.value);
    } else {
      setQ3(e.target.value);
    }
  }

  // on submit, update state with user selections
  const handleSubmit = function(e) {
    e.preventDefault();
    // update Firebase with the user's selections if there are values for each piece of state
    if(q1 && q2 && q3) {
      const database = getDatabase(firebase);
      const dbRefQ1 = ref(database, '/question1');
      const dbRefQ2 = ref(database, '/question2');
      const dbRefQ3 = ref(database, '/question3');
      set(dbRefQ1, q1);
      set(dbRefQ2, q2);
      set(dbRefQ3, q3);
    } else { // alert message if any of the questions were skipped instead of pushing empty strings to Firebase
      alert('please select a response for each question!')
    }
  }

  // on page load, clear prior data from Firebase and listen for changes. On change, grab the data and update state
  useEffect(function() {
    // clear prior responses from Firebase on page load
    const database = getDatabase(firebase);
    const dbRef = ref(database);
    const dbRefQ1 = ref(database, '/question1');
    const dbRefQ2 = ref(database, '/question2');
    const dbRefQ3 = ref(database, '/question3');
    set(dbRefQ1, "");
    set(dbRefQ2, "");
    set(dbRefQ3, "");

  // on database change, update state of q1FromDb, q2FromDb, and q3FromDb
    onValue(dbRef, function(response){
      setQ1fromDb(response.val().question1);
      setQ2fromDb(response.val().question2);
      setQ3fromDb(response.val().question3);
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
            <input type='radio' name="question1" value='bubbletea' id='bubbletea' onChange={handleChange} />
            <div>
              <DisplayResults q1FromDb={q1FromDb}/>
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

            </div>
          </fieldset>
          <button onClick={handleSubmit}>Submit</button>
        </form>
    </div>
  );
}

export default App;
