import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Platform from "../pages/platform/page";
import Work from "../pages/work/page";
import About from "../pages/about/page";
import BookDemo from "../pages/book-demo/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/platform",
    element: <Platform />,
  },
  {
    path: "/work",
    element: <Work />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/book-demo",
    element: <BookDemo />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;