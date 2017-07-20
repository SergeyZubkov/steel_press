import fs from 'fs';

// source может быть или __dirname/app/resource/assets/images/${blockName}
// или __dirname/app/sprites/${blockName}
// или его вообще может не быть

/*
	{
		imgSrc: src{value},
		iconClass: fa {value},
		iconName: {value}
	}
*/

let templateImagesList = '\t{\n\t\t"imgSrc": "{{value}}"\n\t}';
let templateSpriteList = '\t{\n\t\t"iconName": "{{value}}"\n\t}';
let templateFaIconList = '\t{\n\t\t"iconClass": "fa {{value}}"\n\t}'

function generateJSON(source, blockName, template) {
	return new Promise((resolve, reject) => {
		let res;

		fs.readdir(source, (err, files) => {
			if (err) {
				reject(`failed to read directory ${err}`)
			} 

			const start = `[\n`;
			const end = `\n]`;

			res = files.map(file => {		
				return template.replace("{{value}}", file);
			});
			console.log(res)

			res = res.join(',\n');
			res = start + res + end;

			
			fs.writeFile(`${__dirname}/app/data/${blockName}.json`, res, (err) => {
				if (err) {
					reject(`failed to write file ${err}`);
				}
				resolve();
			})
		});

	});
};

generateJSON(__dirname + '/app/resources/assets/images/projects', 'test', templateFaIconList);

export default generateJSON;