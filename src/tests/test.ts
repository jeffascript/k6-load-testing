import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate } from 'k6/metrics';


const ErrorCount = new Counter('errors');
const ErrorRate = new Rate('error_rate');

/**
The following stages configuration will result in up-flat-down ramping
 profile over a 60s total test duration.
*/


//VU == Virtual Users
// eslint-disable-next-line prefer-const
export const options = {
	stages: [
		// Ramp-up from 1 to 100 VUs in 10s
		{ duration: '10s', target: 50 },

		// Stay at rest on 100 VUs for 5s i.e: maintain 100vus at 10s
		{ duration: '15s', target: 50},

		// Ramp-down from 5 to 0 VUs for 5s
		{ duration: '15s', target: 0 }
	],

	thresholds: {
        error_rate: ['rate<0.1'],// <10% errors
        errors: ["count<1"]
	}
};

// export const basicTest = () => {
// 	http.get('https://cloud.stage.onbuildingminds.com');
// 	sleep(1);
// };


export default () => {
	const resp = http.get('https://cloud.stage.onbuildingminds.com');
	const success = check(resp, { 'status was 200': r => r.status == 200 });
	if (!success) {
		ErrorCount.add(1);
		ErrorRate.add(true);
	} else {
		ErrorRate.add(false);
	}

	sleep(1);
};
