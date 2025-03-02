import { Animation } from '../components/AnimationCard';

// 定义动画分类
export const categories = [
  "动态按钮",
  "动态图标",
  "数据可视化",
  "品牌展示和营销素材",
  "交互反馈和微交互",
  "复杂路径动画",
  "教育与互动"
];

// 默认 PAG 文件链接
const defaultPagFile = "/pag-files/404.pag";

// 模拟动画数据
export const animations: Animation[] = [
  {
    id: 1,
    title: "渐变按钮",
    category: "动态按钮",
    imageUrl: "/animations/button1.png",
    description: "平滑过渡的渐变按钮效果，悬停时颜色渐变变化",
    pagFile: defaultPagFile
  },
  {
    id: 2,
    title: "菜单图标",
    category: "动态图标",
    imageUrl: "/animations/icon1.png",
    description: "汉堡菜单转换动画，点击时变为关闭图标",
    pagFile: defaultPagFile
  },
  {
    id: 3,
    title: "数据柱状图",
    category: "数据可视化",
    imageUrl: "/animations/chart1.png",
    description: "柱状图生长动画效果，数据加载时平滑过渡",
    pagFile: defaultPagFile
  },
  {
    id: 4,
    title: "品牌Logo展示",
    category: "品牌展示和营销素材",
    imageUrl: "/animations/brand1.png",
    description: "创意Logo揭示动画，元素逐个显示组合成完整logo",
    pagFile: defaultPagFile
  },
  {
    id: 5,
    title: "点赞反馈",
    category: "交互反馈和微交互",
    imageUrl: "/animations/feedback1.png",
    description: "点赞按钮动画效果，点击时有弹跳和颜色变化",
    pagFile: defaultPagFile
  },
  {
    id: 6,
    title: "签名动画",
    category: "复杂路径动画",
    imageUrl: "/animations/path1.png",
    description: "手写签名路径动画，模拟真实书写轨迹",
    pagFile: defaultPagFile
  },
  {
    id: 7,
    title: "引导教程",
    category: "教育与互动",
    imageUrl: "/animations/edu1.png",
    description: "操作引导动画，高亮关键元素和操作步骤",
    pagFile: defaultPagFile
  },
  {
    id: 8,
    title: "悬停按钮",
    category: "动态按钮",
    imageUrl: "/animations/button2.png",
    description: "鼠标悬停特效按钮，添加波纹效果和阴影变化",
    pagFile: defaultPagFile
  },
  {
    id: 9,
    title: "加载图标",
    category: "动态图标",
    imageUrl: "/animations/icon2.png",
    description: "创意加载动画图标，流畅循环旋转效果",
    pagFile: defaultPagFile
  },
  {
    id: 10,
    title: "饼图动画",
    category: "数据可视化",
    imageUrl: "/animations/chart2.png",
    description: "饼图扇形展开动画，展示数据占比变化",
    pagFile: defaultPagFile
  },
  {
    id: 11,
    title: "产品展示",
    category: "品牌展示和营销素材",
    imageUrl: "/animations/brand2.png",
    description: "3D产品旋转展示，展现产品全方位视角",
    pagFile: defaultPagFile
  },
  {
    id: 12,
    title: "表单提交",
    category: "交互反馈和微交互",
    imageUrl: "/animations/feedback2.png",
    description: "表单提交成功动画，包含勾选和确认效果",
    pagFile: defaultPagFile
  },
  {
    id: 13,
    title: "流程图动画",
    category: "复杂路径动画",
    imageUrl: "/animations/path2.png",
    description: "复杂流程图路径动画，展示流程步骤和连接关系",
    pagFile: defaultPagFile
  },
  {
    id: 14,
    title: "角色动画",
    category: "教育与互动",
    imageUrl: "/animations/edu2.png",
    description: "卡通角色引导动画，增加教程趣味性和互动性",
    pagFile: defaultPagFile
  },
  {
    id: 15,
    title: "进度按钮",
    category: "动态按钮",
    imageUrl: "/animations/button3.png",
    description: "带进度条的提交按钮，显示操作进度状态",
    pagFile: defaultPagFile
  },
  {
    id: 16,
    title: "天气图标",
    category: "动态图标",
    imageUrl: "/animations/icon3.png",
    description: "天气状态图标动画，生动展示不同天气状况",
    pagFile: defaultPagFile
  }
]; 