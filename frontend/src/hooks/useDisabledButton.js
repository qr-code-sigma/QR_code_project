import React, {useEffect} from 'react';

function UseDisabledButton(formData) {
    const [isDisabled, setIsDisabled] = React.useState(true);

    useEffect(() => {
        let isSatisfactory = true;

        Object.values(formData).forEach((item) => {
            if(item.length === 0) {
                isSatisfactory = false;
            }
        })

        if(isSatisfactory) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [formData])

    return isDisabled;
}

export default UseDisabledButton;