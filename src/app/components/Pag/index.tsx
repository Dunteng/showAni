import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { loadScript } from "./utils/loadScript";
import { handleError } from "./utils";
import { PagProps } from "./type";

/** libpag.wasm 核心文件 */
let WASM_FILE: Blob | null = null;

/** 是否正在初始化 */
let isInitializing = false;

/** PAG 初始化 promise */
let initializePAGPromise: Promise<void> | null = null;

/** 动画开始播放时间戳 */
let playStartTimestamp = 0;

/** 动画重复播放时间戳 */
let repeatStartTimestamp = 0;

/** 帧率监控定时器 */
let fpsMonitorTimer: number | null = null;

/** PAG 初始化对象 */
let PAG_INIT: any = null;

export interface PagRefProps {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setProgress: (progress: number) => void;
  destroy: () => void;
}
const DOMAIN = window.location.hostname;
// const pagWasmUrl = `https://music-conf-cdn.y.qq.com/ocs/18fd504_uqFDU231/ea89c95c674842599c9ad28056016bc6.wasm?tbundle=dll_pag&max_age=2592000&domain=${DOMAIN}`; // 4.2.84版本 离线包处理
const pagWasmUrl = `/pag-files/pag.wasm`; // 使用本地文件
const pagJsUrl = `https://music-conf-cdn.y.qq.com/ocs/19fa999_9orxhnIY/424192016f3c4978aed638b3da0da8de.js?tbundle=dll_pag&max_age=2592000&domain=${DOMAIN}`; // 4.2.84版本 离线包处理

const initializePAG = async (params: { fontFamily?: { name: string; url: string } }) => {
  const { fontFamily } = params;
  if (WASM_FILE && PAG_INIT) {
    return;
  }
  if (isInitializing) {
    return initializePAGPromise;
  }

  isInitializing = true;
  initializePAGPromise = (async () => {
    try {
      // 加载wasm文件
      const pagCore = await fetch(pagWasmUrl);
      WASM_FILE = await pagCore.blob();
      console.info("加载 libpag.wasm 核心文件成功");

      // 初始化PAG
      PAG_INIT = await window.libpag.PAGInit({
        locateFile: () => URL.createObjectURL(WASM_FILE as Blob),
      });
      console.info("libpag.PAGInit 成功初始化");

      // 设置素材中的文字字体
      if (fontFamily?.name && fontFamily?.url) {
        const fontBlob = await fetch(fontFamily.url).then((response) => response.blob());
        const fontFile = new window.File([fontBlob], fontFamily.name);
        await PAG_INIT.PAGFont.registerFont(fontFamily.name, fontFile);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      // 根据错误阶段提供更具体的错误信息
      const phase = !WASM_FILE ? "加载WASM文件" : "libpag.PAGInit";
      handleError(`Pag动画-${phase}失败: ${errorMessage}`, error);
      throw error;
    } finally {
      isInitializing = false;
    }
  })();

  return initializePAGPromise;
};

// 提取重复的帧率监控逻辑
const startFPSMonitoring = (pagView: any, src: string, shouldLogFPS: boolean) => {
  if (fpsMonitorTimer) {
    window.clearInterval(fpsMonitorTimer);
  }
  if (shouldLogFPS) {
    fpsMonitorTimer = window.setInterval(() => {
      const fps = pagView?.getDebugData().FPS;
      console.log(`当前${src} PAG动画帧率:`, fps);
    }, 100); // 每100ms更新一次帧率信息
  }
};

// 提取重复的帧率监控停止逻辑
const stopFPSMonitoring = () => {
  if (fpsMonitorTimer) {
    window.clearInterval(fpsMonitorTimer);
    fpsMonitorTimer = null;
  }
};

const Pag = forwardRef((props: PagProps, ref) => {
  const {
    src,
    // 动画名字
    animationName = "",
    repeatCount,
    scaleMode,
    useScale = false,
    maxFrameRate,
    shouldLogFPS = false,
    shouldLogDuration = false,
    autoPlay = true,
    fontFamily,
    durationCb,
    onAnimationStartCb,
    onAnimationEndCb,
    onAnimationRepeatCb,
    onAnimationPauseCb,
    onAnimationPlayCb,
    onPagFailCb,
    onNotSmoothCb,
    onPageViewInitCb,
  } = props;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pagViewRef = useRef<any | null>(null);

  // 暴露给父组件的接口
  useImperativeHandle(ref, () => ({
    play: () => {
      pagViewRef.current?.play();
      // 刷新
      pagViewRef.current?.flush();
      console.info("pag播放");
    },
    pause: () => {
      pagViewRef.current?.pause();
      // 刷新
      pagViewRef.current?.flush();
      console.info("pag暂停");
    },
    stop: () => {
      pagViewRef.current?.stop();
      // 刷新
      pagViewRef.current?.flush();
      console.info("pag停止");
    },
    setProgress: (progress: number) => {
      pagViewRef.current?.setProgress(progress);
      // 刷新
      pagViewRef.current?.flush();
      console.info("pag设置进度", progress);
    },
    destroy: () => {
      pagViewRef.current?.destroy();
      console.info("pag被销毁");
    },
  }));

  useEffect(() => {
    const initPag = async () => {
      try {
        await initializePAG({
          fontFamily,
        });
      } catch (error) {
        handleError(`Pag动画-${animationName}加载wasm和PAGInit失败`, error, onPagFailCb);
        return;
      }
      if (WASM_FILE && PAG_INIT) {
        console.info(`Pag动画-${animationName}开始初始化 pag`);

        try {
          const { PAGFile, PAGView } = PAG_INIT;
          const fetchStart = new Date().valueOf();
          console.info(`Pag动画-${animationName}开始fetch pag文件`, src);
          const response = await fetch(src);
          const fetchEnd = new Date().valueOf();
          console.info(`Pag动画-${animationName}成功fetch pag文件`, src, fetchEnd - fetchStart);

          let pagFile: any = null;
          try {
            pagFile = await PAGFile.load(await response.arrayBuffer());
            console.info(`Pag动画-${animationName}成功解析 PAG 文件`, src, new Date().valueOf() - fetchEnd);
            const duration = pagFile.duration() / 1000;
            console.log(`Pag动画-${animationName}PAG文件时长：`, duration);
            durationCb?.(duration);
            // 设置素材中的文字字体
            if (fontFamily?.name && fontFamily?.url) {
              // 获取素材中的文字数量
              const numTexts = pagFile?.numTexts() || 0;
              for (let i = 0; i < numTexts; i++) {
                // 获取文字数据
                const textDoc = pagFile.getTextData(i);
                // 设置文字字体
                textDoc.fontFamily = fontFamily.name;
                // 替换文字
                pagFile.replaceText(i, textDoc);
              }
            }
          } catch (error) {
            handleError(`Pag动画-${animationName}加载PAG文件失败`, error, onPagFailCb);
            return;
          }

          if (!canvasRef.current) {
            return;
          }

          canvasRef.current.width = pagFile.width();
          canvasRef.current.height = pagFile.height();

          const pagView = await PAGView.init(pagFile, canvasRef.current, {
            /** 在页面视图初始化时渲染第一帧。默认为 true。 */
            firstFrame: true,
            /** 如果你需要在 Chrome 浏览器中同屏存在多个 PAGView 实例且不需要在 Safari 上使用，可以尝试使用 canvas2D 模式，需要在 PAGView.init 的时候传入 { useCanvas2D: true } 。这个模式下，会用一个 WebGL 当作渲染器，然后往多个 canvas2D 分发画面，从而规避 WebGL 活跃 context 数量的限制。因为 Safari 上 CanvasRenderingContext2D.drawImage() 的性能很差，所以我们不推荐在 Safari 上使用这个模式。 */
            useCanvas2D: false,
            /** 使用样式缩放画布。默认为 false。 */
            useScale,
          });
          pagViewRef.current = pagView;

          const onAnimationStart = (e: any) => {
            onAnimationStartCb?.(e);
            playStartTimestamp = Date.now();
            repeatStartTimestamp = Date.now();
            startFPSMonitoring(pagView, src, shouldLogFPS);
          };
          pagViewRef.current.removeListener("onAnimationStart", onAnimationStart);
          pagViewRef.current.addListener("onAnimationStart", onAnimationStart);

          const onAnimationEnd = (e: any) => {
            e.setProgress(0);
            onAnimationEndCb?.(e);
            const playEndTimestamp = Date.now();
            const playDuration = playEndTimestamp - playStartTimestamp;
            // 如果播放时间超过PAG文件时长2秒，则认为是卡顿，进行上报
            const diff = Number((playDuration - pagFile.duration() / 1000).toFixed(2));
            if (diff > 1000 * 2) {
              onNotSmoothCb?.();
              handleError(
                `Pag动画-${animationName}播放卡顿, 差值为${diff}毫秒`,
                `Pag动画-${animationName}播放卡顿, 差值为${diff}毫秒`,
              );
            }
            if (shouldLogDuration) {
              console.info(`Pag动画-${animationName}PAG 动画播放用时（ms）：`, playDuration);
            }
            stopFPSMonitoring();
          };
          pagViewRef.current.removeListener("onAnimationEnd", onAnimationEnd);
          pagViewRef.current.addListener("onAnimationEnd", onAnimationEnd);

          const onAnimationRepeat = (e: any) => {
            onAnimationRepeatCb?.(e);
            const repeatEndTimestamp = Date.now();
            const playDuration = repeatEndTimestamp - repeatStartTimestamp;
            repeatStartTimestamp = repeatEndTimestamp; // 更新重复播放开始时间戳
            const diff = Number((playDuration - pagFile.duration() / 1000).toFixed(2));
            // 如果播放时间超过PAG文件时长2秒，则认为是卡顿，进行上报
            if (diff > 1000 * 2) {
              onNotSmoothCb?.();
              handleError(
                `Pag动画-${animationName}播放卡顿, 差值为${diff}毫秒`,
                `Pag动画-${animationName}播放卡顿, 差值为${diff}毫秒`,
              );
            }
            if (shouldLogDuration) {
              console.info(`Pag动画-${animationName}PAG 动画播放用时（ms）：`, playDuration);
            }
            stopFPSMonitoring();
          };
          pagViewRef.current.removeListener("onAnimationRepeat", onAnimationRepeat);
          pagViewRef.current.addListener("onAnimationRepeat", onAnimationRepeat);

          const onAnimationPause = (e: any) => {
            onAnimationPauseCb?.(e);
            stopFPSMonitoring();
          };
          pagViewRef.current.removeListener("onAnimationPause", onAnimationPause);
          pagViewRef.current.addListener("onAnimationPause", onAnimationPause);

          const onAnimationPlay = (e: any) => {
            onAnimationPlayCb?.(e);
            startFPSMonitoring(pagView, src, shouldLogFPS);
          };
          pagViewRef.current.removeListener("onAnimationPlay", onAnimationPlay);
          pagViewRef.current.addListener("onAnimationPlay", onAnimationPlay);

          if (maxFrameRate !== undefined) {
            pagViewRef.current.setMaxFrameRate(maxFrameRate);
          }
          if (repeatCount !== undefined) {
            pagViewRef.current.setRepeatCount(repeatCount);
          }
          if (scaleMode !== undefined) {
            pagViewRef.current.setScaleMode(scaleMode);
          }
          onPageViewInitCb?.();
          if (autoPlay) {
            await pagViewRef.current.play().catch((error: any) => {
              throw error;
            });
          }
        } catch (error) {
          handleError(`Pag动画-${animationName}文件加载失败`, error, onPagFailCb);
        }
      }
    };

    try {
      if (window.libpag) {
        initPag();
        return;
      }
      loadScript(pagJsUrl, () => {
        console.info("Pag动画-成功加载 pag js");
        initPag();
      });
    } catch (error) {
      handleError(`Pag动画-${animationName}加载pagjs失败`, error);
    }

    return () => {
      console.info("===> 销毁 pag");
      stopFPSMonitoring();
      pagViewRef.current?.destroy();
      pagViewRef.current = null;
      canvasRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldLogFPS, shouldLogDuration, autoPlay]);

  return (
    <canvas
      className={props.className}
      style={{ width: props.width || "100%", height: props.height || "100%", ...props.styles }}
      ref={canvasRef}
    />
  );
});

Pag.displayName = "Pag";

export default Pag;
