import React from 'react';
import { NAV } from '../../constants';

const Navigation = ({onRouteChange, isSignedIn}) => {
    if(isSignedIn){
        return (
            <nav style={{display:'flex', justifyContent: 'flex-end'}}>
                <p onClick={() => onRouteChange(NAV.HOME)} className='f3 link dim black underline pa3 pointer'>Home</p>
                <p onClick={() => onRouteChange(NAV.DETECT)} className='f3 link dim black underline pa3 pointer'>Detect</p>
                <p onClick={() => onRouteChange(NAV.IDENTIFY)} className='f3 link dim black underline pa3 pointer'>Identify</p>
                <p onClick={() => onRouteChange(NAV.SIGN_OUT)} className='f3 link dim black underline pa3 pointer'>Sign out</p>
            </nav>
        );
    } else {
        return (
            <nav style={{display:'flex', justifyContent: 'flex-end'}}>
                <p onClick={() => onRouteChange(NAV.SIGN_IN)} className='f3 link dim black underline pa3 pointer'>Sign In</p>
                <p onClick={() => onRouteChange(NAV.REGISTER)} className='f3 link dim black underline pa3 pointer'>Register</p>
            </nav>

        );
    }
}

export default Navigation;
