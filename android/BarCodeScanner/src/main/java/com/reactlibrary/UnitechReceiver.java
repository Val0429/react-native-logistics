package com.reactlibrary;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

public class UnitechReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
	    if  ("unitech.scanservice.data" .equals(intent.getAction()))
	    {
	    	System.out.println("unitech.scanservice.data!");
	        Bundle bundle = intent.getExtras();
	        if  (bundle != null )
	        {
	            String text = bundle.getString("text" );
				RelayController inst = RelayController.instance();
	            if(inst != null)
	            	inst.onReceiveText(text);
	        }
	    }
    }
}