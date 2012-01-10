var directory = process.argv[2],
	fs = require('fs'),
	path = require('path'),
	importedData = '';

/* 
In order to make this all work, here's what you'll have to do.
Call the following as a function, then within the function, call itself
and pass it the new directory name from the element.
*/

mainFunction(directory);

function mainFunction(directory1) {
	fs.readdir(directory1, function (err, files) {
		files.forEach(function (element, index, array, err) {
			var stats = fs.statSync(directory1 + "/" + element)
			
			//need to evaluate if it's a CSS file before processing
			var fileType = element.substr(element.lastIndexOf('.') + 1);
			if(fileType == "css" || fileType == "CSS") {
				var fileTypeCheck = 0;
			}
			//if it's not a directory, process it
			if(stats.isDirectory()==false && fileTypeCheck == 0) {
				console.log('Processing ' + directory1 + '/' + element);
			
				var data = fs.readFileSync( directory1 + '/' + element, encoding="utf8");
				saveFile(data, element, directory1);
			}
			//if it is a directory, navigate to it and try again
			else if (stats.isDirectory() == true) {
				var directory2 = directory1 + '/' + element;
				console.log("Changing to directory: " + directory2)
				mainFunction(directory2);
			}
		});
	});
}

//function to save the file when it's formatted
function saveFile(data, element, directory1) {
	data = compressCSS(data, directory1);

	fs.writeFileSync(directory1 + '/' + element, data, encoding='utf8');
	
	console.log(element + ' has been saved!')
}

/*
this is the money function. Here is where the magic happens. 

The CSS is compressed based on the following rules:
All comments are removed
All line breaks are removed
All @imports are hard coded
*/
function compressCSS(data1, directory1) {

		for(i=0;i<=data1.length;i++){
			//analyze imports
			var isImport = data1.indexOf('@');
	
			if (isImport != -1) {
				var semiColon = data1.indexOf(';') + 1;
				 	importData = data1.substring(data1.indexOf('@'), semiColon),
				 	firstQuote = importData.indexOf('"') + 1,
				 	element = importData.substring(firstQuote, importData.lastIndexOf('"')),
				 	elementPath = directory1 + '/' + element;

				elementPath = path.normalize(elementPath);
				console.log('Importing styles from: ' + elementPath);

				var data = fs.readFileSync( elementPath, encoding="utf8");
				//add some recursive goodness here by analyzing the imported file
				//You will have to intern the above functions into a function of it's own that calls itself.
				
				//remove the import string from the file
				data1 = data1.replace(importData, '');

				importedData += data;
			}
		}

	data1 += importedData;

	/*for(i=0;i<=data1.length;i++){
		//remove comments
		data1 = data1.replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, '');
	}*/
	
	/*for(i=0;i<=data1.length;i++){
		//remove linebreaks
		data1 = data1.replace(/\n/i, ' ');		
	}*/
	
	return data1;
	
	importedData = '';
}