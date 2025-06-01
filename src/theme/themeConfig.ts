import type { ThemeConfig } from 'antd';

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#52c41a',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#52c41a',
    borderRadius: 4,
    wireframe: false,
    // Component tokens
    colorBgContainer: '#ffffff',
    colorBorder: '#f0f0f0',
    controlOutlineWidth: 2,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    colorTextBase: '#000000e0',
  },
  components: {
    Card: {
      boxShadowTertiary: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)',
      borderRadiusLG: 8,
    },
    Button: {
      borderRadius: 4,
      controlHeight: 36,
    },
    Input: {
      borderRadius: 4,
      controlHeight: 36,
    },
  },
}

export default themeConfig;