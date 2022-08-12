const DisplayResults = function ({ dataFromDb, name }) {
    console.log(dataFromDb)
    for (let item in dataFromDb) {
        console.log("test");
        if (dataFromDb[item]) {
            if (item === name) {
                return <p>You chose {dataFromDb[item]}!</p>
            }
        }
    }
}

export default DisplayResults;