using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using MyLiverpool.Common.Utilities;
using StackExchange.Redis;

namespace MyLfc.Common.Web.DistributedCache
{
    public class DistributedCacheManager : IDistributedCacheManager
    {
        private readonly IDistributedCache _distributedCache;

        public DistributedCacheManager(IDistributedCache distributedCache)
        {
            _distributedCache = distributedCache;
        }

        public async void Set<T>(string key, T obj)
        {
            try
            {
                await _distributedCache.SetAsync(key, obj.Serialize());
            }
            catch (RedisConnectionException)
            {
            }
        }

        public async void SetString(string key, string obj)
        {
            try
            {
                await _distributedCache.SetStringAsync(key, obj);
            }
            catch (RedisConnectionException)
            {
            }
        }

        public async Task<T> GetAsync<T>(string key)
        {
            try
            {
                var cacheValue = await _distributedCache.GetAsync(key);
                if (cacheValue != null)
                {
                    return cacheValue.Deserialize<T>();
                }
            }
            catch (RedisConnectionException)
            {
            }

            return default(T);
        }

        public async Task<string> GetStringAsync(string key)
        {
            try
            {
                return await _distributedCache.GetStringAsync(key);
            }
            catch (RedisConnectionException)
            {
            }

            return null;
        }

        public async void Remove(string key)
        {
            try
            {
                await _distributedCache.RemoveAsync(key);
            }
            catch (RedisConnectionException)
            {
            }
        }

        public async Task<T> GetOrCreateAsync<T>(string key, Func<Task<T>> method)
        {
            T result;
            try
            {
                var cached = await _distributedCache.GetAsync(key);
                if (cached != null)
                {
                    result = cached.Deserialize<T>();
                }
                else
                {
                    result = await (Task<T>)method.DynamicInvoke();
                    if (result != null)
                    {
                        await _distributedCache.SetAsync(key, result.Serialize());
                    }
                }
            }
            catch (RedisConnectionException)
            {
                result = await (Task<T>)method.DynamicInvoke();
            }

            return result;
        }

        public async Task<string> GetOrCreateStringAsync(string key, Func<Task<string>> method)
        {
            string result;
            try
            {
                var cached = await _distributedCache.GetStringAsync(key);
                if (cached != null)
                {
                    return cached;
                }

                result = await (Task<string>)method.DynamicInvoke();
                if (string.IsNullOrWhiteSpace(result))
                {
                    await _distributedCache.RemoveAsync(key);
                }
                else
                {
                    await _distributedCache.SetStringAsync(key, result);
                }
            }
            catch (RedisConnectionException)
            {
                result = await (Task<string>)method.DynamicInvoke();
            }

            return result;
        }
    }
}
