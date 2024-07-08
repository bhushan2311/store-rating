import { createContext, useState } from "react";

export const AppContext = createContext(null);

const AppProvider = (props) =>{

    const [storeOwnerData, setStoreOwnerData] = useState({});
    const [userData, setUserData] = useState(null);
    return(
        <AppContext.Provider value={{storeOwnerData, setStoreOwnerData, userData, setUserData}}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppProvider;