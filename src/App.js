// import './App.css';
import { useEffect } from 'react';
import axios from 'axios';

function App() {
      useEffect(()=> {
      axios
        .get(
          "https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0005-001?Authorization=CWA-6D885349-B9CF-4B71-AAEA-5209ACCA0BEE"
        )
        .then((response)=> console.log("API回應資料", response.data))
        .catch((error)=> console.error("API錯誤", error));
    },[]);
  return <h1>API 測試中，請開啟 Console 查看</h1>;
}

export default App;
