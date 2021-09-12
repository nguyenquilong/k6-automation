import http from "k6/http";
import { check, sleep } from "k6";
import { Counter, Rate } from "k6/metrics";

let ErrorCount = new Counter("errors");
let failures = new Rate('failed request')

export const options = {
  vus: 2,
  duration: "30s",
  thresholds: {
    failed_requests : ['rate<=0'],
    http_req_duration: ['p(95)<1000'],
    errors: ["count<10"],
  },
};

export default function () {
  const result = http.get("https://test-api.k6.io/");
  check(result, {
    "http response status code 200": (r) => r.status === 200,
  });
  failures.add(result.status !== 200)
  ErrorCount.add(result.status !== 200)
  sleep(1)
}
