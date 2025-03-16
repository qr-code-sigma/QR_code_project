// Canvas.jsx - Fix the ref handling
import React, { useEffect, forwardRef } from 'react';

const Canvas = forwardRef(({ matrix }, ref) => {
    useEffect(() => {
        if (!ref.current) return;

        const ctx = ref.current.getContext('2d');
        const size = 5;

        const width = matrix[0].length * size;
        const height = matrix.length * size;

        ref.current.width = width;
        ref.current.height = height;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for(let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if(matrix[i][j]) {
                    ctx.fillStyle = "rgb(0 0 0)";
                } else {
                    ctx.fillStyle = "rgb(255 255 255)";
                }
                ctx.fillRect(j*size, i*size, size, size);
            }
        }
    }, [matrix, ref]);

    return <canvas ref={ref} />;
});

export default Canvas;