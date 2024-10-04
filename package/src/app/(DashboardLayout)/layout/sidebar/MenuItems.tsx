import * as Icons from '@mui/icons-material';
import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [

 

  {
    navlabel: true,
    subheader: "Products",
  },
/*
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },


  {
    navlabel: true,
    subheader: "Products",
  },*/
  {
    id: uniqueId(),
    title: "Show Products",
    icon: Icons.StorageOutlined,
    href: "/pages/products",
  },
  {
    id: uniqueId(),
    title: "Add Products",
    icon: Icons.ConstructionOutlined,
    href: "/pages/products/addproducts",
  },
  {
    id: uniqueId(),
    title: "Search and replace ",
    icon: Icons.ContentPasteSearch,
    href: "/pages/products/search",
  },
  {
    navlabel: true,
    subheader: "Descriptions",
  },
  {
    id: uniqueId(),
    title: "Generic Descriptions",
    icon: Icons.Description,
    href: "/pages/descriptions",
  },
  {
    id: uniqueId(),
    title: "Add Gen Descriptions",
    icon: Icons.ConstructionSharp,
    href: "/pages/descriptions/add",
  },

  {
    navlabel: true,
    subheader: "Manage",
  },
  {
    id: uniqueId(),
    title: "Product Settings",
    icon: Icons.SettingsOutlined,
    href: "/pages/Manage/types",
  },
  
  {
    id: uniqueId(),
    title: "Upload database XML",
    icon: Icons.UploadFile,
    href: "/pages/Manage/uploadfile",
  },


  /*
  {
    navlabel: true,
    subheader: "Utilities",
  },
  {
    id: uniqueId(),
    title: "Typography",
    icon: IconTypography,
    href: "/utilities/typography",
  },
  {
    id: uniqueId(),
    title: "Shadow",
    icon: IconCopy,
    href: "/utilities/shadow",
  },
  {
    navlabel: true,
    subheader: "Auth",
  },
  {
    id: uniqueId(),
    title: "Login",
    icon: IconLogin,
    href: "/authentication/login",
  },
  {
    id: uniqueId(),
    title: "Register",
    icon: IconUserPlus,
    href: "/authentication/register",
  },*/
];

export default Menuitems;
