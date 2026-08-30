package com.aksharedge.teacher

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "DyslexiaApp"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  /**
   * react-native-screens requires the saved instance state to be discarded, otherwise fragment
   * state restoration produces a white screen when returning from the background (doc 19 §2).
   */
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
  }
}