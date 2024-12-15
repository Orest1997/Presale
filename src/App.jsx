import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { useAuthState } from "./context/AuthContext";
import { changeColor } from "./utils/constants";

import Header from "./components/Header";

import Home from "./pages/Home"
import Market from "./pages/Market"
import Staking from "./pages/Staking"

import "./App.css";
import "react-toastify/dist/ReactToastify.min.css";
import Presale from "./pages/Presale";

function App() {
  const { authState } = useAuthState();

  useEffect(() => {
    // if (authState.preferDark) {
      // changeColor("--color-headerBg", "#16161600");
      // changeColor("--color-backgroundDim", "#161616");
      // changeColor("--color-panelBgColor", "#2D2D2D");
      // changeColor("--color-switchBtnColor", "#161616");
      // changeColor("--color-btnBgColor", "#2D2D2D");
      // changeColor("--color-gradientText", "linear-gradient(91.27deg, #F1E9B6 18.69%, #996A42 90.88%)");
      // changeColor("--color-base", "#FFFFFF");
      // changeColor("--color-text", "#FFFFFF");
      // changeColor("--color-text1", "#838383");
      // changeColor("--color-text2", "#D49C44");
      // changeColor("--color-expandBgColor", "#515151");
      // changeColor("--color-earnInfoBgColor", "#13131380");
      // changeColor("--color-earnInfoText", "#FFFFFF");
      // changeColor("--color-earnInfoText1", "#D7C494");
      // changeColor("--color-dialogBgColor", "#212121");
      // changeColor("--color-dialogBorderColor", "#4A4A4A");
      // changeColor("--color-homeAmountType", "#7A7A7A");
      // changeColor("--color-homeAmountValue", "#D7C494");
      // changeColor("--color-walletBg1", "#363636");
      // changeColor("--color-walletBg2", "#2B2B2B");
      // changeColor("--color-walletBg3", "#212121");
      // changeColor("--color-boxShadow", "0px 4px 20px rgba(255, 255, 255, 0.11)");
      // changeColor("--color-disabledTextColor", "#BFBFBF");
      // changeColor("--color-tabBgColor", "#333333");
      // changeColor("--color-tabBgActiveColor", "#D49C44");
      // changeColor("--color-tabTextActiveColor", "#161616");
      // changeColor("--color-inputBgColor", "#2D2D2D");
      changeColor("--toastify-color-light", "#212121");
      changeColor("--toastify-text-color-light", "#fff");
      // changeColor("--theme", "dark");
      // changeColor("--color-spinnerBgColor", "#a38e8e");
    // } else {
    //   changeColor("--color-headerBg", "#F5F5F500");
    //   changeColor("--color-backgroundDim", "#F5F5F5");
    //   changeColor("--color-panelBgColor", "#8888881A");
    //   changeColor("--color-switchBtnColor", "#0000001A");
    //   changeColor("--color-btnBgColor", "#c1c1c1");
    //   changeColor("--color-gradientText", "linear-gradient(91.27deg, #545454 18.69%, #020100 90.88%)");
    //   changeColor("--color-base", "#515151");
    //   changeColor("--color-text", "#2D2D2D");
    //   changeColor("--color-text1", "#2D2D2D");
    //   changeColor("--color-text2", "#2E2E2D");
    //   changeColor("--color-expandBgColor", "#BFBFBF");
    //   changeColor("--color-earnInfoBgColor", "#B9B9B980");
    //   changeColor("--color-earnInfoText", "#131313");
    //   changeColor("--color-earnInfoText1", "#515151");
    //   changeColor("--color-dialogBgColor", "#F5F5F5");
    //   changeColor("--color-dialogBorderColor", "#9d9d9d");
    //   changeColor("--color-homeAmountType", "#515151");
    //   changeColor("--color-homeAmountValue", "#DC 9E00");
    //   changeColor("--color-walletBg1", "#F3F3F3");
    //   changeColor("--color-walletBg2", "#E5F0FF");
    //   changeColor("--color-walletBg3", "#D8E3FF");
    //   changeColor("--color-boxShadow", "0px 4px 20px rgba(0, 0, 0, 0.11)" );
    //   changeColor("--color-disabledTextColor", "#515151");
    //   changeColor("--color-tabBgColor", "#E0E0E0");
    //   changeColor("--color-tabBgActiveColor", "#515151");
    //   changeColor("--color-tabTextActiveColor", "#F5F5F5");
    //   changeColor("--color-inputBgColor", "#DCDCDC");
      // changeColor("--toastify-color-light", "#fff");
      // changeColor("--toastify-text-color-light", "#000");
    //   changeColor("--color-spinnerBgColor", "#333");
    //   changeColor("--theme", "light");
    // }
  }, [authState.preferDark]);
  
  return (
  <>
    <ToastContainer autoClose={3000} />

    <div className="main__header">
      <Header />
    </div>

    <div className="main__background">
      <div></div>
      <div></div>
    </div>

    <section className="main__content">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/dashboard" element={<Market />}></Route>
        <Route path="/protect" element={<Staking />}></Route>
        {/* <Route path="/presale" element={<Presale />}></Route>  */}
        {/* <Route path="/mint" element={<Mint />}></Route> */}
        {/* <Route path="/earn" element={<Earn />}></Route> */}
      </Routes>
    </section>
  </>
  );
}

export default App;
