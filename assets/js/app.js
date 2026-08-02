/* ===== 应用入口：初始化所有模块 ===== */
Object.assign(window.App, {
  /* 切换明暗主题 */
  toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    App.Store.set('theme', isDark ? 'dark' : 'light');
  },
  setTheme(mode) {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    App.Store.set('theme', mode);
  },
  /* 切换主题色 */
  setThemeColor(color) {
    document.documentElement.style.setProperty('--brand-color', color);
    App.Store.set('themeColor', color);
  },
  /* 字体大小 */
  setFontSize(size) {
    document.documentElement.style.fontSize = size + 'px';
    const fontVal = document.getElementById('fontVal');
    if (fontVal) fontVal.textContent = size + 'px';
    App.Store.set('fontSize', size);
  },
  /* 设置面板 */
  openSettings() { document.getElementById('settingsPanel').classList.add('open'); },
  closeSettings() { document.getElementById('settingsPanel').classList.remove('open'); },
  /* 移动端菜单 */
  toggleMobileMenu() { document.getElementById('mobileMenu').classList.toggle('hidden'); },
  /* 图片预览 */
  previewImage(src) {
    document.getElementById('imageViewerImg').src = src;
    const v = document.getElementById('imageViewer');
    v.classList.remove('hidden'); v.classList.add('flex');
  },
  closeImageViewer() {
    const v = document.getElementById('imageViewer');
    v.classList.add('hidden'); v.classList.remove('flex');
  }
});

/* ===== DOM 就绪后初始化 ===== */
document.addEventListener('DOMContentLoaded', function () {
  // 恢复用户设置
  const theme = App.Store.get('theme') || 'light';
  App.setTheme(theme);
  const themeColor = App.Store.get('themeColor') || '#3373ff';
  App.setThemeColor(themeColor);
  const fontSize = App.Store.get('fontSize') || 16;
  const fontRange = document.getElementById('fontRange');
  if (fontRange) fontRange.value = fontSize;
  App.setFontSize(fontSize);

  // 初始化 AOS 滚动动画
  if (window.AOS) {
    AOS.init({ duration: 700, once: true, offset: 60 });
  }

  // 渲染导航与页脚
  App.Components.renderNavbar();
  App.Components.renderFooter();

  // 启动路由
  App.Router.init();

  // 隐藏全局加载动画
  setTimeout(() => {
    const loader = document.getElementById('globalLoader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 300);
    }
  }, 500);

  // 回到顶部按钮显隐 + 导航栏吸顶
  window.addEventListener('scroll', function () {
    const btn = document.getElementById('backToTop');
    if (btn) {
      if (window.scrollY > 400) { btn.style.opacity = '1'; btn.style.pointerEvents = 'auto'; }
      else { btn.style.opacity = '0'; btn.style.pointerEvents = 'none'; }
    }
    const nav = document.getElementById('navbar');
    if (nav) {
      if (window.scrollY > 10) nav.classList.add('nav-scrolled');
      else nav.classList.remove('nav-scrolled');
    }
  });
});

// 兜底保护：最多 3 秒强制隐藏加载动画，防止卡死
setTimeout(() => {
  const loader = document.getElementById('globalLoader');
  if (loader && loader.style.display !== 'none') {
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 300);
  }
}, 3000);
