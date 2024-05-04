const onDocumentReady = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  if (canvas === null) {
    alert('Unable to find canvas');
    return;
  }

  const gl = canvas.getContext('webgl');

  if (gl === null) {
    alert('Unable to initialize WebGL');
    return;
  }

  gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

  const adjustCanvas = () => {
    const dw = canvas.clientWidth;
    const dh = canvas.clientHeight;

    if (canvas.width !== dw || canvas.height !== dh) {
      canvas.width = dw;
      canvas.height = dh;
      gl.viewport(0, 0, dw, dh);
    }
  };

  adjustCanvas();

  const resizeObserver = new ResizeObserver(() => {
    adjustCanvas();
  });

  resizeObserver.observe(canvas, { box: 'content-box' });
};

document.addEventListener('DOMContentLoaded', () => {
  onDocumentReady();
});
