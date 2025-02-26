// import './App.css';
import { useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
// import axios from "axios";

function App() {
  const [stations, setStations] = useState({}); // 存放縣市對應的 StationID
  const [counties, setCounties] = useState([]); // 存放所有縣市
  const [selectedCounty, setSelectedCounty] = useState(""); //存放使用者選取的縣市
  const [uvData, setUvData] = useState({}); // 存放 UVIndex
  const [date, setDate] = useState([]);

  // const fetchUVIndex = async () => {
  //   const apiKey = "CWA-6D885349-B9CF-4B71-AAEA-5209ACCA0BEE"; // 你的 API Key
  //   const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0005-001?Authorization=${apiKey}`;

  //   try {
  //     const response = await axios.get(url);
  //     console.log("API 回應資料：", response.data);

  //     // 解析 API 內的 location 陣列
  //     const locations = response.data.records.weatherElement.location;
  //     console.log("locations資料", locations);
  //     const targetLocation = locations.find(
  //       (item) => item.StationID === location
  //     );
  //     console.log("targetLocation資料", targetLocation);

  //     if (targetLocation) {
  //       setUvIndex(targetLocation.UVIndex); // 設定紫外線指數
  //       console.log(targetLocation.UVIndex);
  //     } else {
  //       setUvIndex("查無此地區");
  //     }
  //   } catch (error) {
  //     console.error("API 錯誤：", error);
  //     setUvIndex("取得資料失敗");
  //   }
  // };
  const apiKey = "CWA-6D885349-B9CF-4B71-AAEA-5209ACCA0BEE"; // 你的 API Key
  const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/C-B0074-001?Authorization=${apiKey}`;
  // 取得氣象站對應的縣市

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // console.log("API 回傳資料：", data); // 先確認 API 的資料格式
        if (
          !data.records ||
          !data.records.data ||
          !data.records.data.stationStatus
        ) {
          console.error("API 回傳的資料結構不符預期", data);
          return; // 結束函式，避免後續程式報錯
        }

        const stationMap = {};
        const countyList = new Set();
        data.records.data.stationStatus.station.forEach((station) => {
          if (station.status === "現存測站") {
            stationMap[station.CountyName] = station.StationID;
            countyList.add(station.CountyName);
          }
        });
        setStations(stationMap);
        setCounties([...countyList]);
      })
      .catch((error) => {
        console.error("API回傳錯誤", error);
      });
  }, []);

  useEffect(() => {
    if (selectedCounty && stations[selectedCounty]) {
      fetch(
        "https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0005-001?Authorization=CWA-6D885349-B9CF-4B71-AAEA-5209ACCA0BEE"
      )
        .then((res) => res.json())
        .then((data) => {
          // console.log("紫外線API回傳資料", data);
          if (!data) {
            console.error("API格式錯誤");
            return;
          }
          const uvMap = {};
          data.records.weatherElement.location.forEach((item) => {
            uvMap[item.StationID] = item.UVIndex;
          });
          // console.log(uvMap);
          setUvData(uvMap);
        });
    }
  }, [selectedCounty, stations]);

  useEffect(() => {
    if (selectedCounty && stations[selectedCounty]) {
      fetch(
        "https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0005-001?Authorization=CWA-6D885349-B9CF-4B71-AAEA-5209ACCA0BEE"
      )
        .then((res) => res.json())
        .then((data) => {
          if (!data) {
            console.error("API格式錯誤");
            return;
          }
          let date = data.records.weatherElement.Date;
          setDate(date);
        });
    }
  }, [selectedCounty, stations]);

  return (
    <div>
      <h1>紫外線指數查詢</h1>
      <label>
        請選擇縣市
        <select
          value={selectedCounty}
          onChange={(e) => setSelectedCounty(e.target.value)} //讓 selectedCounty 狀態更新，讓使用者能夠選擇選項。
        >
          <option value="">請選擇</option>
          {/* 下拉式選單，根據counties陣列，動態產生選項 */}
          {
            counties.map((county) => (
              <option key={county} value={county}>
                {county}
              </option>
            )) //因為是動態渲染，寫入key屬性以增加渲染效率並避免報錯
          }
        </select>
      </label>
      {selectedCounty && stations[selectedCounty] && (
        <div>
          <h2>{selectedCounty}今日最大紫外線指數為</h2>
          <p>
            {uvData[stations[selectedCounty]] !== undefined
              ? `${uvData[stations[selectedCounty]]}`
              : "資料載入中..."}
          </p>
          <p>日期：{date}</p>
        </div>
      )}
    </div>
  );
}

export default App;
