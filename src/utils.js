
export const onCountdown = (time, resolution) =>
    new Promise(resolve =>
      setTimeout(() => {
        resolve(resolution)
      }, time))
