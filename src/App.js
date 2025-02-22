// import './App.css';
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [counties, setCounties] = useState([]); // 存放所有縣市

  const [location, setLocation] = useState("");
  const [uvIndex, setUvIndex] = useState(null);

  const fetchUVIndex = async () => {
    const apiKey = "CWA-6D885349-B9CF-4B71-AAEA-5209ACCA0BEE"; // 你的 API Key
    const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0005-001?Authorization=${apiKey}`;

    try {
      const response = await axios.get(url);
      console.log("API 回應資料：", response.data);

      // 解析 API 內的 location 陣列
      const locations = response.data.records.weatherElement.location;
      console.log("locations資料", locations);
      const targetLocation = locations.find(
        (item) => item.StationID === location
      );
      console.log("targetLocation資料", targetLocation);

      if (targetLocation) {
        setUvIndex(targetLocation.UVIndex); // 設定紫外線指數
        console.log(targetLocation.UVIndex);
      } else {
        setUvIndex("查無此地區");
      }
    } catch (error) {
      console.error("API 錯誤：", error);
      setUvIndex("取得資料失敗");
    }
  };

  return (
    <div>
      <h1>紫外線指數查詢</h1>
      <input
        type="text"
        placeholder="請輸入查詢地區"
        value={location}
        onChange={(e) => {
          setLocation(e.target.value);
        }}
      />
      <button onClick={fetchUVIndex}>查詢</button>

      {uvIndex !== null && (
        <div>
          <h2>{location} 的紫外線指數：</h2>
          <p>{uvIndex}</p>
        </div>
      )}
    </div>
  );
}

export default App;
