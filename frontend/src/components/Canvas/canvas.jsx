import React, {use, useEffect, useRef} from 'react';

function Canvas(props) {
    const ref = useRef(null);

    useEffect(() => {
        const context = ref.current.getContext('2d');
    }, []);

    return (
        <canvas ref={ref}>
            Hello
        </canvas>
    );
}

export default Canvas;