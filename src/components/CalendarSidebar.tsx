import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { ref, onValue, off } from "firebase/database";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  getMonth,
  getYear,
  setMonth,
  setYear,
} from "date-fns";
import NotificationList from "./NotificationList";

interface RepaymentDateMap {
  [date: string]: boolean;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function CalendarSidebar() {
  const { user } = useAuth();
  const [markedDates, setMarkedDates] = useState<RepaymentDateMap>({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.uid) return;

    const loansRef = ref(db, `loans/${user.uid}`);

    const unsubscribe = onValue(loansRef, (snapshot) => {
      const datesMap: RepaymentDateMap = {};

      if (snapshot.exists()) {
        const data = snapshot.val();
        for (const loanId in data) {
          const loan = data[loanId];
          if (loan.repayments) {
            Object.values(loan.repayments).forEach((r: any) => {
              if (r.status !== "Paid") {
                const date = format(new Date(r.date), "yyyy-MM-dd");
                datesMap[date] = true;
              }
            });
          }
        }
      }

      setMarkedDates(datesMap);
    });

    return () => off(loansRef);
  }, [user]);

const handleDateClick = (date: Date) => {
  const dateStr = format(date, "yyyy-MM-dd");

  if (markedDates[dateStr]) {
  navigate(`/calendar`);
} else {
  toast.error("No EMI due on this date.");
}
};

  const renderHeader = () => {
    const month = getMonth(currentDate);
    const year = getYear(currentDate);

    return (
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">
          ◀
        </button>
        <div className="flex items-center gap-2">
          <select value={month} onChange={(e) => setCurrentDate(setMonth(currentDate, parseInt(e.target.value)))}
            className="text-sm bg-transparent border rounded px-2 py-1 dark:bg-gray-800">
            {months.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
          <select value={year} onChange={(e) => setCurrentDate(setYear(currentDate, parseInt(e.target.value)))}
            className="text-sm bg-transparent border rounded px-2 py-1 dark:bg-gray-800">
            {Array.from({ length: 10 }, (_, i) => {
              const y = getYear(new Date()) - 5 + i;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>
        </div>
        <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">
          ▶
        </button>
      </div>
    );
  };

  const renderDayLabels = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 dark:text-gray-400 mb-1">
        {days.map((day) => <div key={day}>{day}</div>)}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const dateStr = format(day, "yyyy-MM-dd");
        const isCurrentMonth = getMonth(day) === getMonth(currentDate);
        const isMarked = markedDates[dateStr];
        const isSelected = selectedDate === dateStr;

        days.push(
          <div key={dateStr} onClick={() => isCurrentMonth && isMarked && handleDateClick(day)}
            className={`w-10 h-10 flex items-center justify-center text-sm rounded-lg cursor-pointer transition-all
              ${!isCurrentMonth ? "text-gray-400 dark:text-gray-600" : ""}
              ${isMarked ? (isSelected ? "bg-indigo-600 text-white" : "bg-green-500 text-white hover:bg-green-600") : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
            {day.getDate()}
          </div>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <aside className="w-full h-full flex-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg overflow-y-auto">
      {/* Calendar Section */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-2">📅 Repayment Calendar</h2>
        {renderHeader()}
        {renderDayLabels()}
        {renderCells()}
        {selectedDate && (
          <div className="mt-4 text-sm text-indigo-300">
            📌 Selected Date: <span className="font-semibold">{selectedDate}</span>
            <p className="mt-1 text-xs text-gray-400">Click on <strong>Upcoming EMI</strong> dates only.</p>
          </div>
        )}
      </div>

      <hr />
      {/* Notification Section */}
      <div className="mt-10">
        <h3 className="font-semibold text-sm mb-2">🔔 Recent Notifications</h3>
        <div className="flex flex-col gap-4">
          <NotificationList limit={5} />
        </div>
      </div>
    </aside>
  );
}