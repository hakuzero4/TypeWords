import {useSettingStore} from "@/stores/setting.ts";

type Theme = "light" | "dark";
// 获取系统主题
function getSystemTheme(): Theme {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
     return 'dark';
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
  }
  return 'light'; // 默认浅色模式
}

// 交换主题名称
function swapTheme(theme: Theme): Theme {
  return theme === 'light' ? 'dark' : 'light'
}

// 监听系统主题变化
function listenToSystemThemeChange(call: (theme: Theme) => void) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (e.matches) {
            // console.log('系统已切换到深色模式');
            call('dark');
        }
    });
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
        if (e.matches) {
            // console.log('系统已切换到浅色模式');
            call('light');
        }
    });
}

export default function useTheme() {
  const settingStore = useSettingStore()

  // 开启监听系统主题变更,后期可以通过用户配置来决定是否开启
  listenToSystemThemeChange((theme: Theme) => {
    // 如果系统主题变更后和当前的主题一致，则不需要再重新切换
    if(settingStore.theme === theme){
        return;
    }
    
    settingStore.theme = theme;
    setTheme(theme);
  })

  function toggleTheme() {
    // auto模式下，默认是使用系统主题，切换时应该使用当前系统主题为基础进行切换
    settingStore.theme = swapTheme(settingStore.theme === 'auto' ? getSystemTheme() : settingStore.theme as Theme);
    setTheme(settingStore.theme);
  }

  function setTheme(val:string) {
    // auto模式下，则通过查询系统主题来设置主题名称
    document.documentElement.className = val === 'auto' ? getSystemTheme() : val;
  }

  // 获取当前具体的主题名称
  function getTheme():Theme{
    // auto模式下，则通过查询系统主题来获取当前具体的主题名称
    return settingStore.theme === 'auto' ? getSystemTheme() : settingStore.theme as Theme;
  }

  return {
    toggleTheme,
    setTheme,
    getTheme
  }
}
