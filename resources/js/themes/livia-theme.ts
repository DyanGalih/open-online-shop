import type { ThemeConfig } from 'antd';

export const liviaTheme: ThemeConfig = {
    token: {
        colorPrimary: '#859b84',
        colorPrimaryHover: '#728871',
        colorPrimaryActive: '#5f755e',
        colorSuccess: '#859b84',
        colorBgBase: '#fbf9f6',
        colorTextBase: '#333333',
        colorTextSecondary: '#666666',
        colorBorder: '#eaeaea',
        fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
        borderRadius: 0, // Muted modern square corners for Livia brand
    },
    components: {
        Layout: {
            bodyBg: '#fbf9f6',
            headerBg: 'rgba(251, 249, 246, 0.9)',
            headerPadding: '0 24px',
            footerBg: '#ffffff',
        },
        Button: {
            borderRadius: 0,
            controlHeight: 40,
            textHoverBg: 'rgba(133, 155, 132, 0.1)',
        },
        Typography: {
            colorTextHeading: '#333333',
        },
        Input: {
            borderRadius: 0,
            colorBorder: '#eaeaea',
        },
        Select: {
            borderRadius: 0,
            colorBorder: '#eaeaea',
        },
    },
};
