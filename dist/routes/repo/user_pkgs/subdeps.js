"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subDepsArr = exports.subDepsIcons = void 0;
const fa_1 = require("react-icons/fa");
const si_1 = require("react-icons/si");
exports.subDepsIcons = {
    tailwindcss: { icon: si_1.SiTailwindcss, name: 'Tailwind CSS' },
    supabase: { icon: si_1.SiSupabase, name: "Supabase" },
    typescript: { icon: si_1.SiTypescript, name: 'TypeScript' },
    "react-router-dom": { icon: si_1.SiReactrouter, name: 'React Router DOM' },
    "react-query": { icon: si_1.SiReactquery, name: 'React Query' },
    "react-icons": { icon: si_1.SiReact, name: 'React Icons' },
    firebase: { icon: si_1.SiFirebase, name: 'Firebase' },
    dayjs: { icon: si_1.SiGooglecalendar, name: 'Day.js' },
    axios: { icon: si_1.SiAxios, name: 'Axios' },
    "socket.io": { icon: si_1.SiSocketdotio, name: 'Socket.IO' },
    pocketbase: { icon: si_1.SiGoland, name: 'PocketBase' },
    "@testing-library": { icon: si_1.SiTestinglibrary, name: 'Testing Library' },
    "react-to-print": { icon: fa_1.FaPrint, name: 'React To Print' },
    "@tanstack/react-query": { icon: si_1.SiReactquery, name: '@tanstack' },
    rollup: { icon: si_1.SiRollupdotjs, name: 'Rollup.js' },
    express: { icon: si_1.SiExpress, name: 'Express' },
    graphql: { icon: si_1.SiGraphql, name: 'GraphQL' },
    jest: { icon: si_1.SiJest, name: 'Jest' },
    vitest: { icon: si_1.SiVitest, name: 'Vitest' },
    nodemon: { icon: si_1.SiNodemon, name: "Nodemon" },
};
exports.subDepsArr = Object.keys(exports.subDepsIcons);
