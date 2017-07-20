import fs from 'fs';
import sequential from 'promise-sequential';
import includeBlock from './include-block'

function allBlocksInclude(targetFile, blocksDir) {
	return new Promise((resolve, reject) => {
		fs.readdir(blocksDir, (err, files) => {
			if (err) {
				reject(`Failed to read blocks names ${err}`);
			}
			// TODO исключить layout-default блок из includ'а
			files = files.filter((file) => file !== 'layout-default')

			const promises = files.map(file => {
				return function(previousResponse, responses, count) {
					return includeBlock(targetFile, file);
				};
			});

			return sequential(promises);
		});
	});
};

allBlocksInclude(__dirname + '/app/pages/index.jade', __dirname + '/app/blocks');

export default allBlocksInclude;