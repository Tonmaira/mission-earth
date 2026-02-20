import axios from "axios";

// เช็คสิทธิ์ Admin
// export function chkAdmin(param) {
//   if (new Set("3").has(param)) {
//     return true;
//   } else {
//     return false;
//   }
// }
export function chkAdmin(param) {
  return new Set([3]).has(param);
}

// เช็คสิทธิ์ Admin และ Editor
// export function chkAdmins(param) {
//   if (new Set(["2", "3"]).has(param)) {
//     return true;
//   } else {
//     return false;
//   }
// }
export function chkAdmins(param) {
  return new Set([2, 3]).has(param);
}

export function GenerateId() {
  return Date.now() + Math.floor(Math.random() * 1000000);
} 

export function isMobileChk() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ฟังก์ชั่นแปลง value ให้เป็นค่าเงิน โดยการเช็คค่าว่าเป็น string หรือ number
// export function varCurrency(params) {
//   if (params)
//     if (typeof params === "string") {
//       return parseFloat(params).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, });
//     } else {
//       return params.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, });
//     }
//   else
//   return '-';
// }
export function varCurrency(params) {
  return params ?
    (typeof params === "string" ? parseFloat(params) : params).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '-';
}

//ตรวจสอบ orderid ว่าเป็น ส่วนลดไหม || result : boolean
// export function chkDiscount(arr, code) {
//   if (arr.includes(code)) {
//     return true;
//   } else {
//     return false;
//   }
// }
export function chkDiscount(arr, code) {
  return arr.includes(code);
}

// เช็ค File Exitst
export async function checkFileExists(url) {
  try {
    const response = await axios.head(url);
    return response;
  } catch (error) {
    return false;
  }
}

//รวมยอดของ key ในอาเรย์โดยชี้ไปทีละชั้น
//const result = sumByKey(data, ['data_a', 'data_b', 'd']);
export function sumByKey(data, keys) {
  return data.reduce((acc, obj) => {
    let value = obj;

    for (const key of keys) {
      if (value && value.hasOwnProperty(key)) {
        value = value[key];
      } else {
        value = undefined;
        break;
      }
    }

    if (typeof value === "number") {
      return acc + value;
    }
    else {
      return acc + parseFloat(value);
    }

    // return acc;
  }, 0);
}
export function totalsumByKey(data, keys) {
  return data.reduce((acc, obj) => {
    let value = obj;

    for (const key of keys) {
      if (value && key in value) {
        value = value[key];
      } else {
        value = undefined;
        break;
      }
    }

    if (Array.isArray(value)) {
      // If the value is an array, sum the 'net_amount' values
      value = value.reduce((sum, item) => {
        if (item && item.net_amount) {
          return sum + parseFloat(item.net_amount);
        }
        return sum;
      }, 0);
    }

    if (typeof value === "number") {
      return acc + value;
    } else {
      return acc + parseFloat(value);
    }
  }, 0);
}

// GetDateWithFormat YYYY-MM-DD
export function GettodayDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}
export function ConvertDateFormat(date) {
  const currentDate = new Date(date);
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}
export function GetDebitMonth(date) {
  const currentDate = new Date(date);
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const formattedDate = `${year}-${month}`;
  return formattedDate;
}
export function GettodayDate_Time() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;
  return formattedDate;
}

export function ConvertDatetoTH(datestring, fm) {
  const currentDate = new Date(datestring);
  var formatmonth = fm;
  var MonthList = {
    '01': 'ม.ค.',
    '02': 'ก.พ.',
    '03': 'มี.ค.',
    '04': 'เม.ย.',
    '05': 'พ.ค.',
    '06': 'มิ.ย.',
    '07': 'ก.ค.',
    '08': 'ส.ค.',
    '09': 'ก.ย.',
    '10': 'ต.ค.',
    '11': 'พ.ย.',
    '12': 'ธ.ค.',
  };

  if (formatmonth) {
    if (formatmonth === "full") {
      MonthList = {
        '01': 'มกราคม',
        '02': 'กุมภาพันธ์',
        '03': 'มีนาคม',
        '04': 'เมษายน',
        '05': 'พฤษภาคม',
        '06': 'มิถุนายน',
        '07': 'กรกฎาคม',
        '08': 'สิงหาคม',
        '09': 'กันยายน',
        '10': 'ตุลาคม',
        '11': 'พฤศจิกายน',
        '12': 'ธันวาคม',
      };
    }
  }

  const year = currentDate.getFullYear() + 543;
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

  const day = currentDate.getDate().toString().padStart(2, '0');
  const formattedDate = `${day} ${MonthList[month]} ${year}`;
  return formattedDate;
}

export function ConvertDateTimetoTH(date, format) {
  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const thaiDays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

  const thaiDate = {
    day: thaiDays[date.getDay()],
    date: date.getDate(),
    month: thaiMonths[date.getMonth()],
    year: date.getFullYear() + 543,
    hours: date.getHours(),
    minutes: date.getMinutes(),
  };

  switch (format) {
    case "full":
      return `วัน${thaiDate.day}ที่ ${thaiDate.date} ${thaiDate.month} ${thaiDate.year} เวลา ${thaiDate.hours}.${String(thaiDate.minutes).padStart(2, '0')} น.`;
    default:
      return "";
  }
};

//คำนวนอายุงาน
export function GetDays(startdate, type) {
  const currentDate = new Date();
  const notsocurrentDate = new Date(startdate);
  const timeDiff = currentDate - notsocurrentDate;
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  if (days < 0) {
    const zero = 0;
    // return result = zero + " ปี " + zero + " เดือน " + zero + " วัน";
    if (type === "day") {
      // return result = zero + " ปี " + zero + " เดือน " + zero + " วัน";
      return `${zero} ปี ${zero} เดือน ${zero} วัน`;
    } else if(type === "month"){
      // return result = zero + " ปี " + zero + " เดือน";
      return `${zero} ปี ${zero} เดือน`;
    } else {
      // return result = zero + " ปี " + zero + " เดือน";
      return `${zero} ปี`;
    }
    // return result;
  } else {
    const years = Math.floor(days / 365);
    const remainingDaysAfterYears = days % 365;

    const months = Math.floor(remainingDaysAfterYears / 30);
    const ldays = remainingDaysAfterYears % 30;

    // return result = years + " ปี " + months + " เดือน " + ldays + " วัน";

    
    if (type === "day") {
      // return result = years + " ปี " + months + " เดือน " + ldays + " วัน";
      return `${years} ปี ${months} เดือน ${ldays} วัน`;
    } else if(type === "month"){
      // return result = years + " ปี " + months + " เดือน";
      return `${years} ปี ${months} เดือน`;
    } else {
      // return result = years + " ปี " + months + " เดือน";
      return `${years} ปี`;
    }
    // return result;
  }

}

//ผ่านวันไปรึยังนะ
export function isPassDate(thatdate) {
  const currentDate = new Date();
  const notsocurrentDate = new Date(thatdate);

  if (currentDate > notsocurrentDate) {
    return "ชำระแล้ว";
  } else {
    return "รอชำระ";
  }
}

export function getFullMonthTH(ThatMonthNumber) {
  const MonthList = {
    '01': 'มกราคม',
    '02': 'กุมภาพันธ์',
    '03': 'มีนาคม',
    '04': 'เมษายน',
    '05': 'พฤษภาคม',
    '06': 'มิถุนายน',
    '07': 'กรกฎาคม',
    '08': 'สิงหาคม',
    '09': 'กันยายน',
    '10': 'ตุลาคม',
    '11': 'พฤศจิกายน',
    '12': 'ธันวาคม',
  };
  return MonthList[ThatMonthNumber];
}

export function filteredDataByMonth(data, targetMonth) {
  return data.filter(entry => {
    const visitDate = new Date(entry.visitdate);
    return visitDate.getMonth() + 1 === parseInt(targetMonth);
  });
};

export function formatDateTime(dateString, type) {
  if (dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Pad single-digit day, month, hours, minutes, and seconds with leading zeros
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    if (type === "full") {
      return `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else if (type === "time") {
      return `${formattedHours}:${formattedMinutes}`;
    } else if (type === "labtodate"){
      return `${formattedDay}-${formattedMonth}-${year} ${formattedHours}:${formattedMinutes}`;
    } else if (type === "labtodateSHT"){
      return `${formattedDay}-${formattedMonth}-${year}`;
    }else {
      return `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes}`;
    }
  }
}

export function formatDateTimeN7(dateString, type) {
  if (dateString) {
    const date = new Date(dateString);

    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    // Pad single-digit day, month, hours, minutes, and seconds with leading zeros
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    if (type === "full") {
      return `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else if (type === "time") {
      return `${formattedHours}:${formattedMinutes}`;
    } else if (type === "labtodate"){
      return `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes}`;
    } else {
      return `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes}`;
    }
  }
}

export function formatDateTime_N7(dateString, type) {
  if (dateString) {
    const date = new Date(dateString);

    switch (type) {
      case 'date':
        return date.toUTCString().slice(0, 16);
      case 'time':
        return date.toUTCString().slice(17, 22);
      default:
        return date.toUTCString().slice(0, 22);
    }
  }
};

export const formatISODate = (date) => {
  return date.toLocaleString("en-GB", { // Change locale if needed
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
};

// ฟังก์ชันแปลงข้อมูล stations เป็น JSON
export const parseStringtoJsonData = (data) => {
  return data.map((result) => {
    if (result.stations) {
      try {
        result.stations = JSON.parse(result.stations);
      } catch (error) {
        console.error("Error parsing stations data:", error);
      }
    }
    return result;
  });
};

export const ValidatePayload = (payload, requiredFields) => {
  const missingFields = requiredFields.filter(field => !payload.hasOwnProperty(field) || payload[field] === null || payload[field] === undefined || payload[field] === "");
  
  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Missing required fields: ${missingFields.join(", ")}`
    };
  }
  
  return {
    isValid: true,
    message: "Payload is valid"
  };
}

export function CalculateAge(birthdayStr) {
  const today = new Date();
  const birthDate = new Date(birthdayStr);
  let age = today.getFullYear() - birthDate.getFullYear();

  const hasBirthdayPassedThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassedThisYear) {
    age--;
  }

  return age;
}

export function formatShortDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
}

export function formatShortDateTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function formatShortDateTimeMeridiem(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  let hours = date.getHours();
  const meridiem = hours >= 12 ? "PM" : "AM";
  hours = hours % 12; // keep 0 as 0, 12 as 0 → if you want 12 to stay 12, adjust below
  if (date.getHours() === 12) hours = 12; // ensure 12 stays 12
  const formattedHours = String(hours).padStart(2, "0");

  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${formattedHours}:${minutes} ${meridiem}`;
}

export function normalizeToDatetimeLocal(dateString) {
  if (!dateString) return "";

  const d = new Date(dateString);

  // If it's invalid or ambiguous (like mm/dd/yyyy), handle manually:
  if (isNaN(d)) {
    const parts = dateString.split(/[\/\s:]/);
    if (parts.length >= 3) {
      // assume dd/mm/yyyy if first part > 12
      const [a, b, c] = parts;
      const day = parseInt(a, 10);
      const month = parseInt(b, 10);
      const year = parseInt(c, 10);
      const fixed = day > 12
        ? new Date(year, month - 1, day)
        : new Date(year, day - 1, month); // fallback
      return fixed.toISOString().slice(0, 16);
    }
    return "";
  }

  // Convert to local ISO (yyyy-MM-ddTHH:mm)
  const tzOffset = d.getTimezoneOffset() * 60000;
  const localISO = new Date(d - tzOffset).toISOString().slice(0, 16);
  return localISO;
}

export const FormatMoney = (value) => {
  // if (value === null || value === undefined || isNaN(value)) return "฿0.00";

  // return new Intl.NumberFormat("th-TH", {
  //   style: "currency",
  //   currency: "THB",
  //   minimumFractionDigits: 2,
  // }).format(value);

  if (!value) return "0.00";

  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};