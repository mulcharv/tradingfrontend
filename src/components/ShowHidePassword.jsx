import { useState } from 'react';
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye';

function ShowHidePassword(props) {
    const [isVisible, setVisible] = useState(false);
    
    const toggle = () => {
        setVisible(!isVisible);
    };

    return (
        <div className="showhidecont">
            <input type={!isVisible ? "password" : "text"} {...props} required />
            <button type='button' className='showhidebtn' onClick={toggle}>
                {isVisible ? <Icon icon={eye}/> : <Icon icon={eyeOff}/>}
            </button>
        </div>
    )
}

export default ShowHidePassword;
