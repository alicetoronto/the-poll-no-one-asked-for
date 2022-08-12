const DisplayResults = function ({ q1FromDb, q2FromDb, q3FromDb }) {
    if (q1FromDb) {
        return <p>You chose {q1FromDb}!</p>
    }
    if (q2FromDb) {
        return <p>You chose {q2FromDb}!</p>
    }
    if (q3FromDb) {
        return <p>You chose {q3FromDb}!</p>
    }
}

export default DisplayResults;