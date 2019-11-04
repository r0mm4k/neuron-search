const brain = require('brain.js');
const fs = require('fs');
const network = new brain.recurrent.LSTM();

const dataArray = ["Minsk","Orsha", "Homel","Vitebsk","Paris","Moscow","Pekin", "Brest", "London", "Berlin"];
const ask = 'Pkin';

const configTrain = {
	iterations: 50000,
	log: true,
	errorThresh: 0.005
};

const splitStr = (str) => {
	let n = [...str].reduce((acc, char, i, arr) => {
		let t = arr.filter((el, ind) => ind !== i).join('');
		return [...acc, (t[0].toUpperCase() + t.slice(1).toLowerCase())];
	}, [str]);
	return n.map((el) => ({input: el, output: str}));
};
const splitArr = (arr) => {
	return arr
		.reduce((acc, el) => {
			return [...acc, ...splitStr(el[0].toUpperCase() + el.slice(1).toLowerCase())];
		}, []);
};

fs.readFile('learned.json', (err, data) => {
	if (err) console.log(err);

	if (data.toString() === '') {
		train(dataArray);
	} else {
		network.fromJSON(JSON.parse(data.toString()));
		boot(ask);
	}
});

const train = (data = []) => {
	if (data.length) {
		console.log('Training...');
		const startTime = new Date();
		const normalizeData = splitArr(data);
		network.train(normalizeData, configTrain);
		fs.writeFile('learned.json', JSON.stringify(network.toJSON()), () => {
			console.log(`Training finished in ${(new Date - startTime) / 1000} sec!`);
		});
	}
};

const boot = (ask) => {
	console.log(network.run(ask));
};

