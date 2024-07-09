export const isRouteInArray = (currentRoute: any, routeArray: any) => {
    return !routeArray.some((item: any) => item === currentRoute);
}

export const changeRouteData = (data: any) =>{
    data.forEach((item: any) =>{
        item.routes = item?.children
        if (item?.children && item?.children.length > 0){
        changeRouteData(item?.children)
        }
    })
    return data
}

export const findRouteByPath = (routes: any, currentPath: any) => {
    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        if (route.path === currentPath) {
            return true;
        }
        if (route.children) {
            const foundInChildren = findRouteByPath(route.children, currentPath);
            if (foundInChildren) {
                return true;
            }
        }
    }
    return false;
}