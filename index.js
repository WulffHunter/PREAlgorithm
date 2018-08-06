const csvPath = './digit_span.csv'
const csv = require("csvtojson");

csv()
.fromFile(csvPath)
.then((results) => {
		console.log("\nFor all participants:\n")
		compareDataForward(results)
		compareDataBackward(results)
		console.log("\nFor monolinguals:\n")
		compareDataForward(results, false)
		compareDataBackward(results, false)
		console.log("\nFor bilinguals:\n")
		compareDataForward(results, true)
		compareDataBackward(results, true)
	})

/*
	JSON object structure:
	[
		{
			Response: '3298674',
			Key: '3247608',
			BIL_EXPOSURE_BEFORE_5: 'YES'
		},
		...
	]
*/

//In order to not confuse the data when a zero appears, we'll convert both keys and values to strings

function compareDataForward(results, isBilingual) {
	var numberAppeared = {
		forward: [],
		backward: []
	}
	var numberWasCorrect = {
		forward: [],
		backward: []
	}
	bilString = isBilingual ? 'YES' : 'NO'
	bilString = (isBilingual === undefined) ? '' : bilString
	results.forEach(result => {
		if (
			result.Response.length > 5 &&
			(
				bilString === '' ||
				result.BIL_EXPOSURE_BEFORE_5.trim() === bilString
			)
		) {
			for (var i = 0; i < result.Response.length; i++) {
				//Increment the number of times the i'th number appears in the data set
				(!numberAppeared.forward[i]) ? numberAppeared.forward[i] = 1 : numberAppeared.forward[i]++
				//If the number never appeared in numberWasCorrect, make the number of times it appeared 0
				if (numberWasCorrect.forward[i] === undefined) {
					numberWasCorrect.forward[i] = 0
				}
				//If the value was equal to the key, increment the number of times it was correct
				if (result.Key[i] === result.Response[i]) {
					numberWasCorrect.forward[i]++
				}
			}
		}
	})
	//For every value in numberAppeared, print its average
	for (var n = 0; n < 5; n++) {
		console.log(`The ${n + 1}th number was correct on average ${(numberWasCorrect.forward[n] / numberAppeared.forward[n]) * 100}% of the time`)
	}
}

function compareDataBackward(results, isBilingual) {
	var numberAppeared = {
		forward: [],
		backward: []
	}
	var numberWasCorrect = {
		forward: [],
		backward: []
	}
	bilString = isBilingual ? 'YES' : 'NO'
	bilString = (isBilingual === undefined) ? '' : bilString
	results.forEach(result => {
		if (
			result.Response.length > 5 &&
			(
				bilString === '' ||
				result.BIL_EXPOSURE_BEFORE_5.trim() === bilString
			)
		) {
			for (var i = 0; i < result.Response.length; i++) {
				//Increment the number of times the i'th number appears in the data set
				(!numberAppeared.backward[i]) ? numberAppeared.backward[i] = 1 : numberAppeared.backward[i]++
				//If the number never appeared in numberWasCorrect, make the number of times it appeared 0
				if (numberWasCorrect.backward[i] === undefined) {
					numberWasCorrect.backward[i] = 0
				}
				//If the value was equal to the key, increment the number of times it was correct
				if (result.Key[(result.Key.length - 1) - i] === result.Response[(result.Response.length - 1) - i]) {
					numberWasCorrect.backward[i]++
				}
			}
		}
	})
	//For every value in numberAppeared, print its average
 	for (var n = 0; n < 5; n++) {
 		console.log(`The ${n}th from last number was correct on average ${(numberWasCorrect.backward[n] / numberAppeared.backward[n]) * 100}% of the time`)
 	}
}