import DisplayResults from './DisplayResults';
import BoringFigure from './assets/My_Wife_and_My_Mother-in-Law.jpg'
import dress from './assets/The_dress_blueblackwhitegold.jpg'

function Form({handleChange, handleSubmit, dataFromDb}) {
    const questions = [
        {
            legend: 'What’s your drink of choice?',
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
                inputValue: "This is 2015's problem"
            }
        },
        {
            legend: 'You have 2 free hours. Would you rather: nap, code, or hike?',
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
            legend: 'What do did you see first in this image?',
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
                labelText: "I can't do math. Why are you asking me?",
                inputValue: "can't math"
            }
        },
    ];

    return (
        <form>
            {
                questions.map((question) => {
                    return (
                        <fieldset key={question.questionName}>
                            <legend>{question.legend}</legend>
                            {question.imgSrc
                                ?
                                <div>
                                    <img src={question.imgSrc} alt={question.alt} />
                                    <p><a href={question.link}>{question.caption}</a></p>
                                </div>
                                : null
                            }
                            <label htmlFor={question.firstOption.labelFor}>{question.firstOption.labelText}</label>
                            <input type='radio' name={question.questionName} value={question.firstOption.inputValue} id={question.firstOption.labelFor} onChange={handleChange} />

                            <label htmlFor={question.secondOption.labelFor}>{question.secondOption.labelText}</label>
                            <input type='radio' name={question.questionName} value={question.secondOption.inputValue} id={question.secondOption.labelFor} onChange={handleChange} />

                            <label htmlFor={question.thirdOption.labelFor}>{question.thirdOption.labelText}</label>
                            <input type='radio' name={question.questionName} value={question.thirdOption.inputValue} id={question.thirdOption.labelFor} onChange={handleChange} />
                            <div>
                                <DisplayResults dataFromDb={dataFromDb} name={question.questionName} />
                            </div>
                        </fieldset>
                    )
                })
            }
            <button onClick={handleSubmit}>Submit</button>
        </form>
    );
}

export default Form;