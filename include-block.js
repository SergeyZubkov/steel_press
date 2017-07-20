import fs from 'fs';

function includeBlock(pathToFile, blockName) {
	let inserting;
	if (Array.isArray(blockName)) {
		inserting = blockName
			.map(bN => `include /blocks/${bN}/${bN}`)
			.join('\n');
	} else {
		inserting = `include /blocks/${blockName}/${blockName}`;
	}
		return new Promise((resolve, reject) => {
			fs.readFile(pathToFile, 'utf-8', (err, data) => {
				if (err) {
					reject(`ERR>> failed to read file ${err}`);
				} 


				if (!data) {
					data = inserting;
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

					data.splice(getLastIncludeIdx(), 0, inserting);

					data = data.join("\n");
				}

				fs.writeFile(pathToFile, data, (err) => {
					if (err) {
						reject(`ERR>> failed to write in file ${err}`);		
					}
					const line = '-'.repeat(49 + 'app/pages/index.jade/'.length + blockName.length);
					console.log(line);
					console.log(`The block${Array.isArray(blockName) ? 's': ''} ${blockName} has included in 'app/pages/index.jade/'`);
					console.log(line);
					resolve()
				});
		})
	});

};

export default includeBlock;