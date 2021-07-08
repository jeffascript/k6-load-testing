/* eslint-disable @typescript-eslint/no-var-requires */
const reporter = require('k6-html-reporter');

const fs = require('fs-extra');

const {join} = require('path');

const REPORT_FOLDER = join(__dirname, '../../dist/reports');
const SOURCE_FOLDER = join(__dirname, '../../dist/');

const { htmlReport } = require ("https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js");
const { textSummary } = require ("https://jslib.k6.io/k6-summary/0.0.1/index.js")

export function handleSummary(data) {
  return {
    "result.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}


fs.readdirSync(SOURCE_FOLDER).forEach(file => {
	const name = file.replace('.json', '');
	const options = {
		jsonFile: `${SOURCE_FOLDER}/${file}`,
		output: REPORT_FOLDER
	};

	reporter.generateSummaryReport(options);

	fs.renameSync(`${REPORT_FOLDER}/report.html`, `${REPORT_FOLDER}/${name}.html`);
});
