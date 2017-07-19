import fs from 'fs';

function includeBlock(pathToFile, blockName) {

	let insertingLine = `include /blocks/${blockName}/${blockName}`;
		return new Promise((resolve, reject) => {
			fs.readFile(pathToFile, 'utf-8', (err, data) => {
				if (err) {
					reject(`ERR>> failed to read file ${err}`);
				} 
				console.log(data);
				if (!data) {
					data = insertingLine;
				} else {
					data = data.split("\n");

					function getLastIncludeIdx() {
						let idx = 0;
						let lastInclude = data
							.forEach((line, index) => {
								if (/include/.test(line)) {
									idx = index;
								}
							});


						return idx+1;
					}

					data.splice(getLastIncludeIdx(), 0, insertingLine);

					data = data.join("\n");
				}

				fs.writeFile(pathToFile, data, (err) => {
					if (err) {
						reject(`ERR>> failed to write in file ${err}`);		
					}
					const line = '-'.repeat(49 + blockName.length);
					console.log(line);
					console.log(`The block has included in 'app/pages/index.jade/${blockName}'`);
					console.log(line);
					resolve()
				});
		})
	});

};

export default includeBlock;