const MAX = 5

const csvPath = './digit_span.csv'
const csv = require("csvtojson")
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var header = []
for (var i = 0; i < MAX; i++) {
	header.push({id: ('forward_' + i), title: ('FORWARD_' + i)})
}
for (var i = 0; i < MAX; i++) {
	header.push({id: ('backward_' + i), title: ('BACKWARD_' + i)})
}
const csvWriterAll = createCsvWriter({
	path: './output/all_participants.csv',
	header
})
const csvWriterMono = createCsvWriter({
	path: './output/mono_participants.csv',
	header
})
const csvWriterBi = createCsvWriter({
	path: './output/bi_participants.csv',
	header
})

csv()
.fromFile(csvPath)
.then((results) => {
	Promise.all([
		csvWriterAll.writeRecords(analyseAllBlocks(results)),
		csvWriterMono.writeRecords(analyseAllBlocks(results, false)),
		csvWriterBi.writeRecords(analyseAllBlocks(results, true))
	]).then(() => {
		console.log("Complete")
	})
	
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

const analyseAllBlocks = (results, isBilingual) => {
	bilString = isBilingual ? 'YES' : 'NO'
	bilString = (isBilingual === undefined) ? '' : bilString
	const aggregates = []
	for (var p = 0; p < results.length; p += 5) {
		var numberAppeared = {
			forward: [],
			backward: []
		}
		var numberWasCorrect = {
			forward: [],
			backward: []
		}
		for (var i = 0; i < 5; i++) {
			const result = results[p + i]
			if (
				result.Response.length > MAX &&
				(
					bilString === '' ||
					result.BIL_EXPOSURE_BEFORE_5.trim() === bilString
				)
			) {
				for (var j = 0; j < result.Response.length; j++) {
					//Increment the number of times the i'th number appears in the data set
					(!numberAppeared.forward[j]) ? numberAppeared.forward[j] = 1 : numberAppeared.forward[j]++
					//If the number never appeared in numberWasCorrect, make the number of times it appeared 0
					if (numberWasCorrect.forward[j] === undefined) {
						numberWasCorrect.forward[j] = 0
					}
					//If the value was equal to the key, increment the number of times it was correct
					if (result.Key[j] === result.Response[j]) {
						numberWasCorrect.forward[j]++
					}

					//Increment the number of times the i'th number appears in the data set
					(!numberAppeared.backward[j]) ? numberAppeared.backward[j] = 1 : numberAppeared.backward[j]++
					//If the number never appeared in numberWasCorrect, make the number of times it appeared 0
					if (numberWasCorrect.backward[j] === undefined) {
						numberWasCorrect.backward[j] = 0
					}
					//If the value was equal to the key, increment the number of times it was correct
					if (result.Key[(result.Key.length - 1) - j] === result.Response[(result.Response.length - 1) - j]) {
						numberWasCorrect.backward[j]++
					}
				}
			}
		}
		var tempResult = {}
		//For every value in numberAppeared, print its average
		for (var n = 0; n < MAX; n++) {
			tempResult['forward_' + n] = (numberWasCorrect.forward[n] / numberAppeared.forward[n]) * 100
		}
		for (var n = 0; n < MAX; n++) {
			tempResult['backward_' + n] = (numberWasCorrect.backward[n] / numberAppeared.backward[n]) * 100
		}
		if (!Number.isNaN(tempResult.forward_0)) {
			aggregates.push(tempResult)
		}
	}
	return aggregates
}
