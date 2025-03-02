# Pag 组件使用文档

## 简介

`Pag` 组件是一个用于播放 PAG 动画的 React 组件。它依赖于 `libpag` 库，并通过加载 `libpag.js` 和 `libpag.wasm` 文件来实现动画播放。

libpag SDK 的运行需要依赖于 libpag.js 和 libpag.wasm 文件，可以简单的理解为 libpag.js 是代理层，libpag.wasm 是核心层。
libpag.wasm 的加载需要通过引入 libpag.js 后调用 PAGInit() 接口进行实例化，这个时候会默认去加载当前执行脚本同级目录下的 libpag.wasm 文件。
当 libp ag.wasm 并不载同级目录下时，可以使用 PAGInit() 上的钩子 locateFile 去指定 libpag.wasm 的路径。

## 用法

```html
<script>
  var script = document.createElement("script");
  script.src =
    "https://music-conf-cdn.y.qq.com/ocs/19fa999_9orxhnIY/424192016f3c4978aed638b3da0da8de.js?tbundle=dll_pag&max_age=2592000&domain=" +
    window.location.hostname;
  document.body.appendChild(script);
</script>
```

```tsx
const thePagRef = useRef<PagRefProps>(null);
<Pag
  ref={thePagRef}
  src="https://kg.qq.com/gtimg/music/common/upload/image/pipa_pag_bmp.pag"
/>
<button onClick={() => thePagRef.current?.play()}>播放</button>
<button onClick={() => thePagRef.current?.pause()}>暂停</button>
```
