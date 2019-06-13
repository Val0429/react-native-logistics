package com.reactlibrary;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableNativeMap;


/**
 * Created by Neo on 2018/6/26.
 */

public class RelayController extends Object {

    public static final String START_SCANSERVICE = "unitech.scanservice.start";
    public static final String CLOSE_SCANSERVICE = "unitech.scanservice.close";
    public static final String SOFTWARE_SCANKEY = "unitech.scanservice.software_scankey";

    private static RelayController _instance = null;

    public static RelayController instance() {
        if (_instance == null)
            _instance = new RelayController();
        return _instance;
    }

    public RelayController() {

    }

    public void startScan(ReactApplicationContext reactContext) {
//        Bundle bundle = new Bundle();
//        bundle.putBoolean("close", true);
//        Intent mIntent = new Intent().setAction(START_SCANSERVICE).putExtras(bundle);
//        reactContext.sendBroadcast(mIntent);

//        pressStart(reactContext);
    }

    public void stopScan(ReactApplicationContext reactContext) {
//        Bundle bundle = new Bundle();
//        bundle.putBoolean("close", true);
//        Intent mIntent = new Intent().setAction(CLOSE_SCANSERVICE).putExtras(bundle);
//        reactContext.sendBroadcast(mIntent);

//        pressStop(reactContext);
    }

    public void pressStart(ReactApplicationContext reactContext) {
        Bundle bundle = new Bundle();
        bundle.putBoolean("scan", true);
        Intent mIntent = new Intent().setAction(SOFTWARE_SCANKEY).putExtras(bundle);
        reactContext.sendBroadcast(mIntent);
    }

    public void pressStop(ReactApplicationContext reactContext) {
        Bundle bundle = new Bundle();
        bundle.putBoolean("scan", false);
        Intent mIntent = new Intent().setAction(SOFTWARE_SCANKEY).putExtras(bundle);
        reactContext.sendBroadcast(mIntent);
    }


    public void onReceiveText(String text) {
        WritableNativeMap params = new WritableNativeMap();
        params.putString("scanData", text);
        RNBarCodeScannerModule.sendEvent("notificationReceived", params);
    }
}
