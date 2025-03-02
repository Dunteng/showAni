interface ScriptState {
  loaded: boolean; // 脚本是否已加载
  loading: boolean; // 脚本是否正在加载
  callbacks: (() => void)[]; // 成功加载后的回调函数队列
  errorCallbacks: ((e: Event) => void)[]; // 加载失败后的回调函数队列
}

const scriptStates = new Map<string, ScriptState>(); // 用于存储脚本加载状态的映射

export function loadScript(url: string, callback: () => void, errorCallback?: (e: Event) => void): void {
  let state = scriptStates.get(url); // 获取当前URL的脚本状态
  if (state?.loaded) {
    // 如果脚本已加载，直接执行回调
    callback();
  } else if (state?.loading) {
    // 如果脚本正在加载，将回调添加到队列
    state.callbacks.push(callback);
    if (errorCallback) {
      state.errorCallbacks.push(errorCallback);
    }
  } else {
    // 如果脚本未请求过，创建新的状态
    state = {
      loaded: false,
      loading: true,
      callbacks: [callback],
      errorCallbacks: errorCallback ? [errorCallback] : [],
    };
    scriptStates.set(url, state); // 将状态存储到映射中

    const script = document.createElement("script"); // 创建脚本元素
    script.type = "text/javascript";
    script.src = url;

    script.onload = () => {
      state!.loaded = true; // 设置脚本已加载
      state!.loading = false; // 设置脚本不再加载
      state!.callbacks.forEach((cb) => cb()); // 执行所有成功回调
      state!.callbacks = []; // 清空回调队列
    };

    script.onerror = (e) => {
      state!.loaded = false; // 设置脚本加载失败
      state!.loading = false; // 设置脚本不再加载
      console.error(`Failed to load script ${url}`, e); // 打印错误信息
      state!.errorCallbacks.forEach((cb) => cb(e as Event)); // 执行所有错误回调
      state!.errorCallbacks = []; // 清空错误回调队列
    };

    document.head.appendChild(script); // 将脚本元素添加到文档中
  }
}
