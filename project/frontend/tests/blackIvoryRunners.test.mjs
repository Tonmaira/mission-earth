import assert from "node:assert/strict";
import { test } from "node:test";
import { parseCsv, parseRaceGenders, parseRunnerCounts } from "../lib/blackIvoryRunners.mjs";

// Same shape as the team's summary tab (made-up numbers): totals block on the left,
// unrelated side tables to the right that must be ignored.
const SHEET = [
  ',ช่องทาง,ประเภท,รวม,12K Peak Challenge,8K Forest Trail,5K Fun Trail,เข้าร่วม City Run,ราคา/คน (บาท),รายได้ (บาท),,ไซส์เสื้อ,รวม,12K',
  ',รวมทั้งหมด,,120,30,40,50,80,,"99,000",,รวม,120,30',
  ',รวมนักวิ่ง (Paid + Free),,"1,100",30,40,"1,030",80,,"99,000",,S,10,2',
  ',รวม Paid,Paid,60,20,20,20,50,,"99,000",,M,20,5',
  ',รวม Race,Race,"1,080",25,35,"1,020",70,,,,L,30,6',
  ',รวม Non-race,Non-race,49,5,5,10,10,,,,XL,5,1',
].join("\r\n");

test("reads each group's row by its label and totals the three distances itself", () => {
  assert.deepEqual(parseRunnerCounts(parseCsv(SHEET)), {
    all: { total: 1100, byDistance: { "12K": 30, "8K": 40, "5K": 1030 } },
    race: { total: 1080, byDistance: { "12K": 25, "8K": 35, "5K": 1020 } },
    // the sheet's own total (49) counts people with no distance yet; the site doesn't
    nonRace: { total: 20, byDistance: { "12K": 5, "8K": 5, "5K": 10 } },
  });
});

test("a missing Race / Non-race row only drops that group, not the whole count", () => {
  const counts = parseRunnerCounts(parseCsv(SHEET.replace("รวม Non-race", "อื่น ๆ")));
  assert.equal(counts.nonRace, null);
  assert.equal(counts.all.total, 1100);
});

test("returns null when the sheet no longer has the expected headings", () => {
  assert.equal(parseRunnerCounts(parseCsv(SHEET.replace("รวมนักวิ่ง (Paid + Free)", "Runners"))), null);
  assert.equal(parseRunnerCounts(parseCsv(SHEET.replace("12K Peak Challenge", "12K"))), null);
});

test("returns null instead of guessing when a count cell is blank", () => {
  assert.equal(parseRunnerCounts(parseCsv(SHEET.replace(',"1,100",30,40,', ',"1,100",,40,'))), null);
});

test("parseCsv keeps quoted commas, escaped quotes and line breaks inside a cell", () => {
  assert.deepEqual(parseCsv('a,"b,c","say ""hi""","x\ny"\n1,2,3,4'), [
    ["a", "b,c", 'say "hi"', "x\ny"],
    ["1", "2", "3", "4"],
  ]);
});

// The summary tab's channel table (which roster channel counts as Race) plus a made-up roster.
const CHANNELS = parseCsv([
  ",,รายชื่อแท็บ (พิมพ์เพิ่มได้),ราคาต่อคน (บาท),Race / Non-race",
  ",,Runlah,800,Race",
  ",,MTL+,0,Race",
  ",,NanRun,0,Non-race",
].join("\n"));
const ROSTER = parseCsv([
  "ลำดับ,ชื่อ,ระยะ,เพศ,ช่องทาง",
  "1,a,12K,M,Runlah",
  "2,b,12K,F,MTL+",
  "3,c,12K,f,Runlah",
  "4,d,12K,,Runlah", // no sex filled in: not counted on either side
  "5,e,12K,M,NanRun", // Non-race channel
  "6,f,8K,F,Runlah",
  "7,g,5K,M,Runlah", // 5K isn't split by sex
  "8,h,8K,C,MTL+", // neither M nor F
].join("\n"));

test("counts Race men and women per competitive distance from the roster", () => {
  assert.deepEqual(parseRaceGenders(CHANNELS, ROSTER), {
    "8K": { M: 0, F: 1 },
    "12K": { M: 1, F: 2 },
  });
});

test("gives up on the sex split when a roster heading is renamed", () => {
  assert.equal(parseRaceGenders(CHANNELS, parseCsv("ลำดับ,ชื่อ,ระยะทาง,เพศ,ช่องทาง\n1,a,12K,M,Runlah")), null);
  assert.equal(parseRaceGenders(parseCsv("x,y\n1,2"), ROSTER), null);
});
