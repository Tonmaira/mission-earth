import assert from "node:assert/strict";
import { test } from "node:test";
import { parseCsv } from "../lib/blackIvoryRunners.mjs";
import { matchesBib, parseBibRows } from "../lib/blackIvoryBib.mjs";

// Same shape as the team's BIB tab (made-up people): header, a totals row, then runners.
const ROWS = parseCsv([
  "ลำดับ,ชื่อ,นามสกุล,ระยะ,ไซส์เสื้อ,เพศ,BIB,✔️,Race",
  ",442,,413,,,,,",
  "1,สมชาย,ใจดี,5K,S,M,001,,TRUE",
  "2,สมหญิง,ใจงาม,12K,M,F,,,FALSE",
  "3,John,Smith,8K,L,M,205,,TRUE",
  "4,,,,,,,,",
].join("\n"));

test("reads only name, distance, BIB and Non-race, skipping the totals row and blank rows", () => {
  assert.deepEqual(parseBibRows(ROWS), [
    { first: "สมชาย", last: "ใจดี", km: "5K", bib: "001", nonRace: false },
    { first: "สมหญิง", last: "ใจงาม", km: "12K", bib: "", nonRace: true },
    { first: "John", last: "Smith", km: "8K", bib: "205", nonRace: false },
  ]);
});

test("returns null when a heading is renamed", () => {
  assert.equal(parseBibRows(parseCsv("ลำดับ,ชื่อ,นามสกุล,ระยะ,เลข\n1,a,b,5K,1")), null);
});

test("matches first name, last name, full name or BIB, ignoring case and spaces", () => {
  const entries = parseBibRows(ROWS);
  const names = (q) => entries.filter((p) => matchesBib(p, q)).map((p) => p.first);
  assert.deepEqual(names(""), ["สมชาย", "สมหญิง", "John"]); // empty search shows everyone
  assert.deepEqual(names("สม"), ["สมชาย", "สมหญิง"]);
  assert.deepEqual(names("ใจงาม"), ["สมหญิง"]);
  assert.deepEqual(names("john  SMI"), ["John"]);
  assert.deepEqual(names("205"), ["John"]);
  assert.deepEqual(names("1"), ["สมชาย"]); // BIB "001" without the leading zeros
  assert.deepEqual(names("ยใจ"), []); // doesn't match across the first/last name seam
});
