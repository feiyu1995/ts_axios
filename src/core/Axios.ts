import {  AxiosRequestConfig, AxiosPromise, Method, AxiosResponse, ResolvedFn, RejectedFn  } from '../types'
import dispatchRequest from './dispatchRequest'
import InterceptorManage from './InterceptorManage'
interface Interceptors {
  request: InterceptorManage<AxiosRequestConfig>    
  response: InterceptorManage<AxiosResponse>    
}

interface PromiseChain {
  resolved: ResolvedFn | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

export default class Axios {

  interceptors: Interceptors

  constructor() {
    this.interceptors = {
      request: new InterceptorManage<AxiosRequestConfig>(),
      response: new InterceptorManage<AxiosResponse>()
    }
  }

  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }
    const chain: PromiseChain[] = [{
      resolved: dispatchRequest,
      rejected: undefined
    }]
  
    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })
  
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })
  
    let promise = Promise.resolve(config)
  
    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }
  
    return promise
  }

  get(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  delete(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  head(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  options(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('option', url, config)
  }

  post(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('post', url, config)
  }

  put(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('put', url, config)
  }

  patch(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('patch', url, config)
  }

  _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }
  _requestMethodWithData(method: Method, url: string, data?: any ,config?: AxiosRequestConfig): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data
      })
    )
  }
}