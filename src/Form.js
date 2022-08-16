import DisplayResults from './DisplayResults';

function Form({questions, handleChange, handleSubmit, dataFromDb}) {
    return (
        <form id='form'>
            { // map through the questions array and for each question, populate the data into the form
                questions.map((question) => {
                    // destructure the question object
                    const { questionName, legend, imgSrc, alt, link, caption, firstOption, secondOption, thirdOption } = question;

                    return (
                        <fieldset key={questionName} id={questionName}>
                            <legend className='bold'>{legend}</legend>
                            {imgSrc
                                ?
                                <div>
                                    <div className='imgContainer'>
                                        <img src={imgSrc} alt={alt} />
                                    </div>
                                    <p className='caption'><a href={link}>{caption}</a></p>
                                </div>
                                : null
                            }
                            <div className='responseContainer'>
                                <label htmlFor={firstOption.inputValue}>{firstOption.labelText}</label>
                                <input type='radio' name={questionName} value={firstOption.inputValue} id={firstOption.inputValue} onChange={handleChange} />
                            </div>

                            <div className='responseContainer'>
                                <label htmlFor={secondOption.inputValue}>{secondOption.labelText}</label>
                                <input type='radio' name={questionName} value={secondOption.inputValue} id={secondOption.inputValue} onChange={handleChange} />
                            </div>

                            <div className='responseContainer'>
                            <label htmlFor={thirdOption.inputValue}>{thirdOption.labelText}</label>
                            <input type='radio' name={questionName} value={thirdOption.inputValue} id={thirdOption.inputValue} onChange={handleChange} />
                            </div>

                            {/* display results if dataFromDb state object contains as many items as there are questions + 1 (for the node representing total count in addition to the nodes representing each question) */}
                            {Object.keys(dataFromDb).length === (questions.length + 1)
                                ?
                                <div className='resultsContainer'>
                                    <DisplayResults dataFromDb={dataFromDb} name={questionName} />
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