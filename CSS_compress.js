var directory = process.argv[2],
	fs = require('fs'),
	path = require('path');

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
				data = compressCSS(data, directory1);
				var saved = saveFile(data, element, directory1);
				saved ? console.log(element + ' has been saved!') : console.log('There was an error saving ' + element);
			}
			//if it is a directory, navigate to it and try again
			else if (stats.isDirectory() == true) {
				var directory2 = directory1 + '/' + element;
				mainFunction(directory2);
			}
		});
	});
}

//function to save the file when it's formatted
function saveFile(data, element, directory1) {
	fs.writeFileSync(directory1 + '/' + element, data, encoding='utf8');

	return true;
}

/*
this is the money function. Here is where the magic happens. 

The CSS is compressed based on the following rules:
All comments are removed
All line breaks are removed
All @imports are hard coded
*/
function compressCSS(data1, directory1) {
	var isImport = data1.indexOf('@');

	while(isImport != -1){
		//analyze imports

		var importData = data1.slice(data1.indexOf('@')),
			semiColon = importData.indexOf(';') + 1,
			importData = importData.slice(importData.indexOf('@'), semiColon),
			firstQuote = importData.indexOf('"') + 1,
			element = importData.slice(firstQuote, importData.lastIndexOf('"')),
			elementPath = directory1 + '/' + element;

		elementPath = path.normalize(elementPath);
		console.log('Importing styles from: ' + elementPath);

		var data = fs.readFileSync( elementPath, encoding="utf8");

		//remove the import string from the file
		data1 = data1.replace(importData, '');

		data1 += data;

		//reset the isImport with the new data to have recursiveness
		isImport = data1.indexOf('@');
	}

	//remove all commments
	var hasComments = data1.indexOf('/*');

	while(hasComments != -1){
		var	comment = data1.slice(data1.indexOf('/*')),
			commentOpen = comment.indexOf('/*'),
			commentClose = comment.indexOf('*/') + 2,
			comment = comment.slice(commentOpen, commentClose);
		data1 = data1.replace(comment, '');
		comment = '';
		hasComments = data1.indexOf('/*');
	}
	
	//remove all line breaks
	var hasLineBreaks = data1.indexOf('\n');
	
	while(hasLineBreaks != -1){
		//remove linebreaks
		data1 = data1.replace('\n', ' ');		
		
		hasLineBreaks = data1.indexOf('\n');
	}
	
	//remove all carriage returns
	var hasReturns = data1.indexOf('\r');
	
	while(hasReturns != -1){
		//remove returns
		data1 = data1.replace('\r', ' ');		
		
		hasReturns = data1.indexOf('\r');
	}

	//remove all tabs
	var hasTabs = data1.indexOf('\t');
	
	while(hasTabs != -1){
		//remove tabs
		data1 = data1.replace('\t', '');		
		
		hasTabs = data1.indexOf('\r');
	}

	
	return data1;
	
	importedData = '';
}