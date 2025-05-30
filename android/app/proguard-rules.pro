# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native Google Mobile Ads Consent SDK rules
-keep class com.google.android.gms.internal.consent_sdk.** { *; }

# Keep rules for Google Play Services Auth API
-keep class com.google.android.gms.auth.api.credentials.** { *; }
-keep interface com.google.android.gms.auth.api.credentials.** { *; }
-keep class * implements com.google.android.gms.auth.api.credentials.** { *; }

# Keep rules for Google HTTP Client Library
-keep class com.google.api.client.http.** { *; }
-keep interface com.google.api.client.http.** { *; }
-keep class com.google.api.client.http.javanet.** { *; }
-keep class * implements com.google.api.client.http.** { *; }

# Keep rules for PayU SDK (even more comprehensive)
-keep class com.payu.** { *; }
-keep interface com.payu.** { *; }
-keep enum com.payu.** { *; }
-keep class * extends com.payu.** { *; }
-keep class * implements com.payu.** { *; }
-keep class **.R$* { *; } # Keep all R classes for resources
-keep class com.payu.ui.view.fragments.** { *; } # Explicitly keep fragments

# Keep rules for Joda-Time
-keep class org.joda.time.** { *; }

# Keep rules for SLF4J
-keep class org.slf4j.impl.StaticLoggerBinder { *; }
-keep class org.slf4j.LoggerFactory { *; }
