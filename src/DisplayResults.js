const DisplayResults = function ({ dataFromDb, name }) {
    // console.log(dataFromDb);
    // console.log(dataFromDb.totalCount)
    for (let item in dataFromDb) {
        // console.log(item);
        // console.log(dataFromDb[item])
        // variable to store the user's currently selected option
        const selectedOption = dataFromDb[item].CurrentResponse;
        // variable to store the total count for the user's selected option
        const selectedOptionTotal = (dataFromDb[item][selectedOption]);
        // variable to store the total count of all responses
        const totalCount = dataFromDb.totalCount;
        // if (selectedOption) {
            if (item === name) {
                // console.log()
                return <p>You're among the <span className="bold">{((selectedOptionTotal / totalCount) * 100).toFixed(0)}%</span> of people ({selectedOptionTotal} out of {totalCount}) who chose "{selectedOption}"!</p>
            }
        // }
    }
}

export default DisplayResults;