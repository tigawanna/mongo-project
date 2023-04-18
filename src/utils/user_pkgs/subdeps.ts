import { FaPrint } from 'react-icons/fa';
import {
    SiGraphql,
    SiReact,
    SiFirebase,
    SiTypescript,
    SiTailwindcss,
    SiReactquery,
    SiReactrouter,
    SiGooglecalendar,
    SiAxios,
    SiSocketdotio,
    SiGoland,
    SiTestinglibrary,
    SiExpress,
    SiRollupdotjs,
    SiJest,
    SiVitest,
    SiSupabase
    
} from 'react-icons/si'



export const subDepsIcons = {
    tailwindcss: { icon: SiTailwindcss, name: 'Tailwind CSS' },
    supabase:{icon:SiSupabase,name:"Supabase"},
    typescript: { icon: SiTypescript, name: 'TypeScript' },
    "react-router-dom": { icon: SiReactrouter, name: 'React Router DOM' },
    "react-query": { icon: SiReactquery, name: 'React Query' },
    "react-icons": { icon: SiReact, name: 'React Icons' },
    firebase: { icon: SiFirebase, name: 'Firebase' },
    dayjs: { icon: SiGooglecalendar, name: 'Day.js' },
    axios: { icon: SiAxios, name: 'Axios' },
    "socket.io": { icon: SiSocketdotio, name: 'Socket.IO' },
    pocketbase: { icon: SiGoland, name: 'PocketBase' },
    "@testing-library": { icon: SiTestinglibrary, name: 'Testing Library' },
    "react-to-print": { icon: FaPrint, name: 'React To Print' },
    "@tanstack/react-query": { icon: SiReactquery, name: '@tanstack' },
    rollup: { icon: SiRollupdotjs, name: 'Rollup.js' },
    express: { icon: SiExpress, name: 'Express' },
    graphql: { icon: SiGraphql, name: 'GraphQL' },
    jest: { icon: SiJest, name: 'Jest' },
    vitest: { icon: SiVitest, name: 'Vitest' }
};



type subDepsKeys = keyof typeof subDepsIcons;
type subDepsKeysLiteral = `${subDepsKeys}`;

export const subDepsArr = Object.keys(subDepsIcons) as subDepsKeys[];
export type ISubDeps = subDepsKeysLiteral;
