export class WebViewApi {
  constructor(readonly containerApiRef: any) {}

  public sendMessageToContainer(messageObject): void {
    this.containerApiRef.postMessage(messageObject);
  }

  private showNotification(notificationObject): void {
    this.sendMessageToContainer({
        type: "NOTIFICATION",
        notification: notificationObject
    });
  }

  public showInfoNotification(body): void {
    this.showNotification({
      type: "INFO",
      message: `${body}`
    });
  }

  public showErrorNotification(message, cause) {
    this.showNotification({
      type: "ERROR",
      message: `${message} ${cause}`
    });
  }
}
