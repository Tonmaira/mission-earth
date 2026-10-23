/**
 * ตัวกลางระหว่างหน้า dashboard งานวิ่ง (/run บนเว็บ) กับ Google Sheet
 *
 * ไฟล์นี้ไม่ได้รันบนเว็บ ต้องคัดลอกไปวางใน Sheet เอง:
 *   1. เปิด Sheet → Extensions → Apps Script → ลบโค้ดเดิม แล้ววางไฟล์นี้ทั้งไฟล์ → กด Save
 *   2. Project Settings (รูปเฟือง) → Script Properties → Add property
 *        ชื่อ BOARD_KEY  ค่า = RUN_BOARD_SCRIPT_KEY ตัวเดียวกับใน env ของเว็บ
 *   3. Deploy → New deployment → Select type: Web app
 *        Execute as: Me   ·   Who has access: Anyone   → Deploy แล้วกดอนุญาตสิทธิ์
 *   4. คัดลอก Web app URL (ลงท้าย /exec) ไปใส่ RUN_BOARD_SCRIPT_URL ใน env ของเว็บ
 *
 * แก้โค้ดในนี้ทีหลัง ต้อง Deploy → Manage deployments → แก้ deployment เดิม → Version: New version
 * (ถ้ากด New deployment จะได้ URL ใหม่ แล้วต้องไปเปลี่ยน env ตาม)
 *
 * "Anyone" ไม่ได้แปลว่าใครก็อ่าน Sheet ได้ ทุกคำขอต้องมี BOARD_KEY ที่ตรงกัน
 * และสคริปต์นี้แตะได้แค่สองแท็บข้างล่างเท่านั้น แท็บ Budget ไม่เคยออกจาก Google
 */

// แท็บที่หน้าเว็บอ่านและเขียนได้ กับคอลัมน์ขวาสุดที่ยอมให้เขียน
var SHEETS = { 'Progress': 8, 'Commu Plan': 5 }; // Progress H = ดาว
var LOG_SHEET = 'Web Log';

function doGet(e) {
  return run_(e && e.parameter, function () {
    return { ok: true, data: readAll_() };
  });
}

function doPost(e) {
  var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  return run_(body, function () {
    var started = Date.now();
    var lock = LockService.getScriptLock();
    // สองคนกดบันทึกพร้อมกัน ให้ทำทีละคน ไม่งั้นการเช็คแถวข้างล่างไม่มีความหมาย
    // รอไม่นาน ถ้ายังไม่ได้คิวก็ตอบไปเลยว่ายุ่ง ดีกว่าให้หน้าเว็บค้างรอ
    if (!lock.tryLock(10000)) return { ok: false, error: 'busy' };
    try {
      var result = write_(body);
      // ไม่ flush และไม่อ่านทั้งไฟล์กลับไปตรงนี้: ทั้งสองอย่างบังคับให้ Sheet คำนวณสูตรทั้งไฟล์ให้เสร็จก่อน
      // ซึ่งรวม IMPORTRANGE ในแท็บอื่นด้วย เคยทำให้การบันทึกครั้งเดียวค้างหลายนาที
      // หน้าเว็บจะยิงมาอ่านข้อมูลล่าสุดเองหลังบันทึกเสร็จ
      result.ms = Date.now() - started;
      return result;
    } finally {
      lock.releaseLock();
    }
  });
}

function run_(params, fn) {
  var out;
  var key = PropertiesService.getScriptProperties().getProperty('BOARD_KEY');
  if (!key || !params || params.key !== key) {
    out = { ok: false, error: 'unauthorized' };
  } else {
    try {
      out = fn();
    } catch (err) {
      out = { ok: false, error: 'server', message: String(err && err.message || err) };
    }
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

function readAll_() {
  var ss = SpreadsheetApp.getActive();
  var out = {};
  Object.keys(SHEETS).forEach(function (name) {
    var sh = ss.getSheetByName(name);
    if (!sh) throw new Error('ไม่เจอแท็บ "' + name + '"');
    var range = sh.getRange(1, 1, Math.max(sh.getLastRow(), 1), SHEETS[name]);
    out[name] = {
      values: range.getDisplayValues(),
      merges: range.getMergedRanges().map(function (r) {
        return [r.getRow(), r.getColumn(), r.getNumRows(), r.getNumColumns()];
      }),
    };
  });
  return out;
}

/**
 * body = { op: 'write' | 'add' | 'delete', sheet, row, expect, cells: [{ col, value }], position?, by? }
 *
 * expect คือค่าทั้งแถวที่หน้าเว็บเห็นตอนเปิดแก้ ถ้าแถวนั้นใน Sheet ไม่ตรงแล้ว
 * (มีคนแก้ไปก่อน หรือมีคนแทรก/ลบแถวจนแถวเลื่อน) จะไม่เขียนเด็ดขาด
 * ดีกว่าเขียนทับงานคนอื่นหรือลงผิดแถวโดยไม่มีใครรู้
 */
function write_(body) {
  var maxCol = SHEETS[body.sheet];
  if (!maxCol) throw new Error('แท็บนี้แก้จากเว็บไม่ได้');
  var sh = SpreadsheetApp.getActive().getSheetByName(body.sheet);
  var row = Number(body.row);
  if (!(row >= 2) || row > sh.getMaxRows()) throw new Error('แถวไม่ถูกต้อง');

  var expect = body.expect || [];
  var now = sh.getRange(row, 1, 1, maxCol).getDisplayValues()[0];
  for (var i = 0; i < maxCol; i++) {
    if (String(now[i]).trim() !== String(expect[i] == null ? '' : expect[i]).trim()) {
      return { ok: false, error: 'conflict' };
    }
  }

  if (body.op === 'delete') {
    // ลบได้แค่งานในแท็บ Progress ทั้งแถวที่ถูกลบถูกจดใน Web Log ไว้ กู้คืนได้
    if (body.sheet !== 'Progress') throw new Error('ลบจากเว็บได้แค่งานในแท็บ Progress');
    log_(body, row, now, now.map(function () { return ''; }));
    sh.deleteRow(row);
    return { ok: true, row: row };
  }

  var target = row;
  if (body.op === 'add' && body.position === 'after') {
    sh.insertRowAfter(row);
    target = row + 1;
    // ให้แถวใหม่หน้าตาเหมือนแถวข้างบน รวมถึง checkbox ในช่อง Done
    var src = sh.getRange(row, 1, 1, maxCol);
    var dst = sh.getRange(target, 1, 1, maxCol);
    src.copyTo(dst, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
    src.copyTo(dst, SpreadsheetApp.CopyPasteType.PASTE_DATA_VALIDATION, false);
  } else if (body.op !== 'write' && body.op !== 'add') {
    throw new Error('ไม่รู้จักคำสั่งนี้');
  }

  // ค่าก่อน/หลังสำหรับ log คิดเอาเอง ไม่อ่านแถวซ้ำหลังเขียน (อ่านหลังเขียนก็บังคับให้ Sheet คำนวณใหม่เหมือน flush)
  var before = target === row ? now : now.map(function () { return ''; });
  var after = before.slice();
  (body.cells || []).forEach(function (c) {
    var col = Number(c.col);
    if (!(col >= 1 && col <= maxCol)) throw new Error('คอลัมน์ไม่ถูกต้อง');
    var v = c.value;
    if (typeof v === 'string') {
      v = v.slice(0, 5000);
      if (/^=/.test(v)) v = "'" + v; // ไม่รับสูตรจากเว็บ
    } else if (typeof v !== 'boolean') {
      v = '';
    }
    sh.getRange(target, col).setValue(v);
    after[col - 1] = String(v).replace(/^'/, '');
  });

  log_(body, target, before, after);
  return { ok: true, row: target };
}

/* จดทุกการแก้จากเว็บไว้ในแท็บ Web Log เผื่อแก้ผิดแล้วต้องย้อนดูว่าเดิมเขียนว่าอะไร */
function log_(body, row, before, after) {
  var ss = SpreadsheetApp.getActive();
  var log = ss.getSheetByName(LOG_SHEET);
  if (!log) {
    log = ss.insertSheet(LOG_SHEET);
    log.appendRow(['เวลา', 'ใครแก้', 'แท็บ', 'แถว', 'คำสั่ง', 'ก่อน', 'หลัง']);
    log.setFrozenRows(1);
  }
  log.appendRow([
    new Date(), String(body.by || '').slice(0, 40), body.sheet, row,
    body.op === 'add' ? 'เพิ่ม' : body.op === 'delete' ? 'ลบ' : 'แก้', before.join(' | '), after.join(' | '),
  ]);
}
