import React from 'react';
import { DrawerNavigator } from "react-navigation";
import { Root } from 'native-base';

import { Login, ScanRoot } from './views';
import Lock from './views/shared/lock';
import SideBar from "./views/shared/sidebar";


import I18n from 'react-native-i18n'

I18n.translations = {
  'en': {
    ipaddress: "IP Address",
    port: "Port",
    email: "Email Address",
    pass: "Password",
    login: "login",
    selectLocation:'Select Location',
    search:'Search',
    location:"Localtion",
    orderSingleNo:"Order No",
    packageNo:"Package No",
    packageQty:"Package Qty",
    scan:"scan",
    order:"Order",
    package:"Package",
    submit:"Submit",
    pleaseScan:"Please Scan",
    version:"Version",
    scanRoot:"ScanRoot",
    logout:"Logout",
    lock:"Lock",
    orderNo :"package No",
    scanRecord: "Scan Record",
    scanTime:"Scan Time",
    alertMessage :"Alert Message",
    readyToSubmit:"Ready to submit?",
    tryToSubmitAllLocalOrder:"Try to submit all local order",
    yes :"Yes",
    cancel:"Cancel",
    NoLocalScanEvent : "No local scan event",
    PleaseScanOrderFirst : "Please scan order first",
    NoPackageScanned : "No package scanned",
    DoYouWishToCancelCurrentOrder : "Do you wish to cancel current order",
    thisQRCodeHasBeenScanned:"This QRCode has been scanned",
    pleaseScanAgain:"Please retry again",
    PleaseInputLegalPort: "Please input legal port",
    pleaseInputIpPortBeforeLogin: "Please input ip & port before login",
    PleaseInputCurrentUserOrAdministratorEmailPasswordToUnlock:"Please input current user or administrator's email & password to unlock.",
    unlock:"Unlock",
    WrongPassword:"Wrong password."

  },
  'zh': {
    ipaddress: "IP位址",
    port: "通訊埠",
    email: "電子信箱",
    pass: "密碼",
    login: "登入",
    selectLocation:'搜尋位置',
    search:'搜尋',
    location:"裝箱地點",
    orderSingleNo:"裝箱單號",
    packageNo:"裝箱編號",
    packageQty:"貨品數量",
    scan:"掃描",
    order:"裝箱",
    package:"貨品",
    submit:"完成",
    pleaseScan:"請掃描",
    version:"版本",
    scanRoot:"搜尋位置",
    logout:"登出",
    lock:"鎖定畫面",
    orderNo :"貨品編號",
    scanRecord: "掃描記錄",
    scanTime:"掃描時間",
    alertMessage :"提示訊息",
    readyToSubmit:"是否完成?",
    tryToSubmitAllLocalOrder:"是否上傳所有當地資料",
    yes :"是",
    cancel:"否",
    NoLocalScanEvent : "無本地資料",
    PleaseScanOrderFirst : "請先掃描裝箱單號",
    NoPackageScanned : "沒有貨物資料",
    DoYouWishToCancelCurrentOrder : "是否要刪掉所有資料?",
    thisQRCodeHasBeenScanned:"貨品編碼重複",
    pleaseScanAgain:"請重新掃描",
    PleaseInputLegalPort:"請輸入正確通訊埠",
    pleaseInputIpPortBeforeLogin: "請輸入帳號密碼",
    PleaseInputCurrentUserOrAdministratorEmailPasswordToUnlock:"請輸入管理者帳號密碼來解鎖.",
    unlock:"解鎖",
    WrongPassword:"密碼錯誤"

  }
}


interface Props { }

interface State { }

const Index = DrawerNavigator(
  {
    Login: { 
      screen: Login,
      navigationOptions: ({ navigation }) => ({
        drawerLockMode: 'locked-closed'
      })
    },
    ScanRoot: { screen: ScanRoot },
    Lock: {
      screen: Lock,
      navigationOptions: ({ navigation }) => ({
        drawerLockMode: 'locked-closed'
      })
    }
  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);

export default () => 
  <Root>
    <Index />
  </Root>;