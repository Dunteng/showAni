
export interface PagProps {
  src: string;
  /** 动画名字 */
  animationName?: string;
  /** 宽度 需带单位 如10px、10rem */
  width?: string;
  /** 高度 需带单位 如10px、10rem */
  height?: string;
  className?: string;
  styles?: React.CSSProperties;
  /** 重复次数, 0为循环播放 */
  repeatCount?: number;
  /** 设置播放位置的进度，值从0.0到1.0。  */
  progress?: number;
  /** 缩放模式
   * 0 None 内容未缩放。
   * 1 Stretch 内容缩放以适应画布。
   * 2 LetterBox 内容会根据原始未缩放图像的宽高比进行缩放。这是默认值。
   * 3 Zoom 内容会根据原始未缩放图像的宽高比进行缩放。这会导致在一个轴上被裁剪。
   */
  scaleMode?: any;
  /** PAG 会自动缩放 Canvas 的尺寸以适应屏幕的可视尺寸。这个过程可能会改变 Canvas 的宽高以及 style 属性。如果你不希望 PAG 修改 Canvas 的属性，你可以在初始化时取消缩放 */
  useScale?: boolean;
  /** 最大帧率 */
  maxFrameRate?: number;
  /** 获取动画时长回调 */
  durationCb?: (duration: number) => void;
  /** 动画开始播放回调 */
  onAnimationStartCb?: (e: any) => void;
  /** 动画播放结束回调 */
  onAnimationEndCb?: (e: any) => void;
  /** 动画暂停回调 */
  onAnimationPauseCb?: (e: any) => void;
  /** 动画播放回调 */
  onAnimationPlayCb?: (e: any) => void;
  /** 动画重复播放回调 */
  onAnimationRepeatCb?: (e: any) => void;
  /** pag 失败回调 */
  onPagFailCb?: () => void;
  /** 动画卡顿回调 */
  onNotSmoothCb?: () => void;
  /** pageView初始化完成的回调 */
  onPageViewInitCb?: () => void;
  /** 是否打印帧率日志 */
  shouldLogFPS?: boolean;
  /** 是否打印动画时长日志 */
  shouldLogDuration?: boolean;
  /** 是否在初始化后自动播放 */
  autoPlay?: boolean;
  /** 字体包 */
  fontFamily?: {
    name: string;
    url: string;
  };
}
