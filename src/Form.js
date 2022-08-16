import DisplayResults from './DisplayResults';

function Form({questions, handleChange, handleSubmit, dataFromDb}) {
    return (
        <form id='form'>
            {
                questions.map((question) => {
                    return (
                        <fieldset key={question.questionName} id={question.questionName}>
                            <legend className='bold'>{question.legend}</legend>
                            {question.imgSrc
                                ?
                                <div>
                                    <div className='imgContainer'>
                                        <img src={question.imgSrc} alt={question.alt} />
                                    </div>
                                    <p className='caption'><a href={question.link}>{question.caption}</a></p>
                                </div>
                                : null
                            }
                            <div className='responseContainer'>
                                <label htmlFor={question.firstOption.labelFor}>{question.firstOption.labelText}</label>
                                <input type='radio' name={question.questionName} value={question.firstOption.inputValue} id={question.firstOption.labelFor} onChange={handleChange} />
                            </div>

                            <div className='responseContainer'>
                                <label htmlFor={question.secondOption.labelFor}>{question.secondOption.labelText}</label>
                                <input type='radio' name={question.questionName} value={question.secondOption.inputValue} id={question.secondOption.labelFor} onChange={handleChange} />
                            </div>

                            <div className='responseContainer'>
                            <label htmlFor={question.thirdOption.labelFor}>{question.thirdOption.labelText}</label>
                            <input type='radio' name={question.questionName} value={question.thirdOption.inputValue} id={question.thirdOption.labelFor} onChange={handleChange} />
                            </div>

                            {Object.keys(dataFromDb).length === 7
                                ?
                                <div className='resultsContainer'>
                                    <DisplayResults dataFromDb={dataFromDb} name={question.questionName} />
                                </div>
                                : null
                            }
                        </fieldset>
                    )
                })
            }
            <p className='submitNote bold italic'>Submit to see how your responses compare to others who took the poll!</p>
            <button className='submit' id="submit" onClick={handleSubmit}>Submit</button>
        </form>
    );
}

export default Form;