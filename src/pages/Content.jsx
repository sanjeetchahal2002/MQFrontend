import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import axios from "axios";

import { useAuth } from "../contexts/AuthContext";

import BarChart from "../components/BarChart";
import LineChart from "../components/LineChart";
import DateRangePicker from "../components/DateRange";

const API_URL = import.meta.env.VITE_API_URL;

export default function Main() {
  const { handleLogout: onLogout, user } = useAuth();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectAgeGroup, setSelectAgeGroup] = useState("");
  const [selecttDate, setSelectDate] = useState(null);
  const startDate = useRef(null);
  const filter = useRef({});
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const controller = new AbortController();
    async function getAnalyticsData() {
      try {
        const signal = controller.signal;
        const token = localStorage.getItem("token");
        const result = await axios.get(`${API_URL}api/v1/analytics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
          signal,
        });
        setData(result.data.data);
        if (searchParams.size >= 1) {
          const gender = searchParams.get("gender");
          const ageGroup = searchParams.get("ageGroup");
          const date = searchParams.get("date");
          filter.current = { gender, ageGroup, date };
        } else {
          filter.current = result.data.data.filters || {};
        }
        filter.current &&
          Object.entries(filter.current).forEach(([key, value]) => {
            if (key === "gender" && value) {
              setSelectedGender(value);
            } else if (key === "ageGroup" && value) {
              setSelectAgeGroup(value);
            } else if (key === "date" && value) {
              const dateString = value;
              const [day, month, year] = dateString.split("/").map(Number);
              const dateObj = new Date(year, month - 1, day);
              setSelectDate(dateObj);
            }
          });
        if (result) getStartDate(result.data.data.analyticsData);
      } catch (err) {
        if (err.resonse && !err.response.data.success) {
          onLogout();
        }
      }
    }
    getAnalyticsData();
    return () => {
      controller.abort();
    };
  }, [onLogout]);
  async function updateFilter() {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}api/v1/users/update-filter`, filter.current, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
  function handleFilterUpdate(key, value) {
    if (key === "date") {
      const dateObj = new Date(value);
      if (!isNaN(dateObj.getTime())) {
        const formattedDate = dateObj.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        filter.current[key] = formattedDate;
      } else {
        console.error("Invalid date value provided.");
        return;
      }
    } else {
      filter.current[key] = value;
    }

    updateFilter();
    const searchStringObj = {};
    Object.entries(filter.current).map(([key, value]) => {
      console.log(value);
      if (value) {
        searchStringObj[key] = value;
      }
    });
    setSearchParams(searchStringObj);
  }
  async function resetFilters() {
    try {
      const token = localStorage.getItem("token");
      const result = await axios.delete(`${API_URL}api/v1/users/reset-filter`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.data.success === 1) {
        setSelectedGender("");
        setSelectAgeGroup("");
        setSelectDate(null);
        filter.current = {};
        setSearchParams("");
      }
    } catch (err) {
      console.log(err);
    }
  }
  function getStartDate(data = {}) {
    const requiredData = data.sort((a, b) => a.date - b.date);
    startDate.current = Object.entries(requiredData)[0][1].date;
  }

  async function logout() {
    setIsLoading(true);
    try {
      const result = await axios.get(`${API_URL}api/v1/users/logout`, {
        withCredentials: true,
      });
      if (result.data.success) {
        onLogout();
        localStorage.clear();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <header
      style={{
        display: "flex",
        padding: "20px",
        border: "1px solid black",
        borderRadius: "20px",
        width: "1100px",
        position: "absolute",
        top: "10%",
        left: "15%",
        flexDirection: "column",
        gap: "50px",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "50px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <p
            style={{
              display: "flex",
              height: "40px",
              width: "40px",
              border: "1px solid black",
              borderRadius: "30px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {user && user.name && user.name[0]}
          </p>
          <p>{user && user.name}</p>
        </div>
        <div>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          border: "1px solid black",
          padding: "20px",
        }}
      >
        <div>
          Gender
          <select
            name=""
            id=""
            value={selectedGender}
            onChange={(e) => {
              handleFilterUpdate("gender", e.target.value);
              setSelectedGender(e.target.value);
            }}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          Age Group
          <select
            name=""
            id=""
            value={selectAgeGroup}
            onChange={(e) => {
              handleFilterUpdate("ageGroup", e.target.value);
              setSelectAgeGroup(e.target.value);
            }}
          >
            <option value="15-25">15-25</option>
            <option value=">25">{">25"}</option>
          </select>
        </div>
        <DateRangePicker
          selecttDate={selecttDate}
          setSelectDate={setSelectDate}
          handleFilterUpdate={handleFilterUpdate}
          startDate={startDate}
        />
        <button onClick={resetFilters}>Reset filters</button>
      </div>
      {!isLoading && (
        <div>
          <BarChart
            data={data}
            onBarClick={setSelectedFeature}
            selectedGender={selectedGender}
            selectAgeGroup={selectAgeGroup}
            selecttDate={selecttDate}
          />
          {selectedFeature && !selecttDate && (
            <LineChart
              selectedfeature={selectedFeature}
              data={data}
              selectedGender={selectedGender}
              selectAgeGroup={selectAgeGroup}
              selecttDate={selecttDate}
            />
          )}
        </div>
      )}
    </header>
  );
}
