import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DateRangePicker({
  selecttDate,
  setSelectDate,
  handleFilterUpdate,
  startDate,
}) {
  const handleChange = (dates) => {
    const [start] = dates;
    setSelectDate(start);
    handleFilterUpdate("date", start);
  };

  return (
    <div>
      <label>Select Date Range:</label>
      {
        <DatePicker
          selected={selecttDate}
          onChange={handleChange}
          startDate={selecttDate}
          endDate={selecttDate}
          selectsRange
          openToDate={startDate ? Date.parse(startDate.current) : new Date()}
        />
      }
    </div>
  );
}

export default DateRangePicker;
