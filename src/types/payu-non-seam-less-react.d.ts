declare module 'payu-non-seam-less-react' {
  interface PayUPaymentParams {
    key: string;
    transactionId: string;
    amount: string;
    productInfo: string;
    firstName: string;
    email: string;
    phone: string;
    ios_surl: string;
    ios_furl: string;
    android_surl: string;
    android_furl: string;
    environment: '0' | '1';
    userCredential?: string;
    additionalParam?: {
      udf1?: string;
      udf2?: string;
      udf3?: string;
      udf4?: string;
      udf5?: string;
      payment_related_details_for_mobile_sdk?: string;
      vas_for_mobile_sdk?: string;
      payment?: string;
      validate_vpa?: string;
    };
    payUSIParams?: {
      isFreeTrial?: boolean;
      billingAmount: string;
      billingInterval: number;
      paymentStartDate: string;
      paymentEndDate: string;
      billingCycle: 'daily' | 'weekly' | 'yearly' | 'adhoc' | 'once' | 'monthly';
      remarks?: string;
      billingCurrency: string;
    };
  }

  interface PayUCheckoutProConfig {
    primaryColor?: string;
    secondaryColor?: string;
    merchantName?: string;
    showExitConfirmationOnCheckoutScreen?: boolean;
    showExitConfirmationOnPaymentScreen?: boolean;
    autoSelectOtp?: boolean;
    merchantResponseTimeout?: number;
    surePayCount?: number;
    merchantSMSPermission?: boolean;
    autoApprove?: boolean;
    showCbToolbar?: boolean;
    cartDetails?: any[];
    paymentModesOrder?: any[];
    offer_details?: any[];
  }

  interface PaymentObject {
    payUPaymentParams: PayUPaymentParams;
    payUCheckoutProConfig?: PayUCheckoutProConfig;
  }

  interface PayUBizSdk {
    openCheckoutScreen(paymentObject: PaymentObject): void;
    hashGenerated(result: { [key: string]: string }): void;
    // Add other methods if needed, e.g., for VPA validation or listing apps
    // validateVPA(params: any, errorCallback: (error: any) => void, successCallback: (result: any) => void): void;
    // intentApps(callback: (apps: any) => void): void;
  }

  const PayUBizSdk: PayUBizSdk;
  export default PayUBizSdk;
}
