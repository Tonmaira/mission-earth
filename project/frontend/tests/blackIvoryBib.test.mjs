import assert from "node:assert/strict";
import { test } from "node:test";
import { parseCsv } from "../lib/blackIvoryRunners.mjs";
import { countRace, matchesBib, mergeBibLists, parseBibRows } from "../lib/blackIvoryBib.mjs";

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
    { first: "สมชาย", last: "ใจดี", km: "5K", sex: "M", bib: "001", nonRace: false },
    { first: "สมหญิง", last: "ใจงาม", km: "12K", sex: "F", bib: "", nonRace: true },
    { first: "John", last: "Smith", km: "8K", sex: "M", bib: "205", nonRace: false },
  ]);
});

test("returns null when a heading is renamed", () => {
  assert.equal(parseBibRows(parseCsv("ลำดับ,ชื่อ,นามสกุล,ระยะ,เลข\n1,a,b,5K,1")), null);
});

test("matches first name, last name or full name, ignoring case and spaces", () => {
  const entries = parseBibRows(ROWS);
  const names = (q) => entries.filter((p) => matchesBib(p, q)).map((p) => p.first);
  assert.deepEqual(names(""), ["สมชาย", "สมหญิง", "John"]); // empty search shows everyone
  assert.deepEqual(names("สม"), ["สมชาย", "สมหญิง"]);
  assert.deepEqual(names("ใจงาม"), ["สมหญิง"]);
  assert.deepEqual(names("john  SMI"), ["John"]);
  assert.deepEqual(names("ยใจ"), []); // doesn't match across the first/last name seam
});

// The "รายชื่อ BIB" tab: an empty BIB column before the filled one, and Race / Non-race as words.
const LIST_ROWS = parseCsv([
  "ลำดับ,ชื่อ,นามสกุล,ระยะ,ไซส์เสื้อ,เพศ,BIB,✔️,หมายเหตุ,BIB,Race / Non-race",
  "1,สมหญิง,ใจงาม,12K,M,F,,,,002,Non-race",
  "2,วัลลา,ยอดหล้า,5K,L,C,,,,414,Non-race",
  "3,Jane,Doe,8K,S,F,,,,010,Race",
].join("\n"));

test("reads the second tab's filled BIB column and its Race / Non-race words", () => {
  assert.deepEqual(parseBibRows(LIST_ROWS), [
    { first: "สมหญิง", last: "ใจงาม", km: "12K", sex: "F", bib: "002", nonRace: true },
    { first: "วัลลา", last: "ยอดหล้า", km: "5K", sex: "C", bib: "414", nonRace: true },
    { first: "Jane", last: "Doe", km: "8K", sex: "F", bib: "010", nonRace: false },
  ]);
});

test("merges both tabs by BIB number, first tab wins, runners without a BIB dropped", () => {
  const merged = mergeBibLists([parseBibRows(ROWS), parseBibRows(LIST_ROWS)]);
  assert.deepEqual(merged.map((p) => `${p.bib} ${p.first}`), ["001 สมชาย", "002 สมหญิง", "010 Jane", "205 John", "414 วัลลา"]);
});

test("counts Race runners per distance with a men / women split that adds up", () => {
  const entries = [
    { km: "8K", sex: "M", nonRace: false },
    { km: "8K", sex: "F", nonRace: false },
    { km: "8K", sex: "C", nonRace: true }, // Non-race: not counted
    { km: "12K", sex: "F", nonRace: false },
    { km: "5K", sex: "M", nonRace: false }, // 5K isn't shown
  ];
  assert.deepEqual(countRace(entries, ["8K", "12K"]), {
    "8K": { total: 2, M: 1, F: 1 },
    "12K": { total: 1, M: 0, F: 1 },
  });
});
