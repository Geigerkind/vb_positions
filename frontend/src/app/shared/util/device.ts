export class Device {
  public static isMobileDevice(): boolean {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent) ||
      window.matchMedia("(max-width: 600px)").matches
    );
  }

  public static isIosDevice(): boolean {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent) && "ontouchstart" in window;
  }
}
