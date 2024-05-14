// // snippet file for future references
//
// let lastFrameTime;
// // foxNode: Object3D. Sudah ditambahkan dalam scene
// const foxAnim = new AnimationRunner('test/fox-anim.json', foxNode);
// function runAnim(currentTime: number) {
//   if (lastFrameTime === undefined) lastFrameTime = currentTime;
//   const deltaSecond = (currentTime - lastFrameTime) / 1000;
//   foxAnim.update(deltaSecond);
//   // Tambahkan render update, animasi, dan lainnya di sini
//   lastFrameTime = currentTime;
//   requestAnimationFrame(runAnim);
// }
// requestAnimationFrame(runAnim);
