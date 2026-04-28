import component from "@/locales/en-US/component";
import Icon from "@ant-design/icons";
import path from "path";

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},

	{
		path: '/bt1',
		name: 'baitap1',
		component: './bt1',
		icon: 'PlusCircleOutlined',
	},
	{
		path: '/bt2',
		name: 'baitap2',
		component: './bt2',
		icon: 'PlusCircleOutlined',
	},

	{
		path: '/th01-bt1',
		name: 'TH01-BT1',
		component: './th01-bt1',
		icon: 'PlusCircleOutlined',
	},

	{
		path: '/th01-bt2',
		name: 'TH01-BT2',
		component: './th01-bt2',
		icon: 'PlusCircleOutlined',
	},

	{
		path: '/th02-bt1',
		name: 'TH02-BT1',
		component: './th02-bt1',
		icon: 'PlusCircleOutlined',
	},

	{
		path: '/th02-bt2',
		name: 'TH02-BT2',
		component: './th02-bt2',
		icon: 'PlusCircleOutlined',
	},

	{
		path: '/th03',
		name: 'TH03',
		component: './th03',
		icon: 'PlusCircleOutlined',
	},

	{
		path: '/th04',
		name: 'TH04',
		component: './th04',
		icon: 'PlusCircleOutlined',
	},

	{
		path: '/th05',
		name: 'TH05',
		component: './th05',
		icon: 'PlusCircleOutlined',
	},

	{
		path: '/th06',
		name: 'TH06',
		component: './th06',
		icon: 'PlusCircleOutlined',
	},

	{
		path: '/KTGK',
		name: 'KTGK',
		component: './KTGK',
		icon: 'PlusCircleOutlined',
	},

	{
		path: '/th07',
		name: 'TH07',
		component: './th07',
		icon: 'PlusCircleOutlined',
	},

	{
		path: '/th08',
		name: 'TH08',
		component: './th08',
		icon: 'PlusCircleOutlined',
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
