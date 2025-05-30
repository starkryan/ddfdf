declare module 'payu-upi-react' {
  interface PayUUPIInterface {
    makeUPIPayment(params: any, errorCallback: (error: any) => void, successCallback: (result: any) => void): void;
    makeUPIPaymentSeamless(params: any, errorCallback: (error: any) => void, successCallback: (result: any) => void): void;
    validateVPA(params: any, errorCallback: (error: any) => void, successCallback: (result: any) => void): void;
    intentApps(callback: (intentApps: any) => void): void;
    // Methods required by NativeEventEmitter (if it's still used directly with this module)
    addListener(eventType: string): void;
    removeListeners(count: number): void;
  }

  const PayUUPI: PayUUPIInterface;
  export default PayUUPI;
}
