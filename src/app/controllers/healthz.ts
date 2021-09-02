import { expressMiddleware } from 'node-healthz'

export default expressMiddleware({
  replaceMe: {
    crucial: true,
    check: () =>
      Promise.reject(new Error('Replace me with some useful health check!')),
  },
})
