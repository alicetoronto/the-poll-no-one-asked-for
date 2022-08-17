const DisplayResults = function ({ dataFromDb, name }) {
    // loop through each response in the dataFromDb state object. If response's question name matches the name of the input, display the result
    for (let item in dataFromDb) {
        // variable to store the user's currently selected option
        const selectedOption = dataFromDb[item].CurrentResponse;
        // variable to store the total count for the user's selected option
        const selectedOptionTotal = (dataFromDb[item][selectedOption]);
        // variable to store the total count of all responses
        const totalCount = dataFromDb.totalCount;
            if (item === name) {
                return <p>You're among <span className="bold">{((selectedOptionTotal / totalCount) * 100).toFixed(0)}%</span> of people ({selectedOptionTotal} out of {totalCount}) who chose "{selectedOption}"!</p>
            }
    }
}

export default DisplayResults;