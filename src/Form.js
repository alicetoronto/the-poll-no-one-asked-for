import DisplayResults from './DisplayResults';
import { useEffect, useRef } from 'react';

function Form({ questions, handleChange, handleSubmit, currentQuestion, setCurrentQuestion, dataFromDb, submitted, userInputs }) {
    
    const current = questions[currentQuestion];

    // on click of "previous" button, update currentQuestion state
    const handlePreviousQuestion = function (e) {
        e.preventDefault();
        setCurrentQuestion(currentQuestion - 1)
    }
    
    // on click of "next" button, update currentQuestion state
    const handleNextQuestion = function (e) {
        e.preventDefault();

        // prevent users from moving to next question without selecting a response
        if (userInputs[current.questionName]) {
            setCurrentQuestion(currentQuestion + 1)
        } else {
            alert('You trying to break this app?? Please select a response!')
        }
    }

    // store the return value of calling the useRef hook and pass it as a ref prop to the submitNote paragraph element in order to reference it in the useEffect
    const submitNote = useRef(null);
    
    useEffect(function () {

        // on changes of userInputs state, check whether question name in userInputs state object matches current question name. If matched, check which input has the value that matches the response option stored in state object and set that input's checked attribute to true so that the input stays selected/checked between re-renders 
        for (let q in userInputs) {
            if (q === current.questionName) {
                const inputsArray = document.querySelectorAll('input');
                inputsArray.forEach(input => {
                    if (userInputs[q] === input.value) {
                        input.checked = true;
                    }  
                });
            }
        }

        // on changes of currentQuestion state, check submitted status state and if true, disable inputs and submit button
        if (submitted === true) {
            // disable all radio inputs
            const inputsArray = document.querySelectorAll('input');
            inputsArray.forEach(input => {
                input.setAttribute('disabled', '')
            });

            // remove submit button and submit note
            if (document.getElementById('submit')) {
                const submitButton = document.getElementById('submit');
                submitButton.style.display = 'none';
                submitNote.current.style.display = 'none'
            }
        }
    }, [currentQuestion, current, submitted, userInputs])

    // display question to the page
    
    return (
        <form>
            <fieldset key={current.questionName} id={current.questionName}>
                <legend className='bold'>{current.legend}</legend>
                    {current.imgSrc
                        ?
                        <div>
                            <div className='imgContainer'>
                            <img src={current.imgSrc} alt={current.alt} />
                            </div>
                        <p className='caption'><a href={current.link}>{current.caption}</a></p>
                        </div>
                        : null
                    }
                    <div className='responseContainer'>
                        <label htmlFor={current.firstOption.inputValue}>{current.firstOption.labelText}</label>
                        <input type='radio' name={current.questionName} value={current.firstOption.inputValue} id={current.firstOption.inputValue} onChange={handleChange} />
                    </div>

                    <div className='responseContainer'>
                        <label htmlFor={current.secondOption.inputValue}>{current.secondOption.labelText}</label>
                        <input type='radio' name={current.questionName} value={current.secondOption.inputValue} id={current.secondOption.inputValue} onChange={handleChange} />
                    </div>

                    <div className='responseContainer'>
                        <label htmlFor={current.thirdOption.inputValue}>{current.thirdOption.labelText}</label>
                        <input type='radio' name={current.questionName} value={current.thirdOption.inputValue} id={current.thirdOption.inputValue} onChange={handleChange} />
                    </div>

                    {/* display results if dataFromDb state object contains as many items as there are questions + 1 (for the node representing total count in addition to the nodes representing each question) */}
                    {Object.keys(dataFromDb).length === (questions.length + 1)
                        ?
                        <div className='resultsContainer'>
                            <DisplayResults dataFromDb={dataFromDb} name={questions[currentQuestion].questionName} />
                        </div>
                        : null
                    }
                </fieldset>

            {/* previous and next buttons for navigation */}
            <div className='nav'>
                {
                    currentQuestion > 0
                    ?
                    <button className='prev bold' onClick={handlePreviousQuestion}>{'<'} previous</button>
                    : null
                }
                {
                    currentQuestion < (questions.length - 1)
                    ?
                    <button className='next bold' onClick={handleNextQuestion}>next {'>'}</button>
                    : null
                }
            </div>
            {/* if user is on last question, display submit button */}
            {
                currentQuestion === (questions.length - 1)
                ?
                <div className='submitArea'>
                    <p className='submitNote bold italic' ref={submitNote}>Submit to see how your responses compare to others who took the poll!</p>
                    <button className='submit' id="submit" onClick={handleSubmit}>Submit</button>
                </div>
                : null
            }
        </form>
    );
}

export default Form;