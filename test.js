import http from "k6/http";
import { check, sleep } from "k6";
import { Counter } from "k6/metrics";

let ErrorCount = new Counter("errors");

export const options = {
  vus: 2,
  duration: "5s",
  thresholds: {
    errors: ["count>10"]
  }
};

// export default function() {
//   const path = Math.random() < 0.9 ? "200" : "500";

//   let res = http.get(`https://httpbin.test.loadimpact.com/status/${path}`);
//   let success = check(res, {
//     "status is 200": r => r.status === 200
//   });
//   if (!success) {
//     ErrorCount.add(1);
//   }

//   sleep(2);
// }

export default function () {
  var res = http.post('https://webapi.dantri.com.vn/bn/list-pos', {"list":[{"category":0,"position":24}]});
  console.log('Response time was ' + String(res.timings.duration) + ' ms');
  check(res, {
    'is status 200': r => r.status === 200,
  })
  if(res.timings.duration > 100) {
    ErrorCount.add(1);
  }
}