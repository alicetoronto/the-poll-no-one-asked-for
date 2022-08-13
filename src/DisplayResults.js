const DisplayResults = function ({ dataFromDb, name }) {
    // console.log(dataFromDb);
    // console.log(dataFromDb.totalCount)
    for (let item in dataFromDb) {
        // console.log(item);
        // console.log(dataFromDb[item])
        // create a variable to store the total count for the user's selected option and a variable to store the total count of all responses to calculate the percentage of individuals who selected the same option as the user
        const selectedOption = dataFromDb[item].CurrentResponse;
        const totalCount = dataFromDb.totalCount;
        if (item === name) {
            const selectedOptionTotal = (dataFromDb[item][selectedOption]);
            // console.log()
            return <p>You're among {((selectedOptionTotal / totalCount) * 100).toFixed(0)}% ({selectedOptionTotal}/{totalCount}) of people who chose {dataFromDb[item].CurrentResponse}!</p>
        }
    }
}

export default DisplayResults;