import { useEffect, useState } from "react";
import { ConvertDateTimetoTH } from "../components/Function";

export default function Clock() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const dateTimeFull = ConvertDateTimetoTH(currentDateTime, "full","fullFormat");

  return (dateTimeFull);
}