
package com.reactlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class RNBarCodeScannerModule extends ReactContextBaseJavaModule {

  private static ReactApplicationContext reactContext;

  public RNBarCodeScannerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNBarCodeScanner";
  }

  @ReactMethod
  public void StartScan() {
    RelayController.instance().startScan(reactContext);
  }

  @ReactMethod
  public void StopScan() {
    RelayController.instance().stopScan(reactContext);
  }

  public static void sendEvent(
          String eventName,
          WritableNativeMap params) {
    reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
  }
}