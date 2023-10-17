import { Outlet } from "react-router-dom";

function Stock () {

    return (
        <div className="stockmain">
            <Outlet />
        </div>
    );
};

export default Stock;