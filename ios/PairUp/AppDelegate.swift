import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Security

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  // ✅ Called on first app launch only
  func clearApplicationCacheOnFirstAppRun() {
    let storageKey = "kIsNotTheFirstAppRun"
    let defaults = UserDefaults.standard
    let isFirstRun = !defaults.bool(forKey: storageKey)

    if isFirstRun {
      print("🧼 First app run. Clearing Application Support + Keychain")
      clearApplicationSupportDirectory()
      clearKeychainOnFirstAppRun()
      defaults.set(true, forKey: storageKey)
    }
  }

  func clearApplicationSupportDirectory() {
    let fileManager = FileManager.default
    do {
      let appSupportURL = try fileManager.url(
        for: .applicationSupportDirectory,
        in: .userDomainMask,
        appropriateFor: nil,
        create: true
      )
      let contents = try fileManager.contentsOfDirectory(atPath: appSupportURL.path)
      for item in contents {
        let itemPath = appSupportURL.appendingPathComponent(item).path
        try fileManager.removeItem(atPath: itemPath)
        print("🗑️ Removed item at path: \(itemPath)")
      }
    } catch {
      print("❌ Error clearing Application Support directory: \(error)")
    }
  }

  // ✅ Clears all Keychain items (used by react-native-encrypted-storage under the hood)
  func clearKeychainOnFirstAppRun() {
    let secItemClasses: [CFString] = [
      kSecClassGenericPassword,
      kSecClassInternetPassword,
      kSecClassCertificate,
      kSecClassKey,
      kSecClassIdentity
    ]
    
    for itemClass in secItemClasses {
      let spec: [CFString: Any] = [kSecClass: itemClass]
      let status = SecItemDelete(spec as CFDictionary)
      if status == errSecSuccess {
        print("🔐 Cleared keychain class: \(itemClass)")
      } else if status != errSecItemNotFound {
        print("❌ Error clearing keychain class: \(itemClass), code: \(status)")
      }
    }
  }

  // 🔁 Main app launch
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // ✅ Clear Keychain + Cache if first install
    clearApplicationCacheOnFirstAppRun()

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "PairUp",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}

