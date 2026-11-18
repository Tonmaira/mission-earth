import assert from "node:assert/strict";
import { test } from "node:test";
import { parseCsv } from "../lib/blackIvoryRunners.mjs";
import { formatPhone, mapUrl, parsePhones, parseShops } from "../lib/blackIvoryShops.mjs";

// Same shape as the shops' Google Form answers (made-up shops): private contact columns at the end.
const ROWS = parseCsv([
  "Timestamp,ชื่อร้านค้า (ภาษาไทย),ชื่อร้านค้า (ภาษาอังกฤษ ถ้ามี),ประเภทร้านค้า,ที่อยู่ร้านค้า,เบอร์โทรศัพท์ร้านค้า,Facebook / Instagram / Website (ถ้ามี),Google Maps Location,รูปภาพหน้าร้านหรือโลโก้ (ถ้ามี),ชื่อ-นามสกุลผู้ติดต่อ,ตำแหน่ง (ถ้ามี),เบอร์โทรศัพท์,LINE ID,อีเมล",
  "11/3/2026 21:21:45,ร้านทดลอง,Test Shop ,ร้านอาหาร,1 ถ.สุมนเทวราช ต.ในเวียง,081-1234567,fb,https://maps.app.goo.gl/abc?g_st=ac,,สมชาย ใจดี,เจ้าของ,0899999999,somchai,a@b.c",
  "11/4/2026 13:32:15,ร้าน​ไม่มีแผนที่,,ร้านกาแฟ,ต.หนองแดง อ.แม่จริม,889695362,,มี,,สมหญิง,,0888888888,,x@y.z",
  ",,,,,,,,,,,,,",
].join("\n"));

test("keeps only the public shop columns and skips blank rows", () => {
  const shops = parseShops(ROWS);
  assert.equal(shops.length, 2);
  assert.deepEqual(Object.keys(shops[0]), ["name", "nameEn", "type", "address", "phones", "map"]);
  assert.deepEqual(shops[0], {
    name: "ร้านทดลอง",
    nameEn: "Test Shop",
    type: "ร้านอาหาร",
    address: "1 ถ.สุมนเทวราช ต.ในเวียง",
    phones: ["0811234567"],
    map: "https://maps.app.goo.gl/abc?g_st=ac",
  });
  assert.ok(!JSON.stringify(shops).includes("สมชาย")); // contact person never leaves the server
  assert.equal(shops[1].name, "ร้านไม่มีแผนที่"); // zero-width space removed
});

test("falls back to a Google Maps search when the shop gave no link", () => {
  assert.equal(mapUrl("มี", "ร้าน A", "แม่จริม"), "https://www.google.com/maps/search/?api=1&query=%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%20A%20%E0%B9%81%E0%B8%A1%E0%B9%88%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%A1");
  assert.equal(mapUrl("คั่วกี้ Kuaki   https://share.google/xyz", "", ""), "https://share.google/xyz");
});

test("splits and repairs phone numbers", () => {
  assert.deepEqual(parsePhones("081-9238879, 098-6146936"), ["0819238879", "0986146936"]);
  assert.deepEqual(parsePhones("0632696995  / 0614953598"), ["0632696995", "0614953598"]);
  assert.deepEqual(parsePhones("054710687 054772980"), ["054710687", "054772980"]);
  assert.deepEqual(parsePhones("084-262-2459"), ["0842622459"]);
  assert.deepEqual(parsePhones("889695362"), ["0889695362"]); // Sheets dropped the leading 0
  assert.equal(formatPhone("0819238879"), "081-923-8879");
  assert.equal(formatPhone("054710687"), "054-710-687");
});

test("returns null when a heading is renamed", () => {
  assert.equal(parseShops(parseCsv("ชื่อร้าน,ประเภท\nก,ข")), null);
});
