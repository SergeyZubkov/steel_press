'use strict';
// TODO решить проблему с возможной мнонократной, асинхронной работой с app.js
// это может породить баг, когда мы в каком-то обращении работаем со старой версией
// файла

import fs from 'fs';
import path from 'path';
import { createInterface } from 'readline';
import includeBlock from './include-block';

const rl = createInterface(process.stdin, process.stdout);

// folder with all blocks
const BLOCKS_DIR = path.join(__dirname, 'app/blocks');
const IMAGES_DIR = path.join(__dirname, '/app/resources/assets/images');
const JSON_DIR = path.join(__dirname, 'app/data');
const JS_PLUGINS_DIR = path.join(__dirname, 'app/vendor');
const JS_SCRIPTS_DIR = path.join(__dirname, 'app/scripts');

const INDEX_JADE_PATH = path.join(__dirname, '/app/pages/index.jade');
const JS_APP_PATH = path.join(__dirname, 'app/scripts/app.js');
// //////////////////////////////////////////////////////////////////////////////////////////////////

// default content for files in new block
const tmpDefault = {
	jade: `mixin {blockName}()\n\t+b.{blockName}&attributes(attributes)\n\t\tblock\n`,
	styl: `.{blockName}\n\tdisplay block\n`
};

// for bloks of ended ...-images-list
const tmpImagesList = {
	jade: 
`mixin {blockName}(data)
	+b('ul').{blockName}&attributes(attributes)
		each item in data
			+e('li').item
				+e('img').item-img&attributes({src: item.imgSrc})
					block`,
	styl: `.{blockName}\n\tdisplay block\n`,
	json: {
		sourceImages: `${IMAGES_DIR}`,
		itemTemplate: '\t{\n\t\t"imgSrc": "{{value}}"\n\t}'
	}
};

const tmpSlider = {
		jade: 
`mixin {blockName}(data)
	+b.{blockName}&attributes(attributes)
		each item in data
			.item
				+e('img').item-img&attributes({src: item.imgSrc})
					block`,
	styl: `.{blockName}\n\tdisplay block\n`,
	json: {
		sourceImages: `${IMAGES_DIR}`,
		itemTemplate: '\t{\n\t\t"imgSrc": "{{value}}"\n\t}'
	},
	js: {
		pluginName: 'slick',
		pluginSource: path.join(JS_PLUGINS_DIR, 'slick.js'),
		cssPluginSource: path.join(JS_PLUGINS_DIR, 'slick.css'),
		baseJS: 
`	//----------------------{blockName}

	$('.{blockName}').slick({

	});
	// ----------------------End {blockName}`
	}
}

function validateBlockName(blockName) {
	return new Promise((resolve, reject) => {
		const isValid = /^(\d|\w|-)+$/.test(blockName);

		if (isValid) {
			resolve(isValid);
		} else {
			const errMsg = (
				`ERR>>> An incorrect block name '${blockName}'\n` +
				`ERR>>> A block name must include letters, numbers & the minus symbol.`
			);
			reject(errMsg);
		}
	});
}

function directoryExist(blockPath, blockName) {
	return new Promise((resolve, reject) => {
		fs.stat(blockPath, notExist => {
			if (notExist) {
				resolve();
			} else {
				reject(`ERR>>> The block '${blockName}' already exists.`);
			}
		});
	});
}

function createDir(dirPath) {
	return new Promise((resolve, reject) => {
		fs.mkdir(dirPath, err => {
			if (err) {
				reject(`ERR>>> Failed to create a folder '${dirPath}'`);
			} else {
				resolve();
			}
		});
	});
}

function getTemplate(blockName) {
	return new Promise((resolve, reject) => {
		let tmp;
		if (/-images-list$/.test(blockName)) {
			tmp = tmpImagesList;
		} else {
			tmp = tmpDefault;
		}
		resolve(tmp);
	});
}

function generateJSONIfNeeded(template, blockName) {
	return new Promise((resolve, reject) => {
		if (!template.json) {
			resolve(tmp)
		} else {
			let imagesDir = path.join(template.json.sourceImages, blockName);
			console.log(imagesDir)
			let fillTmp;

			fs.readdir(imagesDir, (err, files) => {
				if (err) {
					reject(`failed to read directory ${err}`);
				}
				if (!files) {
					reject(`files dont found in ${imagesDir} ${err}`);
				} else {
					const start = `[\n`;
					const end = `\n]`;

					fillTmp = files.map(file => {		
						return template.json.itemTemplate.replace("{{value}}", file);
					});	

					fillTmp = fillTmp.join(',\n');
					fillTmp = start + fillTmp + end;
					template.json = fillTmp;

					resolve(template);
				}
			});
		}
	});
}

function generateJsIfNeed(template, blockName) {
	const pluginName = template.js.pluginName;

	function readJS() {
		return new Promise((resolve, reject) => {
			fs.readFile(JS_APP_PATH, 'utf-8', (err, data) => {
				if (err) {
					reject(`ERR>> failed to read file ${err}`);
				} else {
					data = data.split('\n');

					function isPluginNoImported() {
						const regExp = new RegExp(`${pluginName}(.js)?["'];?`);
						return !data.some(line => regExp.test(line));
					}

					function addImport() {
						function getLastImportIdx() {
							let idx = 0;
							let lastInclude = data
								.forEach((line, index) => {
									if (/^import\s+'.+'/.test(line)) {
										idx = index;
									}
								});
							return idx+1;
						}

						let pathToPlugin = path.relative(JS_SCRIPTS_DIR, JS_PLUGINS_DIR);
						pathToPlugin = pathToPlugin.replace(/\\/g, '/');
						const importLine = `import '${pathToPlugin}/${pluginName}';`

						data.splice(getLastImportIdx(), 0, importLine);
					}

					if (isPluginNoImported()) {
						addImport();
					}

					const baseJS = template.js.baseJS
						.replace(/\{blockName}/g, blockName);

					const newData = data.push(...baseJS.split('\n'));
					console.log(data);

				}
			});
		});
	}
	return new Promise((resolve, reject) => {
		if (template.js) {
			readJS();
		} else {
			resolve(template);
		}
	});
}

function createFiles(blocksPath, blockName, template) {
	const promises = [];
	Object.keys(template).forEach(ext => {
		const filename = `${blockName}.${ext}`;
		let fileSource;
		let filePath;

		if (ext === 'json') {
			fileSource = template.json;
			filePath = path.join(JSON_DIR, filename);
		} else {
			fileSource = template[ext].replace(/\{blockName}/g, blockName);
			filePath = path.join(blocksPath, filename);
		}

		promises.push(
				new Promise((resolve, reject) => {
					fs.writeFile(filePath, fileSource, 'utf8', err => {
						if (err) {
							reject(`ERR>>> Failed to create a file '${filePath}'`);
						} else {
							resolve();
						}
					});
				})
		);
	});

	return Promise.all(promises);
}

function getFiles(blockPath) {
	return new Promise((resolve, reject) => {
		fs.readdir(blockPath, (err, files) => {
			if (err) {
				reject(`ERR>>> Failed to get a file list from a folder '${blockPath}'`);
			} else {
				resolve(files);
			}
		});
	});
}

function printErrorMessage(errText) {
	console.log(errText);
	rl.close();
}

// //////////////////////////////////////////////////////////////////////////

function initMakeBlock(candidateBlockName) {
	const blockNames = candidateBlockName.trim().split(/\s+/);

	const makeBlock = blockName => {
		const blockPath = path.join(BLOCKS_DIR, blockName);

		return validateBlockName(blockName)
			.then(() => directoryExist(blockPath, blockName))
			.then(() => createDir(blockPath))
			.then(() => getTemplate(blockName))
			.then((template) => generateJSONIfNeeded(template, blockName))
			.then((template) => createFiles(blockPath, blockName, template))
			.then(() => getFiles(blockPath))
			.then(files => {
				const line = '-'.repeat(48 + blockName.length);
				console.log(line);
				console.log(`The block has just been created in 'app/blocks/${blockName}'`);
				console.log(line);

				// Displays a list of files created
				files.forEach(file => console.log(file));

				rl.close();
			});
	};

	if (blockNames.length === 1) {
		return makeBlock(blockNames[0]).then(() => includeBlock(INDEX_JADE_PATH, blockNames[0]));
	} 

	const promises = blockNames.map(name => makeBlock(name));

 	return Promise.all(promises).then(() => includeBlock(INDEX_JADE_PATH, blockNames));
}


// //////////////////////////////////////////////////////////////////////////
//
// Start here
//

// Command line arguments
// const blockNameFromCli = process.argv
// 		.slice(2)
// 		// join all arguments to one string (to simplify the capture user input errors)
// 		.join(' ');

// // If the user pass the name of the block in the command-line options
// // that create a block. Otherwise - activates interactive mode
// if (blockNameFromCli !== '') {
// 	initMakeBlock(blockNameFromCli).catch(git);
// } else {
// 	rl.setPrompt('Block(s) name: ');
// 	rl.prompt();
// 	rl.on('line', (line) => {
// 		initMakeBlock(line).catch(printErrorMessage);
// 	});
// }

generateJsIfNeed(tmpSlider, 'test');
