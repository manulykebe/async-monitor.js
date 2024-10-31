import fs from 'fs';
import pkg from '../package.json' assert {type: 'json'};

const {version} = pkg;

function handleError(error) {
	if (error) {
		logger.error(error);
		process.exit(1);
	}
}

fs.open('./src/Version.ts', 'w', (error, fd) => {
	handleError(error);
	fs.write(fd, [`const version = '${version}';`, 'export default version;', ''].join('\n'), error => {
		handleError(error);
	});
});
