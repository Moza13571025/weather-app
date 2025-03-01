import "./App.css";
import { useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
// import axios from "axios";

function App() {
  const [stations, setStations] = useState({}); // 存放縣市對應的 StationID
  const [counties, setCounties] = useState([]); // 存放所有縣市
  const [selectedCounty, setSelectedCounty] = useState(""); //存放使用者選取的縣市
  const [uvData, setUvData] = useState({}); // 存放 UVIndex
  const [date, setDate] = useState([]);

  useEffect(() => {
    fetch("https://weather-api-proxy-snowy.vercel.app/api/weather")
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
      fetch("https://weather-api-proxy-snowy.vercel.app/api/uv")
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
      fetch("https://weather-api-proxy-snowy.vercel.app/api/uv")
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
    <>
      <h1>今日最大紫外線指數查詢</h1>
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
              : "觀測站無資料，請選擇其他縣市"}
          </p>
          <p>日期：{date}</p>
        </div>
      )}
      <small>
        <ul>
          <li>本網頁是我串接API的小作品。</li>
          <li>
            主要功能是讓用戶可以根據『縣市名稱』，查詢今日『最大紫外線指數』。
          </li>
          <li>
            開發過程
            <ol>
              <li>
                <strong>遇到的困難：當1支API資料不足以取得所需變數</strong>
                --紫外線指數API資料只有『氣象站ID』沒有『縣市名稱』
                <br></br>
                <strong>解決的方式：</strong>
                找到另一支有『縣市名稱』的API--『有人氣象觀測站列表』，用來建立『氣象站ID』和『縣市名稱』的對應關係，再讓表單渲染出『縣市名稱』，讓使用者選擇。
              </li>
              <li>
                <strong>遇到的困難：用React串接API如何隱藏金鑰？</strong>
                --常見開源天氣API不需要金鑰，但中央氣象局API必須申請個人金鑰，寫入React元件恐暴露於外。
                <br></br>
                <strong>解決的方式：</strong>
                另以Node.js撰寫後端程式向中央氣象局API取得資料，並設置好環境變數、將後端部署在代理伺服器，供本專案串接。
              </li>
            </ol>
          </li>
        </ul>
      </small>
    </>
  );
}

export default App;
