import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import RoomDetail from "./routes/RoomDetail";
import RoomReservation from "./routes/RoomReservation";
import GithubConfirm from "./routes/GithubConfirm";
import KakaoConfirm from "./routes/KakaoConfirm";
import UploadRoom from "./routes/UploadRoom";
import UploadPhotos from "./components/UploadPhotos";
import NaverConfirm from "./routes/NaverConfirm";
import EditRoom from "./routes/EditRoom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement:<NotFound />,
        children : [
            {
                path:"",
                element: <Home />,
            },
            {
                path:"rooms/upload",
                element: <UploadRoom />,
            },
            {
                path:"rooms/:roomPk",
                element: <RoomDetail />,
            },
            {
                path: "rooms/:roomPk/edit",
                element: <EditRoom />,
            },
            {
                path:"rooms/:roomPk/photos",
                element: <UploadPhotos />,
            },
            {
                path:"rooms/:roomPk/reservations",
                element: <RoomReservation />,
            },
            {
                path: "social",
                children: [
                    {
                        path: "github",
                        element: <GithubConfirm />,
                    },
                    {
                        path: "kakao",
                        element: <KakaoConfirm />,
                    },
                    {
                        path: "naver",
                        element: <NaverConfirm />,
                    },
                ],
            },
        ],

    },
]);
    
export default router;
